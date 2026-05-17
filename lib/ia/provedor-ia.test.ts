import { describe, expect, it } from 'vitest';

import { obterProvedorIa } from './index';

describe('obterProvedorIa', () => {
  it('retorna provedor fake por padrão quando nenhum nome é passado', () => {
    const provedor = obterProvedorIa(undefined);

    expect(provedor.nome).toBe('fake');
  });

  it('retorna provedor fake com string vazia', () => {
    const provedor = obterProvedorIa('');

    expect(provedor.nome).toBe('fake');
  });

  it('retorna provedor fake quando nome é desconhecido', () => {
    const provedor = obterProvedorIa('provedor-inexistente');

    expect(provedor.nome).toBe('fake');
  });

  it('retorna provedor fake com case insensitive', () => {
    const provedor = obterProvedorIa('FAKE');

    expect(provedor.nome).toBe('fake');
  });

  it('provedor retornado tem método gerarResposta', () => {
    const provedor = obterProvedorIa();

    expect(typeof provedor.gerarResposta).toBe('function');
  });
});
