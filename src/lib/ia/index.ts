import { criarOrquestrador } from './orquestrador';
import type { OrquestradorIa } from './orquestrador';
import { provedorGemini } from './provedor-gemini';
import { provedorGithub } from './provedor-github';
import { provedorGroq } from './provedor-groq';
import { provedorOpenRouter } from './provedor-openrouter';
import type { ProvedorIa } from './tipos';
import type { ConfiguracaoProviderComInstancia } from './tipos-orquestrador';

const MAPA_PROVIDERS: Record<string, ProvedorIa> = {
  github: provedorGithub,
  groq: provedorGroq,
  openrouter: provedorOpenRouter,
  gemini: provedorGemini,
};

const PESOS_PADRAO: Record<string, number> = {
  github: 100, // Força a ser o provedor principal absoluto
  gemini: 3,
  groq: 2,
  openrouter: 1,
};

let orquestradorCache: OrquestradorIa | null = null;

function parseProvidersAtivos(): ConfiguracaoProviderComInstancia[] {
  const listaProviders = process.env.AI_PROVIDERS;
  const listaPesos = process.env.AI_PROVIDER_WEIGHTS;

  const limiteFalhas = parseInt(process.env.AI_CIRCUIT_BREAKER_THRESHOLD ?? '3', 10);
  const tempoRecuperacao = parseInt(process.env.AI_CIRCUIT_BREAKER_RECOVERY_MS ?? '30000', 10);

  if (!listaProviders) {
    // Tenta usar AI_PROVIDER singular
    const providerUnico = process.env.AI_PROVIDER?.toLowerCase();
    if (providerUnico && MAPA_PROVIDERS[providerUnico]) {
      return [{
        provedor: MAPA_PROVIDERS[providerUnico],
        peso: PESOS_PADRAO[providerUnico] ?? 1,
        limiteErros: limiteFalhas,
        tempoRecuperacao,
      }];
    }

    // Se AI_PROVIDER não estiver configurado ou for inválido, tenta detectar as chaves presentes
    const detectados: ConfiguracaoProviderComInstancia[] = [];

    if (process.env.GITHUB_TOKEN) {
      detectados.push({
        provedor: MAPA_PROVIDERS.github,
        peso: PESOS_PADRAO.github,
        limiteErros: limiteFalhas,
        tempoRecuperacao,
      });
    }
    if (process.env.GEMINI_API_KEY) {
      detectados.push({
        provedor: MAPA_PROVIDERS.gemini,
        peso: PESOS_PADRAO.gemini,
        limiteErros: limiteFalhas,
        tempoRecuperacao,
      });
    }
    if (process.env.GROQ_API_KEY) {
      detectados.push({
        provedor: MAPA_PROVIDERS.groq,
        peso: PESOS_PADRAO.groq,
        limiteErros: limiteFalhas,
        tempoRecuperacao,
      });
    }
    if (process.env.OPENROUTER_API_KEY) {
      detectados.push({
        provedor: MAPA_PROVIDERS.openrouter,
        peso: PESOS_PADRAO.openrouter,
        limiteErros: limiteFalhas,
        tempoRecuperacao,
      });
    }

    return detectados;
  }

  const nomes = listaProviders.split(',').map(nome => nome.trim().toLowerCase());
  const pesos = listaPesos
    ? listaPesos.split(',').map(peso => parseInt(peso.trim(), 10))
    : [];

  return nomes.reduce<ConfiguracaoProviderComInstancia[]>((acumulador, nome, indice) => {
    const provedor = MAPA_PROVIDERS[nome];

    if (!provedor) return acumulador;

    acumulador.push({
      provedor,
      peso: pesos[indice] ?? PESOS_PADRAO[nome] ?? 1,
      limiteErros: limiteFalhas,
      tempoRecuperacao,
    });

    return acumulador;
  }, []);
}

/** Retorna o orquestrador multi-provider configurado via variáveis de ambiente. */
export function obterOrquestrador(): OrquestradorIa {
  if (orquestradorCache) return orquestradorCache;

  const configuracoes = parseProvidersAtivos();

  orquestradorCache = criarOrquestrador(configuracoes);

  return orquestradorCache;
}

/**
 * Compatibilidade retroativa: retorna um único provider pelo nome.
 * Usado apenas em testes e desenvolvimento local.
 */
export function obterProvedorIa(nomeProvider = process.env.AI_PROVIDER): ProvedorIa {
  const chaveProvider = nomeProvider?.toLowerCase() || 'gemini';
  const provedor = MAPA_PROVIDERS[chaveProvider];

  if (!provedor) {
    const primeiroProvedor = Object.values(MAPA_PROVIDERS)[0];
    if (!primeiroProvedor) {
      throw new Error('Nenhum provedor de IA configurado no sistema.');
    }
    return primeiroProvedor;
  }

  return provedor;
}

export type { ProvedorIa, RespostaIa, SolicitarRespostaIaParametros } from './tipos';
export type { OrquestradorIa } from './orquestrador';
export { ErroIndisponibilidadeIa } from './tipos-orquestrador';
