import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { history, prompt, secret_mission, color } = await req.json();

    const corJogador = color === 'blue' ? 'Azul' : 'Vermelho';
    const naturezaAlvo = secret_mission === 'A' ? 'humano' : 'IA';

    const systemInstruction = `Você está jogando um jogo chamado "Game of Turing".
Você é o jogador ${corJogador}.
Sua missão secreta é convencer o Analista de que você é ${naturezaAlvo}.
O histórico do chat contém mensagens do Analista, do jogador Azul e do jogador Vermelho.
Seja criativo, conciso e haja naturalmente em um ambiente de chat casual (como WhatsApp/Discord).
Mantenha as respostas curtas, no máximo 150 caracteres. Não pareça um robô se sua missão for parecer ${naturezaAlvo}. Responda em Português do Brasil (pt-BR).
Se sua missão for ser uma IA, você pode agir de forma ligeiramente robótica, excessivamente formal ou absurdamente eficiente, mas de forma muito sutil.
Responda diretamente à última mensagem do Analista ou do outro jogador se for relevante.
Não exiba seu papel, não use aspas ou prefixos em seu texto.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.9,
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
