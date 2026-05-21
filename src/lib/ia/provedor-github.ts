import { montarPromptSistema, montarPromptUsuario } from './prompt-agentico';
import type { ProvedorIa, RespostaIa, SolicitarRespostaIaParametros } from './tipos';

// GitHub Models via API Oficial do GitHub Inference
const URL_API_GITHUB_MODELS = 'https://models.github.ai/inference/chat/completions';
const MODELO_PADRAO_GITHUB = 'openai/gpt-4o-mini';

type RespostaApiGithub = {
  choices: { message: { content: string } }[];
};

export const provedorGithub: ProvedorIa = {
  nome: 'github',

  async gerarResposta(parametros: SolicitarRespostaIaParametros): Promise<RespostaIa> {
    const chaveApi = process.env.GITHUB_TOKEN;

    if (!chaveApi) {
      throw new Error('Variável de ambiente GITHUB_TOKEN não configurada.');
    }

    const promptSistema = montarPromptSistema(parametros);
    const promptUsuario = montarPromptUsuario(parametros);

    const resposta = await fetch(URL_API_GITHUB_MODELS, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${chaveApi}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODELO_PADRAO_GITHUB,
        messages: [
          { role: 'system', content: promptSistema },
          { role: 'user', content: promptUsuario },
        ],
        max_tokens: 200,
        temperature: 0.9,
      }),
    });

    if (!resposta.ok) {
      const corpo = await resposta.text();
      throw new Error(`GitHub Models retornou status ${resposta.status}: ${corpo}`);
    }

    const dados: RespostaApiGithub = await resposta.json();
    let textoGerado = (dados.choices[0].message.content as string).trim();

    // Limpeza de aspas residuais
    textoGerado = textoGerado.replace(/^["']|["']$/g, '').trim();

    if (!textoGerado) {
      throw new Error('GitHub Models retornou resposta vazia.');
    }

    const textoLimitado =
      textoGerado.length <= parametros.limiteCaracteres
        ? textoGerado
        : textoGerado.slice(0, parametros.limiteCaracteres).trimEnd();

    return { texto: textoLimitado, provider: this.nome };
  },
};
