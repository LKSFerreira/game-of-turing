import { montarPromptSistema, montarPromptUsuario } from './prompt-agentico';
import type { ProvedorIa, RespostaIa, SolicitarRespostaIaParametros } from './tipos';

const URL_API_OPENROUTER = 'https://openrouter.ai/api/v1/chat/completions';
const MODELO_PADRAO_OPENROUTER = 'meta-llama/llama-3.3-70b-instruct:free';

type RespostaApiOpenRouter = {
  choices: { message: { content: string } }[];
};

export const provedorOpenRouter: ProvedorIa = {
  nome: 'openrouter',

  async gerarResposta(parametros: SolicitarRespostaIaParametros): Promise<RespostaIa> {
    const chaveApi = process.env.OPENROUTER_API_KEY;

    if (!chaveApi) {
      throw new Error('Variável de ambiente OPENROUTER_API_KEY não configurada.');
    }

    const promptSistema = montarPromptSistema(parametros);
    const promptUsuario = montarPromptUsuario(parametros);

    const resposta = await fetch(URL_API_OPENROUTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${chaveApi}`,
        'HTTP-Referer': process.env.APP_URL ?? 'http://localhost:3000',
        'X-Title': 'Game of Turing',
      },
      body: JSON.stringify({
        model: MODELO_PADRAO_OPENROUTER,
        messages: [
          { role: 'system', content: promptSistema },
          { role: 'user', content: promptUsuario },
        ],
        max_tokens: 200,
        temperature: 0.9,
        stream: false,
      }),
    });

    if (!resposta.ok) {
      const corpo = await resposta.text();
      throw new Error(`OpenRouter retornou status ${resposta.status}: ${corpo}`);
    }

    const dados: RespostaApiOpenRouter = await resposta.json();
    let textoGerado = (dados.choices[0].message.content as string).trim();

    // Limpeza de aspas residuais comuns em modelos fechados
    textoGerado = textoGerado.replace(/^["']|["']$/g, '').trim();

    if (!textoGerado) {
      throw new Error('OpenRouter retornou resposta vazia.');
    }

    const textoLimitado =
      textoGerado.length <= parametros.limiteCaracteres
        ? textoGerado
        : textoGerado.slice(0, parametros.limiteCaracteres).trimEnd();

    return { texto: textoLimitado, provider: this.nome };
  },
};
