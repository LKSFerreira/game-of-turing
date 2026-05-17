import { describe, expect, it } from 'vitest';

import {
  calcularAjusteMmrAnalista,
  calcularAjusteMmrJogador,
  calcularAjustePdrAnalista,
  calcularAjustePdrJogador,
  calcularBonusParticipacao,
} from './mmr';
import type { ParticipantePartida } from './tipos';

function criarJogadorBase(overrides: Partial<ParticipantePartida> = {}): ParticipantePartida {
  return {
    id: 'jogador-teste',
    nome: 'Jogador Teste',
    papel: 'jogador',
    cor: 'azul',
    natureza: 'ia',
    controle: 'ia',
    missaoSecreta: 'convencer_humano',
    caracteresUsados: 0,
    ultimoEnvioEm: null,
    ...overrides,
  };
}

describe('calcularAjustePdrAnalista', () => {
  it('retorna +25 na vitória', () => {
    expect(calcularAjustePdrAnalista(true)).toBe(25);
  });

  it('retorna -15 na derrota', () => {
    expect(calcularAjustePdrAnalista(false)).toBe(-15);
  });
});

describe('calcularAjusteMmrAnalista', () => {
  it('retorna +18 na vitória', () => {
    expect(calcularAjusteMmrAnalista(true)).toBe(18);
  });

  it('retorna -12 na derrota', () => {
    expect(calcularAjusteMmrAnalista(false)).toBe(-12);
  });
});

describe('calcularBonusParticipacao', () => {
  it('retorna 10 com 6+ mensagens e 15%+ de orçamento', () => {
    expect(calcularBonusParticipacao(6, 15)).toBe(10);
    expect(calcularBonusParticipacao(10, 50)).toBe(10);
  });

  it('retorna 5 com 3-5 mensagens e 8-14% de orçamento', () => {
    expect(calcularBonusParticipacao(3, 8)).toBe(5);
    expect(calcularBonusParticipacao(5, 14)).toBe(5);
  });

  it('retorna 0 quando abaixo dos limiares', () => {
    expect(calcularBonusParticipacao(2, 30)).toBe(0);
    expect(calcularBonusParticipacao(0, 0)).toBe(0);
    expect(calcularBonusParticipacao(6, 7)).toBe(0);
    expect(calcularBonusParticipacao(2, 7)).toBe(0);
  });
});

describe('calcularAjustePdrJogador', () => {
  it('retorna +20 na vitória base (sem bônus)', () => {
    const jogador = criarJogadorBase();
    expect(calcularAjustePdrJogador(jogador, true, 0)).toBe(20);
  });

  it('retorna -10 na derrota base (sem bônus)', () => {
    const jogador = criarJogadorBase();
    expect(calcularAjustePdrJogador(jogador, false, 0)).toBe(-10);
  });

  it('soma bônus de participação ao ajuste base', () => {
    const jogador = criarJogadorBase();
    expect(calcularAjustePdrJogador(jogador, true, 10)).toBe(30);
    expect(calcularAjustePdrJogador(jogador, false, 5)).toBe(-5);
  });

  it('aplica +10 bônus Mestre do Disfarce para humano com convencer_ia que vence', () => {
    const humanoDisfarce = criarJogadorBase({
      natureza: 'humano',
      missaoSecreta: 'convencer_ia',
    });
    expect(calcularAjustePdrJogador(humanoDisfarce, true, 0)).toBe(30);
  });

  it('NÃO aplica bônus Mestre do Disfarce para IA com convencer_ia', () => {
    const iaDisfarce = criarJogadorBase({
      natureza: 'ia',
      missaoSecreta: 'convencer_ia',
    });
    expect(calcularAjustePdrJogador(iaDisfarce, true, 0)).toBe(20);
  });

  it('NÃO aplica bônus Mestre do Disfarce para humano que perde', () => {
    const humanoDisfarce = criarJogadorBase({
      natureza: 'humano',
      missaoSecreta: 'convencer_ia',
    });
    expect(calcularAjustePdrJogador(humanoDisfarce, false, 0)).toBe(-10);
  });

  it('NÃO aplica bônus Mestre do Disfarce para humano com convencer_humano', () => {
    const humanoNormal = criarJogadorBase({
      natureza: 'humano',
      missaoSecreta: 'convencer_humano',
    });
    expect(calcularAjustePdrJogador(humanoNormal, true, 0)).toBe(20);
  });

  it('acumula bônus participação + Mestre do Disfarce corretamente', () => {
    const humanoDisfarce = criarJogadorBase({
      natureza: 'humano',
      missaoSecreta: 'convencer_ia',
    });
    expect(calcularAjustePdrJogador(humanoDisfarce, true, 10)).toBe(40);
  });
});

describe('calcularAjusteMmrJogador', () => {
  it('retorna +14 na vitória base', () => {
    const jogador = criarJogadorBase();
    expect(calcularAjusteMmrJogador(jogador, true, 0)).toBe(14);
  });

  it('retorna -8 na derrota base', () => {
    const jogador = criarJogadorBase();
    expect(calcularAjusteMmrJogador(jogador, false, 0)).toBe(-8);
  });

  it('soma metade do bônus de participação ao MMR', () => {
    const jogador = criarJogadorBase();
    expect(calcularAjusteMmrJogador(jogador, true, 10)).toBe(19);
    expect(calcularAjusteMmrJogador(jogador, false, 10)).toBe(-3);
  });

  it('aplica +6 bônus Mestre do Disfarce no MMR para humano com convencer_ia que vence', () => {
    const humanoDisfarce = criarJogadorBase({
      natureza: 'humano',
      missaoSecreta: 'convencer_ia',
    });
    expect(calcularAjusteMmrJogador(humanoDisfarce, true, 0)).toBe(20);
  });

  it('acumula participação + Mestre do Disfarce no MMR', () => {
    const humanoDisfarce = criarJogadorBase({
      natureza: 'humano',
      missaoSecreta: 'convencer_ia',
    });
    expect(calcularAjusteMmrJogador(humanoDisfarce, true, 10)).toBe(25);
  });
});
