import { GoogleGenAI } from '@google/genai';

import { montarPromptSistema, montarPromptUsuario } from './prompt-agentico';
import type { ProvedorIa, RespostaIa, SolicitarRespostaIaParametros } from './tipos';

const MODELO_PADRAO_GEMINI = 'gemini-2.5-flash';

export const provedorGemini: ProvedorIa = {
  nome: 'gemini',

  async gerarResposta(parametros: SolicitarRespostaIaParametros): Promise<RespostaIa> {
    const chaveApi = process.env.GEMINI_API_KEY;

    if (!chaveApi) {
      throw new Error('Variável de ambiente GEMINI_API_KEY não configurada.');
    }

    const clienteGemini = new GoogleGenAI({ apiKey: chaveApi });
    const promptSistema = montarPromptSistema(parametros);
    const promptUsuario = montarPromptUsuario(parametros);

    const resposta = await clienteGemini.models.generateContent({
      model: MODELO_PADRAO_GEMINI,
      contents: promptUsuario,
      config: {
        systemInstruction: promptSistema,
        maxOutputTokens: 200,
        temperature: 0.9,
      },
    });

    let textoGerado = resposta.text?.trim() ?? '';

    // Limpeza de aspas residuais comuns em modelos fechados
    textoGerado = textoGerado.replace(/^["']|["']$/g, '').trim();

    if (!textoGerado) {
      throw new Error('Gemini retornou resposta vazia.');
    }

    const textoLimitado =
      textoGerado.length <= parametros.limiteCaracteres
        ? textoGerado
        : textoGerado.slice(0, parametros.limiteCaracteres).trimEnd();

    return { texto: textoLimitado, provider: this.nome };
  },
};
