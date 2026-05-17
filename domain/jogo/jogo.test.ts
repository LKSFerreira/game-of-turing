import { describe, expect, it } from 'vitest';

import {
  avancarParaVeredito,
  atualizarFasePorTempo,
  buscarParticipanteObrigatorio,
  calcularAjusteMmrAnalista,
  calcularAjusteMmrJogador,
  calcularAjustePdrAnalista,
  calcularAjustePdrJogador,
  calcularBonusParticipacao,
  calcularEstatisticasParticipante,
  calcularResultadoPartida,
  criarPartidaPoc,
  finalizarPartidaComVeredito,
  finalizarPartidaPorTempoVeredito,
  registrarMensagem,
  validarMensagem,
  validarVereditoAnalista,
  LIMITE_MINIMO_CARACTERES_MENSAGEM,
} from './index';
import type { ParticipantePartida, Partida } from './tipos';

const DATA_BASE = '2026-05-16T12:00:00.000Z';

function criarPartidaTeste(): Partida {
  return criarPartidaPoc({
    id: 'partida-teste',
    criadaEm: DATA_BASE,
    duracaoSegundos: 60,
  });
}

function buscarPorCor(partida: Partida, cor: ParticipantePartida['cor']): ParticipantePartida {
  const participante = partida.participantes.find(
    participanteAtual => participanteAtual.cor === cor,
  );

  if (!participante) {
    throw new Error(`Participante ${cor} não encontrado no teste.`);
  }

  return participante;
}

describe('validação e registro de mensagens', () => {
  it('normaliza espaços e aceita mensagem válida', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const resultado = validarMensagem(
      partida,
      analista,
      '  Quem   está     fingindo?  ',
      new Date(DATA_BASE),
    );

    expect(resultado).toEqual({
      valido: true,
      conteudoNormalizado: 'Quem está fingindo?',
    });
  });

  it('bloqueia mensagem curta, longa demais, chat fora de fase e cooldown', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const partidaComMensagem = registrarMensagem(
      partida,
      analista,
      'Primeira pergunta',
      DATA_BASE,
    );

    expect(validarMensagem(partida, analista, ' ', new Date(DATA_BASE))).toMatchObject({
      valido: false,
      motivo: `A mensagem precisa ter pelo menos ${LIMITE_MINIMO_CARACTERES_MENSAGEM} caracteres.`,
    });
    expect(validarMensagem(partida, analista, 'x'.repeat(151), new Date(DATA_BASE))).toMatchObject(
      {
        valido: false,
      },
    );
    expect(
      validarMensagem(
        avancarParaVeredito(partida),
        analista,
        'Chat ainda aberto?',
        new Date(DATA_BASE),
      ),
    ).toMatchObject({ valido: false });
    expect(
      validarMensagem(
        partidaComMensagem,
        buscarPorCor(partidaComMensagem, 'analista'),
        'Segunda pergunta',
        new Date('2026-05-16T12:00:01.000Z'),
      ),
    ).toEqual({
      valido: false,
      motivo: 'Aguarde 2s antes de enviar outra mensagem.',
    });
  });

  it('bloqueia mais de 5 caracteres repetidos em sequência', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');

    expect(
      validarMensagem(partida, analista, 'Isso tem aaaaaa repetido', new Date(DATA_BASE)),
    ).toEqual({
      valido: false,
      motivo: 'A mensagem não pode ter mais de 5 caracteres repetidos em sequência.',
    });
    expect(validarMensagem(partida, analista, 'Cinco aaaaa passam', new Date(DATA_BASE))).toEqual({
      valido: true,
      conteudoNormalizado: 'Cinco aaaaa passam',
    });
  });

  it('controla orçamento de caracteres apenas para jogadores', () => {
    const partida = {
      ...criarPartidaTeste(),
      orcamentoCaracteresJogador: 10,
    };
    const azul = {
      ...buscarPorCor(partida, 'azul'),
      caracteresUsados: 9,
    };
    const analista = buscarPorCor(partida, 'analista');

    expect(validarMensagem(partida, azul, 'Mensagem grande', new Date(DATA_BASE))).toEqual({
      valido: false,
      motivo: 'O orçamento de caracteres acabou.',
    });
    expect(validarMensagem(partida, analista, 'Pergunta sem limite', new Date(DATA_BASE))).toEqual({
      valido: true,
      conteudoNormalizado: 'Pergunta sem limite',
    });
  });
});

describe('veredito, estatísticas e MMR', () => {
  it('avança para veredito quando o tempo da partida esgota', () => {
    const partida = criarPartidaTeste();

    expect(atualizarFasePorTempo(partida, new Date('2026-05-16T12:00:59.000Z')).fase).toBe(
      'em_andamento',
    );
    expect(atualizarFasePorTempo(partida, new Date('2026-05-16T12:01:00.000Z')).fase).toBe(
      'veredito',
    );
  });

  it('bloqueia veredito incompleto antes de finalizar análise', () => {
    expect(validarVereditoAnalista({ azul: 'ia' })).toEqual({
      valido: false,
      motivo: 'Classifique Azul e Vermelho antes de finalizar a análise.',
    });
    expect(() =>
      finalizarPartidaComVeredito(avancarParaVeredito(criarPartidaTeste()), {
        vermelho: 'ia',
      }, DATA_BASE),
    ).toThrow('Classifique Azul e Vermelho antes de finalizar a análise.');
  });

  it('calcula vitória do analista e resultados dos jogadores pelo domínio', () => {
    const partida = criarPartidaTeste();
    const partidaFinalizada = finalizarPartidaComVeredito(
      avancarParaVeredito(partida),
      { azul: 'ia', vermelho: 'ia' },
      '2026-05-16T12:01:00.000Z',
    );
    const resultado = calcularResultadoPartida(partidaFinalizada);

    expect(resultado.analistaVenceu).toBe(true);
    expect(resultado.vereditoCorretoAzul).toBe(true);
    expect(resultado.vereditoCorretoVermelho).toBe(true);
    expect(
      resultado.participantes.find(participante => participante.participanteId === 'analista-local'),
    ).toMatchObject({ venceu: true, ajustePdr: 25, ajusteMmr: 18 });
    expect(
      resultado.participantes.find(
        participante => participante.participanteId === 'interlocutor-azul',
      ),
    ).toMatchObject({ venceu: false, ajustePdr: -10, ajusteMmr: -8 });
    expect(
      resultado.participantes.find(
        participante => participante.participanteId === 'interlocutor-vermelho',
      ),
    ).toMatchObject({ venceu: true, ajustePdr: 20, ajusteMmr: 14 });
  });

  it('finaliza veredito por tempo como derrota automática do analista', () => {
    const partidaFinalizada = finalizarPartidaPorTempoVeredito(
      avancarParaVeredito(criarPartidaTeste()),
      '2026-05-16T12:01:15.000Z',
    );
    const resultado = calcularResultadoPartida(partidaFinalizada);

    expect(partidaFinalizada.vereditoAnalista).toEqual({
      azul: 'humano',
      vermelho: 'humano',
    });
    expect(resultado).toMatchObject({
      analistaVenceu: false,
      vereditoCorretoAzul: false,
      vereditoCorretoVermelho: false,
    });
  });

  it('calcula estatísticas por participante com base nas mensagens registradas', () => {
    const partida = criarPartidaTeste();
    const vermelho = buscarPorCor(partida, 'vermelho');
    const partidaComMensagem = registrarMensagem(
      partida,
      vermelho,
      'Uso poucas palavras',
      DATA_BASE,
    );
    const vermelhoAtualizado = buscarParticipanteObrigatorio(
      partidaComMensagem,
      vermelho.id,
    );
    const estatisticas = calcularEstatisticasParticipante(
      partidaComMensagem,
      vermelhoAtualizado,
    );

    expect(estatisticas).toMatchObject({
      participanteId: vermelho.id,
      mensagensEnviadas: 1,
      caracteresUsados: 19,
      palavrasPorMinuto: 3,
      percentualOrcamentoUsado: 1,
      inativo: false,
    });
  });

  it('marca jogador sem mensagem como inativo no resultado', () => {
    const partida = criarPartidaTeste();
    const partidaFinalizada = finalizarPartidaComVeredito(
      avancarParaVeredito(partida),
      { azul: 'ia', vermelho: 'ia' },
      '2026-05-16T12:01:00.000Z',
    );
    const resultado = calcularResultadoPartida(partidaFinalizada);

    expect(
      resultado.participantes.find(
        participante => participante.participanteId === 'interlocutor-azul',
      ),
    ).toMatchObject({ inativo: true, mensagensEnviadas: 0 });
    expect(
      resultado.participantes.find(participante => participante.participanteId === 'analista-local'),
    ).toMatchObject({ inativo: false });
  });

  it('mantém ajustes de PDR, MMR oculto e bônus de participação previsíveis', () => {
    const partida = criarPartidaTeste();
    const vermelho = {
      ...buscarPorCor(partida, 'vermelho'),
      natureza: 'humano' as const,
      missaoSecreta: 'convencer_ia' as const,
    };

    expect(calcularAjustePdrAnalista(true)).toBe(25);
    expect(calcularAjustePdrAnalista(false)).toBe(-15);
    expect(calcularAjusteMmrAnalista(true)).toBe(18);
    expect(calcularAjusteMmrAnalista(false)).toBe(-12);
    expect(calcularBonusParticipacao(6, 15)).toBe(10);
    expect(calcularBonusParticipacao(3, 8)).toBe(5);
    expect(calcularBonusParticipacao(2, 30)).toBe(0);
    expect(calcularAjustePdrJogador(vermelho, true, 10)).toBe(40);
    expect(calcularAjustePdrJogador(vermelho, false, 10)).toBe(0);
    expect(calcularAjusteMmrJogador(vermelho, true, 10)).toBe(25);
    expect(calcularAjusteMmrJogador(vermelho, false, 10)).toBe(-3);
  });
});
