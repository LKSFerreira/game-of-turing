import { criarOrquestrador } from './orquestrador';
import type { OrquestradorIa } from './orquestrador';
import { provedorFakeIa } from './provedor-fake';
import { provedorGemini } from './provedor-gemini';
import { provedorGroq } from './provedor-groq';
import { provedorOpenRouter } from './provedor-openrouter';
import type { ProvedorIa } from './tipos';
import type { ConfiguracaoProviderComInstancia } from './tipos-orquestrador';

const MAPA_PROVIDERS: Record<string, ProvedorIa> = {
  groq: provedorGroq,
  openrouter: provedorOpenRouter,
  gemini: provedorGemini,
  fake: provedorFakeIa,
};

const PESOS_PADRAO: Record<string, number> = {
  gemini: 5,
  groq: 3,
  openrouter: 2,
};

let orquestradorCache: OrquestradorIa | null = null;

function parseProvidersAtivos(): ConfiguracaoProviderComInstancia[] {
  const listaProviders = process.env.AI_PROVIDERS;
  const listaPesos = process.env.AI_PROVIDER_WEIGHTS;

  if (!listaProviders) {
    // Compatibilidade: se AI_PROVIDERS não existe, usa AI_PROVIDER (singular)
    const providerUnico = process.env.AI_PROVIDER?.toLowerCase() || 'fake';
    const provedor = MAPA_PROVIDERS[providerUnico] ?? provedorFakeIa;

    return [{ provedor, peso: PESOS_PADRAO[providerUnico] ?? 1 }];
  }

  const nomes = listaProviders.split(',').map(nome => nome.trim().toLowerCase());
  const pesos = listaPesos
    ? listaPesos.split(',').map(peso => parseInt(peso.trim(), 10))
    : [];

  const limiteFalhas = parseInt(process.env.AI_CIRCUIT_BREAKER_THRESHOLD ?? '3', 10);
  const tempoRecuperacao = parseInt(process.env.AI_CIRCUIT_BREAKER_RECOVERY_MS ?? '30000', 10);

  return nomes.reduce<ConfiguracaoProviderComInstancia[]>((acumulador, nome, indice) => {
    const provedor = MAPA_PROVIDERS[nome];

    if (!provedor) return acumulador;

    acumulador.push({
      provedor,
      peso: pesos[indice] ?? PESOS_PADRAO[nome] ?? 1,
      limiteErros: limiteFalhas,
      tempoRecuperacao,
    });

    return acumulador;
  }, []);
}

/** Retorna o orquestrador multi-provider configurado via variáveis de ambiente. */
export function obterOrquestrador(): OrquestradorIa {
  if (orquestradorCache) return orquestradorCache;

  const configuracoes = parseProvidersAtivos();

  orquestradorCache = criarOrquestrador(configuracoes);

  return orquestradorCache;
}

/**
 * Compatibilidade retroativa: retorna um único provider pelo nome.
 * Usado apenas em testes e desenvolvimento local.
 */
export function obterProvedorIa(nomeProvider = process.env.AI_PROVIDER): ProvedorIa {
  const chaveProvider = nomeProvider?.toLowerCase() || 'fake';

  return MAPA_PROVIDERS[chaveProvider] ?? provedorFakeIa;
}

export type { ProvedorIa, RespostaIa, SolicitarRespostaIaParametros } from './tipos';
export type { OrquestradorIa } from './orquestrador';
export { ErroIndisponibilidadeIa } from './tipos-orquestrador';
