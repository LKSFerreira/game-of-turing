import type { MensagemPartida, ParticipantePartida, Partida } from './tipos';

export type EstatisticasParticipante = {
  participanteId: string;
  mensagensEnviadas: number;
  caracteresUsados: number;
  palavrasPorMinuto: number;
  percentualOrcamentoUsado: number;
};

function contarPalavras(mensagens: MensagemPartida[]): number {
  return mensagens.reduce((totalPalavras, mensagem) => {
    const palavras = mensagem.conteudo
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return totalPalavras + palavras.length;
  }, 0);
}

export function calcularEstatisticasParticipante(
  partida: Partida,
  participante: ParticipantePartida,
): EstatisticasParticipante {
  const mensagensDoParticipante = partida.mensagens.filter(
    mensagem => mensagem.remetenteId === participante.id,
  );
  const palavras = contarPalavras(mensagensDoParticipante);
  const duracaoMinutos = Math.max(partida.duracaoSegundos / 60, 1);
  const percentualOrcamentoUsado =
    participante.papel === 'interlocutor'
      ? Math.round(
          (participante.caracteresUsados / partida.orcamentoCaracteresInterlocutor) * 100,
        )
      : 0;

  return {
    participanteId: participante.id,
    mensagensEnviadas: mensagensDoParticipante.length,
    caracteresUsados: participante.caracteresUsados,
    palavrasPorMinuto: Number((palavras / duracaoMinutos).toFixed(1)),
    percentualOrcamentoUsado,
  };
}
