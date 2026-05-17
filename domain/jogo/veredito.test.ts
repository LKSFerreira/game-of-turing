import { describe, expect, it } from 'vitest';

import {
  avancarParaVeredito,
  calcularResultadoPartida,
  criarPartidaPoc,
  finalizarPartidaComVeredito,
  finalizarPartidaPorTempoVeredito,
  registrarMensagem,
  validarVereditoAnalista,
} from './index';
import type { ParticipantePartida, Partida } from './tipos';

const DATA_BASE = '2026-05-16T12:00:00.000Z';
const DATA_ENCERRAMENTO = '2026-05-16T12:01:00.000Z';

function criarPartidaTeste(): Partida {
  return criarPartidaPoc({ id: 'partida-veredito', criadaEm: DATA_BASE, duracaoSegundos: 60 });
}

function buscarPorCor(partida: Partida, cor: ParticipantePartida['cor']): ParticipantePartida {
  return partida.participantes.find(p => p.cor === cor)!;
}

describe('validarVereditoAnalista', () => {
  it('rejeita veredito sem classificação do azul', () => {
    expect(validarVereditoAnalista({ vermelho: 'ia' })).toMatchObject({ valido: false });
  });

  it('rejeita veredito sem classificação do vermelho', () => {
    expect(validarVereditoAnalista({ azul: 'humano' })).toMatchObject({ valido: false });
  });

  it('rejeita veredito completamente vazio', () => {
    expect(validarVereditoAnalista({})).toMatchObject({ valido: false });
  });

  it('aceita veredito completo', () => {
    const resultado = validarVereditoAnalista({ azul: 'ia', vermelho: 'humano' });
    expect(resultado).toEqual({
      valido: true,
      veredito: { azul: 'ia', vermelho: 'humano' },
    });
  });
});

describe('finalizarPartidaComVeredito', () => {
  it('lança erro em fase incompatível', () => {
    const partida = { ...criarPartidaTeste(), fase: 'encerrada' as const };
    expect(() =>
      finalizarPartidaComVeredito(partida, { azul: 'ia', vermelho: 'ia' }, DATA_ENCERRAMENTO),
    ).toThrow('A partida não pode receber veredito nesta fase.');
  });

  it('lança erro com veredito incompleto', () => {
    const partida = avancarParaVeredito(criarPartidaTeste());
    expect(() =>
      finalizarPartidaComVeredito(partida, { azul: 'ia' }, DATA_ENCERRAMENTO),
    ).toThrow('Classifique Azul e Vermelho antes de finalizar a análise.');
  });

  it('aceita veredito na fase em_andamento', () => {
    const partida = criarPartidaTeste();
    const finalizada = finalizarPartidaComVeredito(
      partida,
      { azul: 'ia', vermelho: 'ia' },
      DATA_ENCERRAMENTO,
    );
    expect(finalizada.fase).toBe('revelacao');
    expect(finalizada.encerradaEm).toBe(DATA_ENCERRAMENTO);
  });

  it('aceita veredito na fase de veredito', () => {
    const partida = avancarParaVeredito(criarPartidaTeste());
    const finalizada = finalizarPartidaComVeredito(
      partida,
      { azul: 'humano', vermelho: 'ia' },
      DATA_ENCERRAMENTO,
    );
    expect(finalizada.fase).toBe('revelacao');
    expect(finalizada.vereditoAnalista).toEqual({ azul: 'humano', vermelho: 'ia' });
  });
});

describe('finalizarPartidaPorTempoVeredito', () => {
  it('atribui natureza oposta como derrota automática do analista', () => {
    const partida = avancarParaVeredito(criarPartidaTeste());
    const finalizada = finalizarPartidaPorTempoVeredito(partida, DATA_ENCERRAMENTO);

    expect(finalizada.vereditoAnalista).toEqual({ azul: 'humano', vermelho: 'humano' });
  });

  it('lança erro se não estiver na fase de veredito', () => {
    const partida = criarPartidaTeste();
    expect(() => finalizarPartidaPorTempoVeredito(partida, DATA_ENCERRAMENTO)).toThrow(
      'A derrota por tempo só pode ser aplicada na fase de veredito.',
    );
  });
});

describe('calcularResultadoPartida — cenários de vitória e derrota', () => {
  it('analista acerta ambos → vitória', () => {
    const partida = finalizarPartidaComVeredito(
      avancarParaVeredito(criarPartidaTeste()),
      { azul: 'ia', vermelho: 'ia' },
      DATA_ENCERRAMENTO,
    );
    const resultado = calcularResultadoPartida(partida);

    expect(resultado.analistaVenceu).toBe(true);
    expect(resultado.vereditoCorretoAzul).toBe(true);
    expect(resultado.vereditoCorretoVermelho).toBe(true);
  });

  it('analista erra apenas o azul → derrota', () => {
    const partida = finalizarPartidaComVeredito(
      avancarParaVeredito(criarPartidaTeste()),
      { azul: 'humano', vermelho: 'ia' },
      DATA_ENCERRAMENTO,
    );
    const resultado = calcularResultadoPartida(partida);

    expect(resultado.analistaVenceu).toBe(false);
    expect(resultado.vereditoCorretoAzul).toBe(false);
    expect(resultado.vereditoCorretoVermelho).toBe(true);
  });

  it('analista erra apenas o vermelho → derrota', () => {
    const partida = finalizarPartidaComVeredito(
      avancarParaVeredito(criarPartidaTeste()),
      { azul: 'ia', vermelho: 'humano' },
      DATA_ENCERRAMENTO,
    );
    const resultado = calcularResultadoPartida(partida);

    expect(resultado.analistaVenceu).toBe(false);
    expect(resultado.vereditoCorretoVermelho).toBe(false);
  });

  it('lança erro sem veredito', () => {
    const partida = criarPartidaTeste();
    expect(() => calcularResultadoPartida(partida)).toThrow(
      'Não é possível calcular resultado sem veredito.',
    );
  });
});

describe('calcularResultadoPartida — missões secretas dos jogadores', () => {
  it('jogador com convencer_humano vence quando analista o rotula como humano', () => {
    const partida = criarPartidaTeste();
    const azul = buscarPorCor(partida, 'azul');
    expect(azul.missaoSecreta).toBe('convencer_humano');

    const finalizada = finalizarPartidaComVeredito(
      avancarParaVeredito(partida),
      { azul: 'humano', vermelho: 'ia' },
      DATA_ENCERRAMENTO,
    );
    const resultado = calcularResultadoPartida(finalizada);
    const resultadoAzul = resultado.participantes.find(p => p.participanteId === azul.id);

    expect(resultadoAzul?.venceu).toBe(true);
  });

  it('jogador com convencer_ia vence quando analista o rotula como ia', () => {
    const partida = criarPartidaTeste();
    const vermelho = buscarPorCor(partida, 'vermelho');
    expect(vermelho.missaoSecreta).toBe('convencer_ia');

    const finalizada = finalizarPartidaComVeredito(
      avancarParaVeredito(partida),
      { azul: 'ia', vermelho: 'ia' },
      DATA_ENCERRAMENTO,
    );
    const resultado = calcularResultadoPartida(finalizada);
    const resultadoVermelho = resultado.participantes.find(p => p.participanteId === vermelho.id);

    expect(resultadoVermelho?.venceu).toBe(true);
  });

  it('jogador com convencer_humano perde quando analista o rotula como ia', () => {
    const partida = criarPartidaTeste();
    const azul = buscarPorCor(partida, 'azul');

    const finalizada = finalizarPartidaComVeredito(
      avancarParaVeredito(partida),
      { azul: 'ia', vermelho: 'ia' },
      DATA_ENCERRAMENTO,
    );
    const resultado = calcularResultadoPartida(finalizada);
    const resultadoAzul = resultado.participantes.find(p => p.participanteId === azul.id);

    expect(resultadoAzul?.venceu).toBe(false);
  });
});

describe('calcularResultadoPartida — bônus de participação', () => {
  it('jogador ativo recebe bônus de participação no resultado', () => {
    let partida = criarPartidaTeste();
    let azul = buscarPorCor(partida, 'azul');

    for (let indice = 0; indice < 6; indice++) {
      const dataEnvio = new Date(new Date(DATA_BASE).getTime() + (indice + 1) * 5000).toISOString();
      const msg = `Mensagem número ${String(indice + 1).padStart(2, '0')} de teste`;
      partida = registrarMensagem(partida, azul, msg, dataEnvio);
      azul = buscarPorCor(partida, 'azul');
    }

    const finalizada = finalizarPartidaComVeredito(
      avancarParaVeredito(partida),
      { azul: 'ia', vermelho: 'ia' },
      DATA_ENCERRAMENTO,
    );
    const resultado = calcularResultadoPartida(finalizada);
    const resultadoAzul = resultado.participantes.find(p => p.participanteId === 'interlocutor-azul');

    expect(resultadoAzul!.bonusParticipacao).toBeGreaterThan(0);
    expect(resultadoAzul!.mensagensEnviadas).toBe(6);
  });
});
