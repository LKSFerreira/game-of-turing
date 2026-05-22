import { NextRequest, NextResponse } from 'next/server';

export async function POST(requisicao: NextRequest) {
  try {
    const { tipoEvento, partidaId, detalhes } = await requisicao.json();

    switch (tipoEvento) {
      case 'PARTIDA_INICIADA':
        console.log(`\n\x1b[35m[PARTIDA ${partidaId}]\x1b[0m 🎮 Partida iniciada no frontend.`);
        break;
      case 'MENSAGEM_REGISTRADA':
        const { remetenteCor, conteudo } = detalhes;
        const corTerminal =
          remetenteCor === 'analista'
            ? '\x1b[33m' // Amarelo
            : remetenteCor === 'azul'
              ? '\x1b[36m' // Ciano
              : remetenteCor === 'vermelho'
                ? '\x1b[31m' // Vermelho
                : '\x1b[90m'; // Cinza para sistema/outros
        
        console.log(
          `\x1b[35m[PARTIDA ${partidaId}]\x1b[0m ${corTerminal}[${remetenteCor.toUpperCase()}]\x1b[0m: "${conteudo}"`,
        );
        break;
      case 'FASE_VEREDITO':
        console.log(`\x1b[35m[PARTIDA ${partidaId}]\x1b[0m ⚖️ Fase de Veredito iniciada.`);
        break;
      case 'VEREDITO_SUBMETIDO':
        console.log(
          `\x1b[35m[PARTIDA ${partidaId}]\x1b[0m ⚖️ Analista submeteu vereditos -> Azul: ${detalhes.azul.toUpperCase()} | Vermelho: ${detalhes.vermelho.toUpperCase()}`,
        );
        break;
      case 'PARTIDA_FINALIZADA':
        const { analistaVenceu, analistaInativoWo, participantes } = detalhes;
        const status = analistaInativoWo
          ? 'W.O. por Inatividade'
          : analistaVenceu
            ? 'Vencedor'
            : 'Derrotado';
        const corFim = analistaVenceu ? '\x1b[32m' : '\x1b[31m'; // Verde ou Vermelho
        
        console.log(
          `\x1b[35m[PARTIDA ${partidaId}]\x1b[0m ${corFim}🏆 Partida encerrada! Analista: ${status}\x1b[0m`,
        );
        
        participantes.forEach((p: any) => {
          const corPart = p.participanteId.includes('azul') ? '\x1b[36m' : p.participanteId.includes('vermelho') ? '\x1b[31m' : '\x1b[33m';
          console.log(
            `  └─ ${corPart}[${p.participanteId}]\x1b[0m: Venceu: ${p.venceu} | PDR: ${p.ajustePdr >= 0 ? '+' : ''}${p.ajustePdr} | MMR: ${p.ajusteMmr >= 0 ? '+' : ''}${p.ajusteMmr}`,
          );
        });
        console.log(''); // Linha em branco para espaçamento visual
        break;
      default:
        console.log(`\x1b[35m[PARTIDA ${partidaId}]\x1b[0m ⚙️ Evento desconhecido: ${tipoEvento}`);
    }

    return NextResponse.json({ ok: true });
  } catch (erro) {
    const mensagemErro = erro instanceof Error ? erro.message : 'Erro interno';
    console.error(`[API MATCH EVENT] Falha ao processar evento de log: ${mensagemErro}`);
    return NextResponse.json({ error: mensagemErro }, { status: 400 });
  }
}
