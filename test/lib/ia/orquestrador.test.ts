import { describe, expect, it, vi } from 'vitest';

import { criarOrquestrador } from '@/lib/ia/orquestrador';
import type { ProvedorIa, SolicitarRespostaIaParametros } from '@/lib/ia/tipos';
import { ErroIndisponibilidadeIa } from '@/lib/ia/tipos-orquestrador';

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

function criarProvedorMock(nome: string, deveErrar = false): ProvedorIa {
  return {
    nome,
    gerarResposta: deveErrar
      ? vi.fn().mockRejectedValue(new Error(`${nome} falhou`))
      : vi.fn().mockResolvedValue({ texto: `Resposta do ${nome}`, provider: nome }),
  };
}

describe('criarOrquestrador', () => {
  it('lança erro se nenhum provider for configurado', () => {
    expect(() => criarOrquestrador([])).toThrow(
      'O orquestrador precisa de pelo menos um provider configurado.',
    );
  });

  it('retorna resposta de um provider saudável', async () => {
    const provedor = criarProvedorMock('groq');
    const orquestrador = criarOrquestrador([{ provedor, peso: 5 }]);

    const resposta = await orquestrador.gerarResposta(criarParametrosBase());

    expect(resposta.texto).toBe('Resposta do groq');
    expect(resposta.provider).toBe('groq');
  });

  it('faz fallback quando o primeiro provider falha', async () => {
    const provedorPrimario = criarProvedorMock('groq', true);
    const provedorSecundario = criarProvedorMock('openrouter');

    const orquestrador = criarOrquestrador([
      { provedor: provedorPrimario, peso: 5 },
      { provedor: provedorSecundario, peso: 3 },
    ]);

    const resposta = await orquestrador.gerarResposta(criarParametrosBase());

    expect(resposta.provider).toBe('openrouter');
  });

  it('lança ErroIndisponibilidadeIa quando todos os providers falham', async () => {
    const provedorPrimario = criarProvedorMock('groq', true);
    const provedorSecundario = criarProvedorMock('openrouter', true);

    const orquestrador = criarOrquestrador([
      { provedor: provedorPrimario, peso: 5 },
      { provedor: provedorSecundario, peso: 3 },
    ]);

    await expect(orquestrador.gerarResposta(criarParametrosBase())).rejects.toThrow(
      ErroIndisponibilidadeIa,
    );
  });

  it('mensagem do ErroIndisponibilidadeIa é descritiva', () => {
    const erro = new ErroIndisponibilidadeIa();

    expect(erro.message).toContain('indisponíveis');
    expect(erro.message).toContain('sem vencedor');
    expect(erro.message).toContain('sem prejuízo');
    expect(erro.name).toBe('ErroIndisponibilidadeIa');
  });
});

describe('circuit breaker', () => {
  it('abre circuit breaker após atingir limite de falhas consecutivas', async () => {
    const provedorUnico = criarProvedorMock('groq', true);

    const orquestrador = criarOrquestrador([
      { provedor: provedorUnico, peso: 5, limiteErros: 1 },
    ]);

    // Primeira chamada falha e abre o circuit breaker (limiteErros: 1)
    await expect(orquestrador.gerarResposta(criarParametrosBase())).rejects.toThrow();

    const estados = orquestrador.obterEstadoProviders();
    const estadoGroq = estados.find(estado => estado.nome === 'groq');

    expect(estadoGroq?.estado).toBe('aberto');
  });

  it('provider com circuit breaker aberto não recebe requisições', async () => {
    const provedorInstavel = criarProvedorMock('groq', true);
    const provedorEstavel = criarProvedorMock('openrouter');

    const orquestrador = criarOrquestrador([
      { provedor: provedorInstavel, peso: 5, limiteErros: 1 },
      { provedor: provedorEstavel, peso: 3 },
    ]);

    // Primeira chamada: o instável é tentado (pode falhar), fallback funciona
    await orquestrador.gerarResposta(criarParametrosBase());

    // Após a falha, o circuit breaker do instável deve estar aberto
    const estados = orquestrador.obterEstadoProviders();
    const estadoGroq = estados.find(estado => estado.nome === 'groq');

    // Se o instável foi selecionado e falhou, o circuit breaker abre
    if (estadoGroq?.estado === 'aberto') {
      vi.mocked(provedorInstavel.gerarResposta).mockClear();

      // Próxima chamada não deve tentar o provider com circuit breaker aberto
      await orquestrador.gerarResposta(criarParametrosBase());

      expect(provedorInstavel.gerarResposta).not.toHaveBeenCalled();
    } else {
      // Se o estável foi selecionado primeiro, fazemos mais chamadas até o instável falhar
      vi.mocked(provedorInstavel.gerarResposta).mockClear();

      for (let tentativa = 0; tentativa < 10; tentativa++) {
        await orquestrador.gerarResposta(criarParametrosBase());
        const estadoAtualizado = orquestrador.obterEstadoProviders().find(e => e.nome === 'groq');

        if (estadoAtualizado?.estado === 'aberto') break;
      }

      vi.mocked(provedorInstavel.gerarResposta).mockClear();
      await orquestrador.gerarResposta(criarParametrosBase());

      expect(provedorInstavel.gerarResposta).not.toHaveBeenCalled();
    }
  });
});

describe('obterEstadoProviders', () => {
  it('retorna estado inicial de todos os providers', () => {
    const provedorA = criarProvedorMock('groq');
    const provedorB = criarProvedorMock('openrouter');

    const orquestrador = criarOrquestrador([
      { provedor: provedorA, peso: 5 },
      { provedor: provedorB, peso: 3 },
    ]);

    const estados = orquestrador.obterEstadoProviders();

    expect(estados).toHaveLength(2);
    expect(estados[0]).toEqual({ nome: 'groq', estado: 'fechado', latenciaMedia: 0 });
    expect(estados[1]).toEqual({ nome: 'openrouter', estado: 'fechado', latenciaMedia: 0 });
  });

  it('registra latência média após chamadas bem-sucedidas', async () => {
    const provedor = criarProvedorMock('groq');
    const orquestrador = criarOrquestrador([{ provedor, peso: 5 }]);

    await orquestrador.gerarResposta(criarParametrosBase());

    const estados = orquestrador.obterEstadoProviders();
    const estadoGroq = estados.find(estado => estado.nome === 'groq');

    // Latência deve ser um número não-negativo (dependendo da velocidade do mock)
    expect(estadoGroq?.latenciaMedia).toBeGreaterThanOrEqual(0);
  });
});

describe('weighted round-robin', () => {
  it('distribui requisições entre providers disponíveis', async () => {
    const provedorA = criarProvedorMock('groq');
    const provedorB = criarProvedorMock('openrouter');

    const orquestrador = criarOrquestrador([
      { provedor: provedorA, peso: 5 },
      { provedor: provedorB, peso: 5 },
    ]);

    const resultados: string[] = [];

    // Com pesos iguais e amostra grande, ambos devem ser chamados
    for (let indice = 0; indice < 20; indice++) {
      const resposta = await orquestrador.gerarResposta(criarParametrosBase());
      resultados.push(resposta.provider);
    }

    const contagemGroq = resultados.filter(nome => nome === 'groq').length;
    const contagemOpenRouter = resultados.filter(nome => nome === 'openrouter').length;

    // Com pesos iguais e 20 amostras, ambos devem ter sido chamados pelo menos uma vez
    expect(contagemGroq).toBeGreaterThan(0);
    expect(contagemOpenRouter).toBeGreaterThan(0);
  });
});
