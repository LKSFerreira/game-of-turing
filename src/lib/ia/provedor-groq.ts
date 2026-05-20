import { montarPromptSistema, montarPromptUsuario } from './prompt-agentico';
import type { ProvedorIa, RespostaIa, SolicitarRespostaIaParametros } from './tipos';

const URL_API_GROQ = 'https://api.groq.com/openai/v1/chat/completions';
const MODELO_PADRAO_GROQ = 'llama-3.3-70b-versatile';

type RespostaApiGroq = {
  choices: { message: { content: string } }[];
};

export const provedorGroq: ProvedorIa = {
  nome: 'groq',

  async gerarResposta(parametros: SolicitarRespostaIaParametros): Promise<RespostaIa> {
    const chaveApi = process.env.GROQ_API_KEY;

    if (!chaveApi) {
      throw new Error('Variável de ambiente GROQ_API_KEY não configurada.');
    }

    const promptSistema = montarPromptSistema(parametros);
    const promptUsuario = montarPromptUsuario(parametros);

    const resposta = await fetch(URL_API_GROQ, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${chaveApi}`,
      },
      body: JSON.stringify({
        model: MODELO_PADRAO_GROQ,
        messages: [
          { role: 'system', content: promptSistema },
          { role: 'user', content: promptUsuario },
        ],
        max_completion_tokens: 200,
        temperature: 0.9,
        stream: false,
      }),
    });

    if (!resposta.ok) {
      const corpo = await resposta.text();
      throw new Error(`Groq retornou status ${resposta.status}: ${corpo}`);
    }

    const dados: RespostaApiGroq = await resposta.json();
    const textoGerado = dados.choices[0]?.message?.content?.trim() ?? '';

    if (!textoGerado) {
      throw new Error('Groq retornou resposta vazia.');
    }

    const textoLimitado =
      textoGerado.length <= parametros.limiteCaracteres
        ? textoGerado
        : textoGerado.slice(0, parametros.limiteCaracteres - 1).trimEnd() + '…';

    return { texto: textoLimitado, provider: this.nome };
  },
};
