import type { RespostaIa, SolicitarRespostaIaParametros } from './tipos';
import type {
  ConfiguracaoProviderComInstancia,
  EstadoSaude,
  RegistroProvider,
} from './tipos-orquestrador';
import { ErroIndisponibilidadeIa } from './tipos-orquestrador';

const TEMPO_RECUPERACAO_PADRAO = 30_000;
const LIMITE_ERROS_PADRAO = 3;
const JANELA_LATENCIA = 10;

function criarEstadoSaudeInicial(): EstadoSaude {
  return {
    circuitBreaker: 'fechado',
    falhasConsecutivas: 0,
    ultimaFalha: null,
    latenciaMedia: 0,
    totalRequisicoes: 0,
    totalErros: 0,
  };
}

function criarRegistroProvider(configuracao: ConfiguracaoProviderComInstancia): RegistroProvider {
  return {
    provedor: configuracao.provedor,
    configuracao: {
      nome: configuracao.provedor.nome,
      peso: configuracao.peso,
      tempoRecuperacao: configuracao.tempoRecuperacao ?? TEMPO_RECUPERACAO_PADRAO,
      limiteErros: configuracao.limiteErros ?? LIMITE_ERROS_PADRAO,
    },
    saude: criarEstadoSaudeInicial(),
  };
}

function verificarDisponibilidade(registro: RegistroProvider, agora: number): boolean {
  const { circuitBreaker, ultimaFalha } = registro.saude;
  const { tempoRecuperacao } = registro.configuracao;

  if (circuitBreaker === 'fechado') return true;
  if (circuitBreaker === 'aberto' && ultimaFalha !== null) {
    const tempoDecorrido = agora - ultimaFalha;

    if (tempoDecorrido >= tempoRecuperacao) {
      registro.saude.circuitBreaker = 'meio_aberto';
      return true;
    }

    return false;
  }

  // meio_aberto permite uma tentativa
  return circuitBreaker === 'meio_aberto';
}

function registrarSucesso(registro: RegistroProvider, latenciaMs: number): void {
  registro.saude.circuitBreaker = 'fechado';
  registro.saude.falhasConsecutivas = 0;
  registro.saude.totalRequisicoes += 1;

  // Rolling average da latência
  const totalAnterior = registro.saude.totalRequisicoes - 1;
  const amostras = Math.min(totalAnterior, JANELA_LATENCIA);
  registro.saude.latenciaMedia =
    (registro.saude.latenciaMedia * amostras + latenciaMs) / (amostras + 1);
}

function registrarFalha(registro: RegistroProvider, agora: number): void {
  registro.saude.falhasConsecutivas += 1;
  registro.saude.ultimaFalha = agora;
  registro.saude.totalErros += 1;
  registro.saude.totalRequisicoes += 1;

  if (registro.saude.falhasConsecutivas >= registro.configuracao.limiteErros) {
    registro.saude.circuitBreaker = 'aberto';
  }
}

/**
 * Seleciona o próximo provider disponível usando Weighted Round-Robin.
 * Providers com peso maior têm mais chance de serem selecionados.
 * O peso efetivo é ajustado pela latência média quando disponível.
 */
function selecionarProvider(
  registros: RegistroProvider[],
  agora: number,
): RegistroProvider | null {
  const disponiveis = registros.filter(registro =>
    verificarDisponibilidade(registro, agora),
  );

  if (disponiveis.length === 0) return null;

  const pesoTotal = disponiveis.reduce(
    (soma, registro) => soma + registro.configuracao.peso,
    0,
  );

  let sorteio = Math.random() * pesoTotal;

  for (const registro of disponiveis) {
    sorteio -= registro.configuracao.peso;

    if (sorteio <= 0) return registro;
  }

  return disponiveis[disponiveis.length - 1];
}

export type OrquestradorIa = {
  gerarResposta(parametros: SolicitarRespostaIaParametros): Promise<RespostaIa>;
  obterEstadoProviders(): { nome: string; estado: string; latenciaMedia: number }[];
};

/**
 * Cria o orquestrador multi-provider com circuit breaker e fallback automático.
 * Se todos os providers falharem, lança ErroIndisponibilidadeIa.
 */
export function criarOrquestrador(
  configuracoes: ConfiguracaoProviderComInstancia[],
): OrquestradorIa {
  if (configuracoes.length === 0) {
    throw new Error('O orquestrador precisa de pelo menos um provider configurado.');
  }

  const registros = configuracoes.map(criarRegistroProvider);

  async function tentarProvider(
    registro: RegistroProvider,
    parametros: SolicitarRespostaIaParametros,
  ): Promise<RespostaIa> {
    const inicio = Date.now();

    try {
      const resposta = await registro.provedor.gerarResposta(parametros);
      const latencia = Date.now() - inicio;

      registrarSucesso(registro, latencia);

      return resposta;
    } catch (erro) {
      registrarFalha(registro, Date.now());
      throw erro;
    }
  }

  async function gerarResposta(
    parametros: SolicitarRespostaIaParametros,
  ): Promise<RespostaIa> {
    const agora = Date.now();
    const providersOrdenados = [...registros].sort(
      (registroA, registroB) => registroB.configuracao.peso - registroA.configuracao.peso,
    );

    // Tenta o provider selecionado por peso, com fallback sequencial
    const providerSelecionado = selecionarProvider(registros, agora);

    if (providerSelecionado) {
      try {
        return await tentarProvider(providerSelecionado, parametros);
      } catch {
        // Falhou, tenta os outros em ordem de peso
      }
    }

    // Fallback sequencial pelos restantes disponíveis
    for (const registro of providersOrdenados) {
      if (registro === providerSelecionado) continue;
      if (!verificarDisponibilidade(registro, Date.now())) continue;

      try {
        return await tentarProvider(registro, parametros);
      } catch {
        // Próximo provider
      }
    }

    throw new ErroIndisponibilidadeIa();
  }

  function obterEstadoProviders(): { nome: string; estado: string; latenciaMedia: number }[] {
    return registros.map(registro => ({
      nome: registro.configuracao.nome,
      estado: registro.saude.circuitBreaker,
      latenciaMedia: Math.round(registro.saude.latenciaMedia),
    }));
  }

  return { gerarResposta, obterEstadoProviders };
}
