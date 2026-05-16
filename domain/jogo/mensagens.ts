import {
  LIMITE_MAXIMO_CARACTERES_MENSAGEM,
  LIMITE_MAXIMO_CARACTERES_REPETIDOS_SEQUENCIA,
  LIMITE_MINIMO_CARACTERES_MENSAGEM,
} from './constantes';
import type { MensagemPartida, ParticipantePartida, Partida, ResultadoValidacao } from './tipos';

function possuiCaracteresRepetidosEmSequencia(conteudo: string): boolean {
  let caractereAnterior = '';
  let totalRepeticoes = 0;

  for (const caractereAtual of conteudo) {
    if (caractereAtual === caractereAnterior) {
      totalRepeticoes += 1;
    } else {
      caractereAnterior = caractereAtual;
      totalRepeticoes = 1;
    }

    if (totalRepeticoes > LIMITE_MAXIMO_CARACTERES_REPETIDOS_SEQUENCIA) {
      return true;
    }
  }

  return false;
}

export function validarMensagem(
  partida: Partida,
  participante: ParticipantePartida,
  conteudo: string,
  enviadaEm: Date,
): ResultadoValidacao {
  if (partida.fase !== 'em_andamento') {
    return { valido: false, motivo: 'O chat está bloqueado nesta fase.' };
  }

  const conteudoNormalizado = conteudo.trim().replace(/\s+/g, ' ');

  if (conteudoNormalizado.length < LIMITE_MINIMO_CARACTERES_MENSAGEM) {
    return { valido: false, motivo: 'A mensagem precisa ter pelo menos 15 caracteres.' };
  }

  if (conteudoNormalizado.length > LIMITE_MAXIMO_CARACTERES_MENSAGEM) {
    return { valido: false, motivo: 'A mensagem ultrapassou 150 caracteres.' };
  }

  if (possuiCaracteresRepetidosEmSequencia(conteudoNormalizado)) {
    return {
      valido: false,
      motivo: 'A mensagem não pode ter mais de 5 caracteres repetidos em sequência.',
    };
  }

  if (participante.papel === 'interlocutor') {
    const proximoTotalCaracteres = participante.caracteresUsados + conteudoNormalizado.length;

    if (proximoTotalCaracteres > partida.orcamentoCaracteresInterlocutor) {
      return { valido: false, motivo: 'O orçamento de caracteres acabou.' };
    }
  }

  if (participante.ultimoEnvioEm) {
    const ultimoEnvioEmMilissegundos = new Date(participante.ultimoEnvioEm).getTime();
    const enviadaEmMilissegundos = enviadaEm.getTime();
    const segundosDesdeUltimoEnvio = Math.floor(
      (enviadaEmMilissegundos - ultimoEnvioEmMilissegundos) / 1000,
    );

    if (segundosDesdeUltimoEnvio < partida.cooldownSegundos) {
      const segundosRestantes = partida.cooldownSegundos - segundosDesdeUltimoEnvio;
      return {
        valido: false,
        motivo: `Aguarde ${segundosRestantes}s antes de enviar outra mensagem.`,
      };
    }
  }

  return { valido: true, conteudoNormalizado };
}

export function registrarMensagem(
  partida: Partida,
  participante: ParticipantePartida,
  conteudo: string,
  criadaEm: string,
): Partida {
  const mensagem: MensagemPartida = {
    id: `${partida.id}-mensagem-${partida.mensagens.length + 1}`,
    partidaId: partida.id,
    remetenteId: participante.id,
    remetenteCor: participante.cor,
    conteudo,
    criadaEm,
  };

  const participantesAtualizados = partida.participantes.map(participanteAtual => {
    if (participanteAtual.id !== participante.id) {
      return participanteAtual;
    }

    return {
      ...participanteAtual,
      caracteresUsados:
        participanteAtual.papel === 'interlocutor'
          ? participanteAtual.caracteresUsados + conteudo.length
          : participanteAtual.caracteresUsados,
      ultimoEnvioEm: criadaEm,
    };
  });

  return {
    ...partida,
    participantes: participantesAtualizados,
    mensagens: [...partida.mensagens, mensagem],
  };
}
