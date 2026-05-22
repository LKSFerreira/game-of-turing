// ── Circuit Breaker ──────────────────────────────────────────────
/** Tempo de espera (ms) para tentar novamente um provedor que falhou consecutivamente. */
export const TEMPO_RECUPERACAO_CIRCUIT_BREAKER_MS = 30_000;

/** Quantidade de falhas consecutivas para abrir o circuit breaker de um provedor. */
export const LIMITE_FALHAS_CIRCUIT_BREAKER = 3;

/** Quantidade de requisições recentes usadas no cálculo de média móvel de latência. */
export const JANELA_LATENCIA_MEDIA = 10;




