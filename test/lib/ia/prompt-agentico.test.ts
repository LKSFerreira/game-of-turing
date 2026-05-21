import { describe, expect, it } from 'vitest';

import { montarPromptSistema, montarPromptUsuario } from '@/lib/ia/prompt-agentico';
import type { SolicitarRespostaIaParametros } from '@/lib/ia/tipos';

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

describe('montarPromptSistema', () => {
  it('inclui o papel do jogador no prompt', () => {
    const prompt = montarPromptSistema(criarParametrosBase({ cor: 'azul' }));

    expect(prompt).toContain('Jogador Azul');
  });

  it('identifica jogador vermelho corretamente', () => {
    const prompt = montarPromptSistema(criarParametrosBase({ cor: 'vermelho' }));

    expect(prompt).toContain('Jogador Vermelho');
  });

  it('inclui instruções de missão convencer_humano', () => {
    const prompt = montarPromptSistema(
      criarParametrosBase({ missaoSecreta: 'convencer_humano' }),
    );

    expect(prompt).toContain('Convencer o Analista de que você é HUMANO');
  });


  it('inclui limite de caracteres no prompt', () => {
    const prompt = montarPromptSistema(criarParametrosBase({ limiteCaracteres: 120 }));

    expect(prompt).toContain('120 caracteres');
  });

  it('inclui regras do jogo no prompt base', () => {
    const prompt = montarPromptSistema(criarParametrosBase());

    expect(prompt).toContain('Game of Turing');
    expect(prompt).toContain('Analista');
    expect(prompt).toContain('dedução social');
  });

  it('inclui instruções de formato de resposta', () => {
    const prompt = montarPromptSistema(criarParametrosBase());

    expect(prompt).toContain('sem prefixo');
    expect(prompt).toContain('sem aspas');
  });
});

describe('montarPromptUsuario', () => {
  it('indica ausência de histórico quando vazio', () => {
    const prompt = montarPromptUsuario(criarParametrosBase({ historico: [] }));

    expect(prompt).toContain('Nenhuma mensagem ainda');
  });

  it('formata histórico com rótulos corretos', () => {
    const prompt = montarPromptUsuario(
      criarParametrosBase({
        historico: [
          {
            id: 'msg-1',
            partidaId: 'p-1',
            remetenteId: 'analista',
            remetenteCor: 'analista',
            conteudo: 'Quem é você?',
            criadaEm: '2026-05-16T12:00:00.000Z',
          },
          {
            id: 'msg-2',
            partidaId: 'p-1',
            remetenteId: 'azul',
            remetenteCor: 'azul',
            conteudo: 'Sou um jogador normal.',
            criadaEm: '2026-05-16T12:00:01.000Z',
          },
        ],
      }),
    );

    expect(prompt).toContain('[Analista]: Quem é você?');
    expect(prompt).toContain('[Azul]: Sou um jogador normal.');
  });

  it('formata rótulo do jogador vermelho corretamente', () => {
    const prompt = montarPromptUsuario(
      criarParametrosBase({
        historico: [
          {
            id: 'msg-1',
            partidaId: 'p-1',
            remetenteId: 'vermelho',
            remetenteCor: 'vermelho',
            conteudo: 'Olá, sou o vermelho.',
            criadaEm: '2026-05-16T12:00:00.000Z',
          },
        ],
      }),
    );

    expect(prompt).toContain('[Vermelho]: Olá, sou o vermelho.');
  });

  it('limita histórico às últimas 20 mensagens', () => {
    const historico = Array.from({ length: 30 }, (_, indice) => ({
      id: `msg-${indice}`,
      partidaId: 'p-1',
      remetenteId: 'analista',
      remetenteCor: 'analista' as const,
      conteudo: `Mensagem ${indice}`,
      criadaEm: `2026-05-16T12:00:${String(indice).padStart(2, '0')}.000Z`,
    }));

    const prompt = montarPromptUsuario(criarParametrosBase({ historico }));

    // Deve conter a mensagem 29 (última) mas não a mensagem 0 (mais antiga)
    expect(prompt).toContain('Mensagem 29');
    expect(prompt).not.toContain('Mensagem 0');
  });

  it('inclui instrução para responder naturalmente', () => {
    const prompt = montarPromptUsuario(criarParametrosBase());

    expect(prompt).toContain('Agora é sua vez');
  });
});
