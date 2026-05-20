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
    const conteudo = 'abcde'.repeat(30) + 'x';

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
    const partida = { ...criarPartidaTeste(), orcamentoCaracteresJogador: 30 };
    const azul = { ...buscarPorCor(partida, 'azul'), caracteresUsados: 20 };
    const conteudo = 'abcdefghij';

    const resultado = validarMensagem(partida, azul, conteudo, new Date(DATA_BASE));

    expect(resultado).toMatchObject({ valido: true });
  });

  it('rejeita quando ultrapassa orçamento por um único caractere', () => {
    const partida = { ...criarPartidaTeste(), orcamentoCaracteresJogador: 20 };
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

  it('gera ID de mensagem sequencial', () => {
    const partida = criarPartidaTeste();
    const analista = buscarPorCor(partida, 'analista');
    const totalMensagensInicial = partida.mensagens.length;

    const partidaComMensagem = registrarMensagem(
      partida,
      analista,
      'Primeira nova mensagem',
      DATA_BASE,
    );
    const novaMensagem = partidaComMensagem.mensagens[partidaComMensagem.mensagens.length - 1];

    expect(novaMensagem.id).toBe(`${partida.id}-mensagem-${totalMensagensInicial + 1}`);
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
