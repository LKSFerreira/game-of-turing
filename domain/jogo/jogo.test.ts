import { describe, expect, it } from 'vitest';

import {
  avancarParaVeredito,
  buscarParticipanteObrigatorio,
  calcularAjusteMmrAnalista,
  calcularAjusteMmrInterlocutor,
  calcularBonusParticipacao,
  calcularEstatisticasParticipante,
  calcularResultadoPartida,
  criarPartidaPoc,
  finalizarPartidaComVeredito,
  registrarMensagem,
  validarMensagem,
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

  it('controla orçamento de caracteres apenas para interlocutores', () => {
    const partida = {
      ...criarPartidaTeste(),
      orcamentoCaracteresInterlocutor: 10,
    };
    const azul = {
      ...buscarPorCor(partida, 'azul'),
      caracteresUsados: 9,
    };
    const analista = buscarPorCor(partida, 'analista');

    expect(validarMensagem(partida, azul, 'ok', new Date(DATA_BASE))).toEqual({
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
  it('calcula vitória do analista e resultados dos interlocutores pelo domínio', () => {
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
    ).toMatchObject({ venceu: true, ajusteMmr: 25 });
    expect(
      resultado.participantes.find(
        participante => participante.participanteId === 'interlocutor-azul',
      ),
    ).toMatchObject({ venceu: false, ajusteMmr: -10 });
    expect(
      resultado.participantes.find(
        participante => participante.participanteId === 'interlocutor-vermelho',
      ),
    ).toMatchObject({ venceu: true, ajusteMmr: 20 });
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
    });
  });

  it('mantém ajustes de MMR e bônus de participação previsíveis', () => {
    const partida = criarPartidaTeste();
    const vermelho = {
      ...buscarPorCor(partida, 'vermelho'),
      natureza: 'humano' as const,
      missaoSecreta: 'convencer_ia' as const,
    };

    expect(calcularAjusteMmrAnalista(true)).toBe(25);
    expect(calcularAjusteMmrAnalista(false)).toBe(-15);
    expect(calcularBonusParticipacao(6, 15)).toBe(10);
    expect(calcularBonusParticipacao(3, 8)).toBe(5);
    expect(calcularBonusParticipacao(2, 30)).toBe(0);
    expect(calcularAjusteMmrInterlocutor(vermelho, true, 10)).toBe(40);
    expect(calcularAjusteMmrInterlocutor(vermelho, false, 10)).toBe(0);
  });
});
