import {
  LIMITE_MAXIMO_CARACTERES_MENSAGEM,
  LIMITE_MAXIMO_CARACTERES_REPETIDOS_SEQUENCIA,
  LIMITE_MINIMO_CARACTERES_MENSAGEM,
  PALAVRAS_BLOQUEADAS,
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

function decodificarLeetSpeak(texto: string): string {
  return texto
    .replace(/[4@ª]/g, 'a')
    .replace(/[3€]/g, 'e')
    .replace(/[1|]/g, 'i')
    .replace(/!(?=[a-z0-9])/gi, 'i')
    .replace(/0/g, 'o')
    .replace(/[5$]/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b');
}

export function contemPalavraBloqueada(conteudo: string): boolean {
  const textoNormalizado = decodificarLeetSpeak(conteudo)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  return PALAVRAS_BLOQUEADAS.some(palavra => {
    const palavraNormalizada = decodificarLeetSpeak(palavra)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const caracteres = palavraNormalizada.split('');
    const padraoRegex = caracteres
      .map(caractere => {
        const caractereEscapado = caractere.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        return `${caractereEscapado}+`;
      })
      .join('\\s*[^a-z0-9]*\\s*');

    const expressaoRegular = new RegExp(`(?:^|[^a-z0-9])${padraoRegex}(?:[^a-z0-9]|$)`, 'i');
    return expressaoRegular.test(textoNormalizado);
  });
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
    return { valido: false, motivo: `A mensagem precisa ter pelo menos ${LIMITE_MINIMO_CARACTERES_MENSAGEM} caracteres.` };
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

  if (participante.controle === 'humano' && contemPalavraBloqueada(conteudoNormalizado)) {
    return {
      valido: false,
      motivo: 'Sua mensagem contém palavras ou termos considerados impróprios para o jogo.',
    };
  }

  if (participante.papel === 'jogador') {
    const analistaJaInteragiu = partida.mensagens.some(m => m.remetenteCor === 'analista');

    if (!analistaJaInteragiu) {
      return { valido: false, motivo: 'Você deve aguardar a primeira mensagem do analista.' };
    }

    const proximoTotalCaracteres = participante.caracteresUsados + conteudoNormalizado.length;

    if (proximoTotalCaracteres > partida.orcamentoCaracteresJogador) {
      return { valido: false, motivo: 'O orçamento de caracteres acabou.' };
    }
  }

  if (participante.controle === 'humano' && participante.ultimoEnvioEm) {
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
  const uniqId = Math.random().toString(36).substring(2, 9);
  const mensagem: MensagemPartida = {
    id: `${partida.id}-mensagem-${Date.now()}-${uniqId}`,
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
        participanteAtual.papel === 'jogador'
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
