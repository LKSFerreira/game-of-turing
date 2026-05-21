import { describe, expect, it } from 'vitest';

import {
  COOLDOWN_PADRAO_SEGUNDOS,
  DURACAO_PADRAO_PARTIDA_SEGUNDOS,
  DURACAO_PADRAO_VEREDITO_SEGUNDOS,
  ORCAMENTO_PADRAO_JOGADOR,
  atualizarFasePorTempo,
  avancarParaVeredito,
  buscarParticipanteObrigatorio,
  calcularSegundosRestantes,
  criarPartidaPoc,
  reiniciarPartida,
} from '@/domain/jogo';

const DATA_BASE = '2026-05-16T12:00:00.000Z';

describe('criarPartidaPoc', () => {
  it('gera partida com valores padrão', () => {
    const partida = criarPartidaPoc();
    expect(partida.fase).toBe('em_andamento');
    expect(partida.encerradaEm).toBeNull();
    expect(partida.duracaoSegundos).toBe(DURACAO_PADRAO_PARTIDA_SEGUNDOS);
    expect(partida.faseVereditoSegundos).toBe(DURACAO_PADRAO_VEREDITO_SEGUNDOS);
    expect(partida.cooldownSegundos).toBe(COOLDOWN_PADRAO_SEGUNDOS);
    expect(partida.orcamentoCaracteresJogador).toBe(ORCAMENTO_PADRAO_JOGADOR);
    expect(partida.vereditoAnalista).toBeNull();
    expect(partida.participantes).toHaveLength(3);
    expect(partida.mensagens).toHaveLength(1);
  });

  it('respeita parâmetros customizados', () => {
    const partida = criarPartidaPoc({ id: 'custom', criadaEm: DATA_BASE, duracaoSegundos: 120 });
    expect(partida.id).toBe('custom');
    expect(partida.criadaEm).toBe(DATA_BASE);
    expect(partida.duracaoSegundos).toBe(120);
  });

  it('cria 3 participantes com papéis e cores corretos', () => {
    const partida = criarPartidaPoc({ criadaEm: DATA_BASE });
    const cores = partida.participantes.map(p => p.cor);
    expect(cores).toContain('analista');
    expect(cores).toContain('azul');
    expect(cores).toContain('vermelho');
  });

  it('analista não tem missão secreta', () => {
    const partida = criarPartidaPoc({ criadaEm: DATA_BASE });
    const analista = partida.participantes.find(p => p.papel === 'analista');
    expect(analista?.missaoSecreta).toBeNull();
  });

  it('todos começam com caracteres zerados e sem último envio', () => {
    const partida = criarPartidaPoc({ criadaEm: DATA_BASE });
    for (const p of partida.participantes) {
      expect(p.caracteresUsados).toBe(0);
      expect(p.ultimoEnvioEm).toBeNull();
    }
  });

  it('primeira mensagem é do sistema', () => {
    const partida = criarPartidaPoc({ id: 'poc-inicio', criadaEm: DATA_BASE });
    const msg = partida.mensagens[0];
    expect(msg.remetenteId).toBe('sistema');
    expect(msg.remetenteCor).toBe('sistema');
    expect(msg.conteudo).toContain('Conexão neural estabelecida');
  });
});

describe('buscarParticipanteObrigatorio', () => {
  it('retorna participante existente', () => {
    const partida = criarPartidaPoc({ criadaEm: DATA_BASE });
    const analista = buscarParticipanteObrigatorio(partida, 'analista-local');
    expect(analista.papel).toBe('analista');
  });

  it('lança erro com ID inexistente', () => {
    const partida = criarPartidaPoc({ criadaEm: DATA_BASE });
    expect(() => buscarParticipanteObrigatorio(partida, 'fantasma')).toThrow(
      'Participante não encontrado: fantasma',
    );
  });
});

describe('calcularSegundosRestantes', () => {
  it('retorna restante correto', () => {
    const partida = criarPartidaPoc({ criadaEm: DATA_BASE, duracaoSegundos: 60 });
    expect(calcularSegundosRestantes(partida, new Date('2026-05-16T12:00:30.000Z'))).toBe(30);
  });

  it('retorna zero quando tempo esgota', () => {
    const partida = criarPartidaPoc({ criadaEm: DATA_BASE, duracaoSegundos: 60 });
    expect(calcularSegundosRestantes(partida, new Date('2026-05-16T12:01:00.000Z'))).toBe(0);
  });

  it('nunca retorna negativo', () => {
    const partida = criarPartidaPoc({ criadaEm: DATA_BASE, duracaoSegundos: 60 });
    expect(calcularSegundosRestantes(partida, new Date('2026-05-16T12:05:00.000Z'))).toBe(0);
  });

  it('retorna duração total no instante de início', () => {
    const partida = criarPartidaPoc({ criadaEm: DATA_BASE, duracaoSegundos: 180 });
    expect(calcularSegundosRestantes(partida, new Date(DATA_BASE))).toBe(180);
  });
});

describe('avancarParaVeredito', () => {
  it('muda fase de em_andamento para veredito', () => {
    const partida = criarPartidaPoc({ criadaEm: DATA_BASE });
    expect(avancarParaVeredito(partida).fase).toBe('veredito');
  });

  it('não altera partida já em veredito', () => {
    const partida = avancarParaVeredito(criarPartidaPoc({ criadaEm: DATA_BASE }));
    expect(avancarParaVeredito(partida)).toBe(partida);
  });

  it('não altera partida em revelação', () => {
    const partida = { ...criarPartidaPoc({ criadaEm: DATA_BASE }), fase: 'revelacao' as const };
    expect(avancarParaVeredito(partida)).toBe(partida);
  });
});

describe('atualizarFasePorTempo', () => {
  it('mantém em_andamento enquanto houver tempo', () => {
    const partida = criarPartidaPoc({ criadaEm: DATA_BASE, duracaoSegundos: 60 });
    expect(atualizarFasePorTempo(partida, new Date('2026-05-16T12:00:20.000Z')).fase).toBe('em_andamento');
  });

  it('avança para veredito quando tempo esgota', () => {
    const partidaBase = criarPartidaPoc({ criadaEm: DATA_BASE, duracaoSegundos: 60 });
    const partida = {
      ...partidaBase,
      mensagens: [
        ...partidaBase.mensagens,
        {
          id: 'msg-analista',
          partidaId: partidaBase.id,
          remetenteId: 'analista-local',
          remetenteCor: 'analista',
          conteudo: 'Ola jogadores',
          criadaEm: DATA_BASE,
        }
      ]
    };
    expect(atualizarFasePorTempo(partida, new Date('2026-05-16T12:01:00.000Z')).fase).toBe('veredito');
  });

  it('não modifica partida já em veredito', () => {
    const partida = avancarParaVeredito(criarPartidaPoc({ criadaEm: DATA_BASE, duracaoSegundos: 60 }));
    expect(atualizarFasePorTempo(partida, new Date('2026-05-16T12:05:00.000Z'))).toBe(partida);
  });
});

describe('reiniciarPartida', () => {
  it('preserva ID e duração', () => {
    const original = criarPartidaPoc({ id: 'reinicio', criadaEm: DATA_BASE, duracaoSegundos: 90 });
    const reiniciada = reiniciarPartida(original);
    expect(reiniciada.id).toBe('reinicio');
    expect(reiniciada.duracaoSegundos).toBe(90);
  });

  it('reseta estado completo', () => {
    const original = criarPartidaPoc({ id: 'reinicio', criadaEm: DATA_BASE });
    const reiniciada = reiniciarPartida(original);
    expect(reiniciada.fase).toBe('em_andamento');
    expect(reiniciada.vereditoAnalista).toBeNull();
    expect(reiniciada.encerradaEm).toBeNull();
    expect(reiniciada.mensagens).toHaveLength(1);
    for (const p of reiniciada.participantes) {
      expect(p.caracteresUsados).toBe(0);
      expect(p.ultimoEnvioEm).toBeNull();
    }
  });
});
