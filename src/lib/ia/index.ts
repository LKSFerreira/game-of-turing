import { provedorFakeIa } from './provedor-fake';
import type { ProvedorIa } from './tipos';

const PROVEDORES_IA: Record<string, ProvedorIa> = {
  fake: provedorFakeIa,
};

export function obterProvedorIa(nomeProvider = process.env.AI_PROVIDER): ProvedorIa {
  const chaveProvider = nomeProvider?.toLowerCase() || 'fake';

  return PROVEDORES_IA[chaveProvider] ?? provedorFakeIa;
}

export type { ProvedorIa, RespostaIa, SolicitarRespostaIaParametros } from './tipos';
