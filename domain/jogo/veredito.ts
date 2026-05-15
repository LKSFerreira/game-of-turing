import { calcularEstatisticasParticipante } from './estatisticas';
import {
  calcularAjusteMmrAnalista,
  calcularAjusteMmrInterlocutor,
  calcularBonusParticipacao,
} from './mmr';
import type {
  NaturezaParticipante,
  ParticipantePartida,
  Partida,
  ResultadoPartida,
  VereditoAnalista,
} from './tipos';

function buscarPorCor(participantes: ParticipantePartida[], cor: 'azul' | 'vermelho') {
  const participante = participantes.find(participanteAtual => participanteAtual.cor === cor);

  if (!participante) {
    throw new Error(`Participante ${cor} não encontrado.`);
  }

  return participante;
}

function missaoFoiCumprida(
  participante: ParticipantePartida,
  rotuloRecebido: NaturezaParticipante,
): boolean {
  if (participante.missaoSecreta === 'convencer_humano') {
    return rotuloRecebido === 'humano';
  }

  if (participante.missaoSecreta === 'convencer_ia') {
    return rotuloRecebido === 'ia';
  }

  return false;
}

export function finalizarPartidaComVeredito(
  partida: Partida,
  vereditoAnalista: VereditoAnalista,
  encerradaEm: string,
): Partida {
  if (partida.fase !== 'veredito' && partida.fase !== 'em_andamento') {
    throw new Error('A partida não pode receber veredito nesta fase.');
  }

  return {
    ...partida,
    fase: 'revelacao',
    vereditoAnalista,
    encerradaEm,
  };
}

export function calcularResultadoPartida(partida: Partida): ResultadoPartida {
  if (!partida.vereditoAnalista) {
    throw new Error('Não é possível calcular resultado sem veredito.');
  }

  const participanteAzul = buscarPorCor(partida.participantes, 'azul');
  const participanteVermelho = buscarPorCor(partida.participantes, 'vermelho');
  const participanteAnalista = partida.participantes.find(
    participanteAtual => participanteAtual.papel === 'analista',
  );

  if (!participanteAnalista) {
    throw new Error('Participante analista não encontrado.');
  }

  const vereditoCorretoAzul = partida.vereditoAnalista.azul === participanteAzul.natureza;
  const vereditoCorretoVermelho =
    partida.vereditoAnalista.vermelho === participanteVermelho.natureza;
  const analistaVenceu = vereditoCorretoAzul && vereditoCorretoVermelho;

  const participantes = partida.participantes.map(participante => {
    const estatisticas = calcularEstatisticasParticipante(partida, participante);

    if (participante.papel === 'analista') {
      return {
        participanteId: participante.id,
        venceu: analistaVenceu,
        ajusteMmr: calcularAjusteMmrAnalista(analistaVenceu),
        bonusParticipacao: 0,
        caracteresUsados: participante.caracteresUsados,
        mensagensEnviadas: estatisticas.mensagensEnviadas,
        palavrasPorMinuto: estatisticas.palavrasPorMinuto,
      };
    }

    const rotuloRecebido =
      participante.cor === 'azul' ? partida.vereditoAnalista!.azul : partida.vereditoAnalista!.vermelho;
    const venceu = missaoFoiCumprida(participante, rotuloRecebido);
    const bonusParticipacao = calcularBonusParticipacao(
      estatisticas.mensagensEnviadas,
      estatisticas.percentualOrcamentoUsado,
    );

    return {
      participanteId: participante.id,
      venceu,
      ajusteMmr: calcularAjusteMmrInterlocutor(participante, venceu, bonusParticipacao),
      bonusParticipacao,
      caracteresUsados: participante.caracteresUsados,
      mensagensEnviadas: estatisticas.mensagensEnviadas,
      palavrasPorMinuto: estatisticas.palavrasPorMinuto,
    };
  });

  return {
    analistaVenceu,
    vereditoCorretoAzul,
    vereditoCorretoVermelho,
    participantes,
  };
}
