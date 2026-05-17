import { describe, expect, it } from 'vitest';

import { provedorFakeIa } from './provedor-fake';
import type { SolicitarRespostaIaParametros } from './tipos';

function criarParametrosBase(
  overrides: Partial<SolicitarRespostaIaParametros> = {},
): SolicitarRespostaIaParametros {
  return {
    cor: 'azul',
    missaoSecreta: 'convencer_humano',
    historico: [],
    limiteCaracteres: 150,
    ...overrides,
  };
}

describe('provedorFakeIa', () => {
  it('retorna nome fake', () => {
    expect(provedorFakeIa.nome).toBe('fake');
  });

  it('retorna resposta assíncrona com texto e provider', async () => {
    const resposta = await provedorFakeIa.gerarResposta(criarParametrosBase());

    expect(resposta).toHaveProperty('texto');
    expect(resposta).toHaveProperty('provider');
    expect(resposta.provider).toBe('fake');
    expect(typeof resposta.texto).toBe('string');
    expect(resposta.texto.length).toBeGreaterThan(0);
  });

  it('respeita limite de caracteres quando resposta é longa', async () => {
    const limiteReduzido = 20;
    const resposta = await provedorFakeIa.gerarResposta(
      criarParametrosBase({ limiteCaracteres: limiteReduzido }),
    );

    expect(resposta.texto.length).toBeLessThanOrEqual(limiteReduzido);
  });

  it('resposta truncada termina com reticências', async () => {
    const limiteReduzido = 20;
    const resposta = await provedorFakeIa.gerarResposta(
      criarParametrosBase({ limiteCaracteres: limiteReduzido }),
    );

    expect(resposta.texto.endsWith('…')).toBe(true);
  });

  it('seleciona banco de respostas com base na missão secreta', async () => {
    const respostaHumano = await provedorFakeIa.gerarResposta(
      criarParametrosBase({ missaoSecreta: 'convencer_humano' }),
    );
    const respostaIa = await provedorFakeIa.gerarResposta(
      criarParametrosBase({ missaoSecreta: 'convencer_ia' }),
    );

    expect(respostaHumano.texto).not.toBe(respostaIa.texto);
  });

  it('retorna resposta determinística para mesmos parâmetros', async () => {
    const parametros = criarParametrosBase({
      historico: [
        {
          id: 'msg-1',
          partidaId: 'p-1',
          remetenteId: 'analista',
          remetenteCor: 'analista',
          conteudo: 'Quem é você?',
          criadaEm: '2026-05-16T12:00:00.000Z',
        },
      ],
    });

    const resposta1 = await provedorFakeIa.gerarResposta(parametros);
    const resposta2 = await provedorFakeIa.gerarResposta(parametros);

    expect(resposta1.texto).toBe(resposta2.texto);
  });
});
