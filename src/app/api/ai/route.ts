import { NextRequest, NextResponse } from 'next/server';

import { LIMITE_MAXIMO_CARACTERES_MENSAGEM } from '@/domain/jogo';
import type { CorParticipante, MensagemPartida, MissaoSecreta } from '@/domain/jogo';
import { ErroIndisponibilidadeIa, obterOrquestrador } from '@/lib/ia';

type CorpoRequisicaoIa = {
  cor: Extract<CorParticipante, 'azul' | 'vermelho'>;
  missaoSecreta: MissaoSecreta;
  historico: MensagemPartida[];
};

function isCorJogador(cor: unknown): cor is Extract<CorParticipante, 'azul' | 'vermelho'> {
  return cor === 'azul' || cor === 'vermelho';
}

function isMissaoSecreta(missaoSecreta: unknown): missaoSecreta is MissaoSecreta {
  return missaoSecreta === 'convencer_humano' || missaoSecreta === 'convencer_ia';
}

function validarCorpoRequisicao(corpo: unknown): CorpoRequisicaoIa {
  if (!corpo || typeof corpo !== 'object') {
    throw new Error('Payload da IA inválido.');
  }

  const corpoRequisicao = corpo as Partial<CorpoRequisicaoIa>;

  if (!isCorJogador(corpoRequisicao.cor)) {
    throw new Error('Cor do jogador inválida.');
  }

  if (!isMissaoSecreta(corpoRequisicao.missaoSecreta)) {
    throw new Error('Missão secreta inválida.');
  }

  if (!Array.isArray(corpoRequisicao.historico)) {
    throw new Error('Histórico de mensagens inválido.');
  }

  return {
    cor: corpoRequisicao.cor,
    missaoSecreta: corpoRequisicao.missaoSecreta,
    historico: corpoRequisicao.historico,
  };
}

export async function POST(requisicao: NextRequest) {
  let jogadorInfo = 'desconhecido';
  try {
    const json = await requisicao.json();
    const corpo = validarCorpoRequisicao(json);
    jogadorInfo = `${corpo.cor.toUpperCase()} (Missão: ${corpo.missaoSecreta})`;
    
    console.log(`[POST /api/ai] 📥 Requisição recebida para jogador ${jogadorInfo}. Histórico com ${corpo.historico.length} mensagens.`);
    
    const ultimaMensagemAnalista = [...corpo.historico]
      .reverse()
      .find(mensagem => mensagem.remetenteCor === 'analista');

    if (ultimaMensagemAnalista) {
      console.log(`[POST /api/ai] 💬 Mensagem mais recente do Analista: "${ultimaMensagemAnalista.conteudo}"`);
    }
    
    const orquestrador = obterOrquestrador();
    const resposta = await orquestrador.gerarResposta({
      ...corpo,
      limiteCaracteres: LIMITE_MAXIMO_CARACTERES_MENSAGEM,
    });

    console.log(`[POST /api/ai] 📤 Respondendo com sucesso para ${corpo.cor.toUpperCase()} via provedor [${resposta.provider.toUpperCase()}]. Texto: "${resposta.texto}"`);

    return NextResponse.json(resposta);
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : 'Erro desconhecido ao acionar IA.';
    
    if (erro instanceof ErroIndisponibilidadeIa) {
      console.error(`[POST /api/ai] ❌ Erro de INDISPONIBILIDADE_IA para jogador ${jogadorInfo}: ${mensagem}`);
      return NextResponse.json(
        { error: erro.message, codigo: 'INDISPONIBILIDADE_IA' },
        { status: 503 },
      );
    }

    console.error(`[POST /api/ai] ❌ Erro de processamento para jogador ${jogadorInfo}: ${mensagem}`);
    return NextResponse.json({ error: mensagem }, { status: 400 });
  }
}
