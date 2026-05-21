import { describe, expect, it } from 'vitest';

import {
  LIMITE_MAXIMO_CARACTERES_MENSAGEM,
  criarPartidaPoc,
  registrarMensagem,
  validarMensagem,
} from '@/domain/jogo';
import type { ParticipantePartida, Partida } from '@/domain/jogo/tipos';

const DATA_BASE = '2026-05-16T12:00:00.000Z';

function criarPartidaTeste(): Partida {
  return criarPartidaPoc({
    id: 'partida-mensagem-teste',
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

describe('validarMensagem — limites de caracteres', () => {
  it('aceita mensagem com exatamente o mínimo de caracteres', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const conteudo = 'abcde12345';

    const resultado = validarMensagem(partida, analista, conteudo, new Date(DATA_BASE));

    expect(resultado).toEqual({ valido: true, conteudoNormalizado: conteudo });
  });

  it('rejeita mensagem com um caractere a menos que o mínimo', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const conteudo = 'abcde1234';

    const resultado = validarMensagem(partida, analista, conteudo, new Date(DATA_BASE));

    expect(resultado).toMatchObject({ valido: false });
  });

  it('aceita mensagem com exatamente o máximo de caracteres', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const conteudo = 'abcde'.repeat(LIMITE_MAXIMO_CARACTERES_MENSAGEM / 5);

    const resultado = validarMensagem(partida, analista, conteudo, new Date(DATA_BASE));

    expect(resultado).toEqual({ valido: true, conteudoNormalizado: conteudo });
  });

  it('rejeita mensagem com um caractere a mais que o máximo', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const conteudo = 'x'.repeat(LIMITE_MAXIMO_CARACTERES_MENSAGEM + 1);

    const resultado = validarMensagem(partida, analista, conteudo, new Date(DATA_BASE));

    expect(resultado).toMatchObject({ valido: false });
  });
});

describe('validarMensagem — normalização de espaços', () => {
  it('normaliza tabs e quebras de linha para espaço simples', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const conteudo = "Palavra\tcom\ntabs\r\ne\tquebras";

    const resultado = validarMensagem(partida, analista, conteudo, new Date(DATA_BASE));

    expect(resultado).toEqual({
      valido: true,
      conteudoNormalizado: 'Palavra com tabs e quebras',
    });
  });

  it('rejeita mensagem que após normalização fica abaixo do mínimo', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const conteudo = '   a   b   ';

    const resultado = validarMensagem(partida, analista, conteudo, new Date(DATA_BASE));

    expect(resultado).toMatchObject({ valido: false });
  });
});

describe('validarMensagem — cooldown', () => {
  it('aceita mensagem após o cooldown exato de 3 segundos', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const partidaComMensagem = registrarMensagem(
      partida,
      analista,
      'Primeira pergunta',
      DATA_BASE,
    );
    const analistaAtualizado = buscarPorCor(partidaComMensagem, 'analista');
    const treSegundosDepois = new Date('2026-05-16T12:00:03.000Z');

    const resultado = validarMensagem(
      partidaComMensagem,
      analistaAtualizado,
      'Segunda pergunta',
      treSegundosDepois,
    );

    expect(resultado).toEqual({ valido: true, conteudoNormalizado: 'Segunda pergunta' });
  });

  it('exibe segundos restantes corretos na mensagem de cooldown', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const partidaComMensagem = registrarMensagem(
      partida,
      analista,
      'Primeira pergunta',
      DATA_BASE,
    );
    const analistaAtualizado = buscarPorCor(partidaComMensagem, 'analista');
    const zeroSegundosDepois = new Date(DATA_BASE);

    const resultado = validarMensagem(
      partidaComMensagem,
      analistaAtualizado,
      'Outra pergunta agora',
      zeroSegundosDepois,
    );

    expect(resultado).toEqual({
      valido: false,
      motivo: 'Aguarde 3s antes de enviar outra mensagem.',
    });
  });
});

describe('validarMensagem — orçamento de caracteres', () => {
  it('aceita mensagem que consome exatamente o orçamento restante', () => {
    const partidaBase = criarPartidaTeste();
    const partida: Partida = {
      ...partidaBase,
      orcamentoCaracteresJogador: 30,
      mensagens: [
        ...partidaBase.mensagens,
        {
          id: 'msg-analista-inicial',
          partidaId: partidaBase.id,
          remetenteId: 'analista-local',
          remetenteCor: 'analista',
          conteudo: 'Ola jogadores',
          criadaEm: DATA_BASE,
        }
      ]
    };
    const azul = { ...buscarPorCor(partida, 'azul'), caracteresUsados: 20 };
    const conteudo = 'abcdefghij';

    const resultado = validarMensagem(partida, azul, conteudo, new Date(DATA_BASE));

    expect(resultado).toMatchObject({ valido: true });
  });

  it('rejeita quando ultrapassa orçamento por um único caractere', () => {
    const partidaBase = criarPartidaTeste();
    const partida: Partida = {
      ...partidaBase,
      orcamentoCaracteresJogador: 20,
      mensagens: [
        ...partidaBase.mensagens,
        {
          id: 'msg-analista-inicial',
          partidaId: partidaBase.id,
          remetenteId: 'analista-local',
          remetenteCor: 'analista',
          conteudo: 'Ola jogadores',
          criadaEm: DATA_BASE,
        }
      ]
    };
    const azul = { ...buscarPorCor(partida, 'azul'), caracteresUsados: 10 };
    const conteudoQueEstoura = 'abcde123456';

    const resultado = validarMensagem(partida, azul, conteudoQueEstoura, new Date(DATA_BASE));

    expect(resultado).toEqual({ valido: false, motivo: 'O orçamento de caracteres acabou.' });
  });

  it('analista não é afetado pelo orçamento de caracteres', () => {
    const partida = { ...criarPartidaTeste(), orcamentoCaracteresJogador: 1 };
    const analista = buscarPorCor(partida, 'analista');
    const conteudo = 'Pergunta longa que ultrapassa qualquer orçamento de jogador';

    const resultado = validarMensagem(partida, analista, conteudo, new Date(DATA_BASE));

    expect(resultado).toMatchObject({ valido: true });
  });
});

describe('registrarMensagem — efeitos colaterais', () => {
  it('incrementa caracteres usados apenas para jogador', () => {
    const partida = criarPartidaTeste();
    const azul = buscarPorCor(partida, 'azul');
    const analista = buscarPorCor(partida, 'analista');
    const conteudo = 'Teste com doze';

    const partidaComMensagemAzul = registrarMensagem(partida, azul, conteudo, DATA_BASE);
    const azulAtualizado = buscarPorCor(partidaComMensagemAzul, 'azul');

    expect(azulAtualizado.caracteresUsados).toBe(conteudo.length);

    const partidaComMensagemAnalista = registrarMensagem(partida, analista, conteudo, DATA_BASE);
    const analistaAtualizado = buscarPorCor(partidaComMensagemAnalista, 'analista');

    expect(analistaAtualizado.caracteresUsados).toBe(0);
  });

  it('atualiza ultimoEnvioEm para o participante que enviou', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const dataEnvio = '2026-05-16T12:00:05.000Z';

    const partidaAtualizada = registrarMensagem(partida, analista, 'Mensagem de teste', dataEnvio);
    const analistaAtualizado = buscarPorCor(partidaAtualizada, 'analista');

    expect(analistaAtualizado.ultimoEnvioEm).toBe(dataEnvio);
  });

  it('gera ID de mensagem único com prefixo da partida', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');

    const partidaComMensagem = registrarMensagem(
      partida,
      analista,
      'Primeira nova mensagem',
      DATA_BASE,
    );
    const novaMensagem = partidaComMensagem.mensagens[partidaComMensagem.mensagens.length - 1];

    expect(novaMensagem.id).toContain(`${partida.id}-mensagem-`);
  });

  it('não altera caracteres de outros participantes', () => {
    const partida = criarPartidaTeste();
    const azul = buscarPorCor(partida, 'azul');

    const partidaAtualizada = registrarMensagem(partida, azul, 'Somente azul muda', DATA_BASE);
    const vermelhoAtualizado = buscarPorCor(partidaAtualizada, 'vermelho');

    expect(vermelhoAtualizado.caracteresUsados).toBe(0);
    expect(vermelhoAtualizado.ultimoEnvioEm).toBeNull();
  });
});

describe('validarMensagem — filtro de palavras impróprias para humanos', () => {
  it('permite mensagens sem termos ofensivos', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const conteudo = 'Tudo bem com vocês? Espero que sim!';

    const resultado = validarMensagem(partida, analista, conteudo, new Date(DATA_BASE));

    expect(resultado).toEqual({ valido: true, conteudoNormalizado: conteudo });
  });

  it('rejeita mensagens do analista contendo palavrão em minúsculo', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const conteudo = 'Que porra é essa aqui?';

    const resultado = validarMensagem(partida, analista, conteudo, new Date(DATA_BASE));

    expect(resultado).toEqual({
      valido: false,
      motivo: 'Sua mensagem contém palavras ou termos considerados impróprios para o jogo.',
    });
  });

  it('rejeita mensagens do analista contendo palavrão com acentuação ou caixa mista', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const conteudo = 'Isso é um CÁRÁLHÓ mesmo!';

    const resultado = validarMensagem(partida, analista, conteudo, new Date(DATA_BASE));

    expect(resultado.valido).toBe(false);
  });

  it('rejeita mensagens burladas com pontuação', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const conteudo = 'Vai se f.o.d.e.r!';

    const resultado = validarMensagem(partida, analista, conteudo, new Date(DATA_BASE));

    expect(resultado.valido).toBe(false);
  });

  it('rejeita mensagens contendo Leet Speak de palavrões', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');

    expect(validarMensagem(partida, analista, 'Que p0rr4 é essa', new Date(DATA_BASE)).valido).toBe(false);
    expect(validarMensagem(partida, analista, 'Esse cara é um v14d0!', new Date(DATA_BASE)).valido).toBe(false);
    expect(validarMensagem(partida, analista, 'Vai se f0d3r de verdade', new Date(DATA_BASE)).valido).toBe(false);
    expect(validarMensagem(partida, analista, 'Que c4r4lh0 é esse', new Date(DATA_BASE)).valido).toBe(false);
  });

  it('rejeita palavrões com espaçamento variável', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');

    expect(validarMensagem(partida, analista, 'Vai se p o r r a', new Date(DATA_BASE)).valido).toBe(false);
    expect(validarMensagem(partida, analista, 'vai se p   o  r r a', new Date(DATA_BASE)).valido).toBe(false);
  });

  it('rejeita palavrões com mistura de símbolos, leet speak e espaços', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');

    expect(validarMensagem(partida, analista, 'vai se p_0_r_r_4', new Date(DATA_BASE)).valido).toBe(false);
    expect(validarMensagem(partida, analista, 'vai se p*0*r*r*4', new Date(DATA_BASE)).valido).toBe(false);
    expect(validarMensagem(partida, analista, 'f.0.d.4-s.3!', new Date(DATA_BASE)).valido).toBe(false);
  });

  it('rejeita palavrões com repetições excessivas de letras internas', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');

    expect(validarMensagem(partida, analista, 'Que pooorrrraaa é essa', new Date(DATA_BASE)).valido).toBe(false);
    expect(validarMensagem(partida, analista, 'Que carrraaalllhhooo', new Date(DATA_BASE)).valido).toBe(false);
  });

  it('não causa falso positivo em palavras normais contendo trechos dos palavrões', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');

    expect(validarMensagem(partida, analista, 'Vou ligar o computador agora.', new Date(DATA_BASE)).valido).toBe(true);
    expect(validarMensagem(partida, analista, 'Faça um recuo estratégico.', new Date(DATA_BASE)).valido).toBe(true);
    expect(validarMensagem(partida, analista, 'Ele é um deputado federal.', new Date(DATA_BASE)).valido).toBe(true);
    expect(validarMensagem(partida, analista, 'Vamos disputar a partida.', new Date(DATA_BASE)).valido).toBe(true);
  });

  it('não aplica o filtro de palavrões a bots se o controle for ia', () => {
    const partida = criarPartidaTeste();
    const botAzul = buscarPorCor(partida, 'azul');
    
    // Adiciona uma mensagem do analista primeiro para poder validar mensagens de jogador
    const partidaComMensagemAnalista = registrarMensagem(partida, buscarPorCor(partida, 'analista'), 'Primeira pergunta do analista', DATA_BASE);
    const botAzulAtualizado = buscarPorCor(partidaComMensagemAnalista, 'azul');
    
    // Força o controle a ser 'ia'
    const botIa = { ...botAzulAtualizado, controle: 'ia' as const };
    const conteudo = 'Isso é uma merda';

    const resultado = validarMensagem(partidaComMensagemAnalista, botIa, conteudo, new Date(DATA_BASE));

    expect(resultado.valido).toBe(true);
  });
});
