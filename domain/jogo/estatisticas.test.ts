import { describe, expect, it } from 'vitest';

import {
  calcularEstatisticasParticipante,
  criarPartidaPoc,
  registrarMensagem,
  buscarParticipanteObrigatorio,
} from './index';
import type { ParticipantePartida, Partida } from './tipos';

const DATA_BASE = '2026-05-16T12:00:00.000Z';

function criarPartidaTeste(): Partida {
  return criarPartidaPoc({ id: 'partida-stats', criadaEm: DATA_BASE, duracaoSegundos: 60 });
}

function buscarPorCor(partida: Partida, cor: ParticipantePartida['cor']): ParticipantePartida {
  return partida.participantes.find(p => p.cor === cor)!;
}

describe('calcularEstatisticasParticipante', () => {
  it('jogador sem mensagens é marcado como inativo', () => {
    const partida = criarPartidaTeste();
    const azul = buscarPorCor(partida, 'azul');
    const stats = calcularEstatisticasParticipante(partida, azul);

    expect(stats.inativo).toBe(true);
    expect(stats.mensagensEnviadas).toBe(0);
    expect(stats.palavrasPorMinuto).toBe(0);
    expect(stats.caracteresUsados).toBe(0);
  });

  it('analista sem mensagens NÃO é marcado como inativo', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const stats = calcularEstatisticasParticipante(partida, analista);

    expect(stats.inativo).toBe(false);
  });

  it('calcula palavras por minuto corretamente com múltiplas mensagens', () => {
    let partida = criarPartidaTeste();
    let analista = buscarPorCor(partida, 'analista');

    partida = registrarMensagem(partida, analista, 'Quem é você afinal', DATA_BASE);
    analista = buscarPorCor(partida, 'analista');
    partida = registrarMensagem(
      partida,
      analista,
      'Responda rapidamente agora',
      '2026-05-16T12:00:05.000Z',
    );
    analista = buscarPorCor(partida, 'analista');

    const stats = calcularEstatisticasParticipante(partida, analista);

    expect(stats.mensagensEnviadas).toBe(2);
    expect(stats.palavrasPorMinuto).toBeGreaterThan(0);
  });

  it('calcula percentual de orçamento usado para jogador', () => {
    let partida = { ...criarPartidaTeste(), orcamentoCaracteresJogador: 100 };
    let vermelho = buscarPorCor(partida, 'vermelho');

    partida = registrarMensagem(partida, vermelho, 'Dez letras aqui!', DATA_BASE);
    vermelho = buscarParticipanteObrigatorio(partida, vermelho.id);

    const stats = calcularEstatisticasParticipante(partida, vermelho);

    expect(stats.percentualOrcamentoUsado).toBeGreaterThan(0);
    expect(stats.percentualOrcamentoUsado).toBeLessThanOrEqual(100);
  });

  it('percentual de orçamento é sempre zero para analista', () => {
    let partida = criarPartidaTeste();
    let analista = buscarPorCor(partida, 'analista');

    partida = registrarMensagem(partida, analista, 'Pergunta longa do analista', DATA_BASE);
    analista = buscarPorCor(partida, 'analista');

    const stats = calcularEstatisticasParticipante(partida, analista);

    expect(stats.percentualOrcamentoUsado).toBe(0);
  });

  it('conta palavras separadas por múltiplos espaços corretamente', () => {
    let partida = criarPartidaTeste();
    let azul = buscarPorCor(partida, 'azul');

    partida = registrarMensagem(partida, azul, 'uma   duas   tres', DATA_BASE);
    azul = buscarParticipanteObrigatorio(partida, azul.id);

    const stats = calcularEstatisticasParticipante(partida, azul);

    expect(stats.mensagensEnviadas).toBe(1);
    expect(stats.palavrasPorMinuto).toBeGreaterThan(0);
  });
});
