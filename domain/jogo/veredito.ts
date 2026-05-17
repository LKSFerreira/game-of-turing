import { calcularEstatisticasParticipante } from './estatisticas';
import {
  calcularAjustePdrAnalista,
  calcularAjustePdrJogador,
  calcularAjusteMmrAnalista,
  calcularAjusteMmrJogador,
  calcularBonusParticipacao,
} from './mmr';
import type {
  NaturezaParticipante,
  ParticipantePartida,
  Partida,
  ResultadoPartida,
  ResultadoValidacaoVeredito,
  VereditoAnalista,
  VereditoAnalistaParcial,
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

function obterNaturezaOposta(natureza: NaturezaParticipante): NaturezaParticipante {
  return natureza === 'humano' ? 'ia' : 'humano';
}

export function validarVereditoAnalista(
  vereditoAnalista: VereditoAnalistaParcial,
): ResultadoValidacaoVeredito {
  if (!vereditoAnalista.azul || !vereditoAnalista.vermelho) {
    return {
      valido: false,
      motivo: 'Classifique Azul e Vermelho antes de finalizar a análise.',
    };
  }

  return {
    valido: true,
    veredito: {
      azul: vereditoAnalista.azul,
      vermelho: vereditoAnalista.vermelho,
    },
  };
}

export function finalizarPartidaComVeredito(
  partida: Partida,
  vereditoAnalista: VereditoAnalistaParcial,
  encerradaEm: string,
): Partida {
  if (partida.fase !== 'veredito' && partida.fase !== 'em_andamento') {
    throw new Error('A partida não pode receber veredito nesta fase.');
  }

  const validacaoVeredito = validarVereditoAnalista(vereditoAnalista);

  if (!validacaoVeredito.valido) {
    throw new Error(validacaoVeredito.motivo);
  }

  return {
    ...partida,
    fase: 'revelacao',
    vereditoAnalista: validacaoVeredito.veredito,
    encerradaEm,
  };
}

export function finalizarPartidaPorTempoVeredito(partida: Partida, encerradaEm: string): Partida {
  if (partida.fase !== 'veredito') {
    throw new Error('A derrota por tempo só pode ser aplicada na fase de veredito.');
  }

  const participanteAzul = buscarPorCor(partida.participantes, 'azul');
  const participanteVermelho = buscarPorCor(partida.participantes, 'vermelho');

  return finalizarPartidaComVeredito(
    partida,
    {
      azul: obterNaturezaOposta(participanteAzul.natureza),
      vermelho: obterNaturezaOposta(participanteVermelho.natureza),
    },
    encerradaEm,
  );
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
        inativo: false,
        ajustePdr: calcularAjustePdrAnalista(analistaVenceu),
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
      inativo: estatisticas.inativo,
      ajustePdr: calcularAjustePdrJogador(participante, venceu, bonusParticipacao),
      ajusteMmr: calcularAjusteMmrJogador(participante, venceu, bonusParticipacao),
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
