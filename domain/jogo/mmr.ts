import type { ParticipantePartida } from './tipos';

export function calcularAjusteMmrAnalista(venceu: boolean): number {
  return venceu ? 25 : -15;
}

export function calcularAjusteMmrInterlocutor(
  participante: ParticipantePartida,
  venceu: boolean,
  bonusParticipacao: number,
): number {
  const ajusteBase = venceu ? 20 : -10;
  const bonusMestreDisfarce =
    venceu &&
    participante.natureza === 'humano' &&
    participante.missaoSecreta === 'convencer_ia'
      ? 10
      : 0;

  return ajusteBase + bonusParticipacao + bonusMestreDisfarce;
}

export function calcularBonusParticipacao(mensagensEnviadas: number, percentualOrcamentoUsado: number): number {
  if (mensagensEnviadas >= 6 && percentualOrcamentoUsado >= 15) {
    return 10;
  }

  if (mensagensEnviadas >= 3 && percentualOrcamentoUsado >= 8) {
    return 5;
  }

  return 0;
}
