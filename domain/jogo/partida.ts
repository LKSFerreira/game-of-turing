import {
  COOLDOWN_PADRAO_SEGUNDOS,
  DURACAO_PADRAO_PARTIDA_SEGUNDOS,
  DURACAO_PADRAO_VEREDITO_SEGUNDOS,
  ORCAMENTO_PADRAO_INTERLOCUTOR,
} from './constantes';
import type { ParticipantePartida, Partida } from './tipos';

type CriarPartidaPocParametros = {
  id?: string;
  criadaEm?: string;
  duracaoSegundos?: number;
};

export function criarPartidaPoc(parametros: CriarPartidaPocParametros = {}): Partida {
  const criadaEm = parametros.criadaEm ?? new Date().toISOString();
  const partidaId = parametros.id ?? `poc-${Date.now()}`;

  const participantes: ParticipantePartida[] = [
    {
      id: 'analista-local',
      nome: 'Analista',
      papel: 'analista',
      cor: 'analista',
      natureza: 'humano',
      controle: 'humano',
      missaoSecreta: null,
      caracteresUsados: 0,
      ultimoEnvioEm: null,
    },
    {
      id: 'interlocutor-azul',
      nome: 'Jogador Azul',
      papel: 'interlocutor',
      cor: 'azul',
      natureza: 'ia',
      controle: 'ia',
      missaoSecreta: 'convencer_humano',
      caracteresUsados: 0,
      ultimoEnvioEm: null,
    },
    {
      id: 'interlocutor-vermelho',
      nome: 'Jogador Vermelho',
      papel: 'interlocutor',
      cor: 'vermelho',
      natureza: 'ia',
      controle: 'ia',
      missaoSecreta: 'convencer_ia',
      caracteresUsados: 0,
      ultimoEnvioEm: null,
    },
  ];

  return {
    id: partidaId,
    fase: 'em_andamento',
    criadaEm,
    iniciadaEm: criadaEm,
    encerradaEm: null,
    duracaoSegundos: parametros.duracaoSegundos ?? DURACAO_PADRAO_PARTIDA_SEGUNDOS,
    faseVereditoSegundos: DURACAO_PADRAO_VEREDITO_SEGUNDOS,
    cooldownSegundos: COOLDOWN_PADRAO_SEGUNDOS,
    orcamentoCaracteresInterlocutor: ORCAMENTO_PADRAO_INTERLOCUTOR,
    participantes,
    mensagens: [
      {
        id: `${partidaId}-sistema-inicio`,
        partidaId,
        remetenteId: 'sistema',
        remetenteCor: 'sistema',
        conteudo: 'SISTEMA: Conexão neural estabelecida. Inicie o teste.',
        criadaEm,
      },
    ],
    vereditoAnalista: null,
  };
}

export function buscarParticipanteObrigatorio(
  partida: Partida,
  participanteId: string,
): ParticipantePartida {
  const participante = partida.participantes.find(
    participanteAtual => participanteAtual.id === participanteId,
  );

  if (!participante) {
    throw new Error(`Participante não encontrado: ${participanteId}`);
  }

  return participante;
}

export function calcularSegundosRestantes(partida: Partida, agora: Date): number {
  const inicioEmMilissegundos = new Date(partida.iniciadaEm).getTime();
  const agoraEmMilissegundos = agora.getTime();
  const segundosDecorridos = Math.floor(
    (agoraEmMilissegundos - inicioEmMilissegundos) / 1000,
  );

  return Math.max(0, partida.duracaoSegundos - segundosDecorridos);
}

export function avancarParaVeredito(partida: Partida): Partida {
  if (partida.fase !== 'em_andamento') {
    return partida;
  }

  return {
    ...partida,
    fase: 'veredito',
  };
}

export function atualizarFasePorTempo(partida: Partida, agora: Date): Partida {
  if (partida.fase !== 'em_andamento') {
    return partida;
  }

  if (calcularSegundosRestantes(partida, agora) > 0) {
    return partida;
  }

  return avancarParaVeredito(partida);
}

export function reiniciarPartida(partida: Partida): Partida {
  return criarPartidaPoc({
    id: partida.id,
    duracaoSegundos: partida.duracaoSegundos,
  });
}
