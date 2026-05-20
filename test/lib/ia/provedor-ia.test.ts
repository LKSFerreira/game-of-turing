import { afterEach, describe, expect, it, vi } from 'vitest';

import { obterProvedorIa } from '@/lib/ia';

// Reset do cache do orquestrador entre testes
afterEach(() => {
  vi.unstubAllEnvs();
});

describe('obterProvedorIa (compatibilidade retroativa)', () => {
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

  it('retorna provedor groq quando solicitado', () => {
    const provedor = obterProvedorIa('groq');

    expect(provedor.nome).toBe('groq');
  });

  it('retorna provedor openrouter quando solicitado', () => {
    const provedor = obterProvedorIa('openrouter');

    expect(provedor.nome).toBe('openrouter');
  });

  it('retorna provedor gemini quando solicitado', () => {
    const provedor = obterProvedorIa('gemini');

    expect(provedor.nome).toBe('gemini');
  });
});
