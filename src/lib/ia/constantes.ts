// ── Circuit Breaker ──────────────────────────────────────────────
/** Tempo de espera (ms) para tentar novamente um provedor que falhou consecutivamente. */
export const TEMPO_RECUPERACAO_CIRCUIT_BREAKER_MS = 30_000;

/** Quantidade de falhas consecutivas para abrir o circuit breaker de um provedor. */
export const LIMITE_FALHAS_CIRCUIT_BREAKER = 3;

/** Quantidade de requisições recentes usadas no cálculo de média móvel de latência. */
export const JANELA_LATENCIA_MEDIA = 10;

// ── Comportamento de IA no Frontend ─────────────────────────────
/** Delay base (ms) do indicador de digitação antes da IA enviar a mensagem. */
export const DELAY_BASE_DIGITACAO_MS = 1200;

/** Variação aleatória (ms) adicionada ao delay base de digitação. */
export const DELAY_VARIACAO_DIGITACAO_MS = 800;

/** Quantidade máxima de mensagens do histórico enviadas à API de IA. */
export const MAXIMO_MENSAGENS_CONTEXTO_API = 12;

/** Segundos de silêncio no chat antes de considerar que a IA pode tomar a iniciativa. */
export const LIMITE_INATIVIDADE_SEGUNDOS = 15;

/** Probabilidade (0 a 1) de a IA enviar uma mensagem espontânea após período de inatividade. */
export const CHANCE_PROATIVIDADE_IA = 0.25;

/** Intervalo (ms) entre cada checagem de inatividade no chat. */
export const INTERVALO_CHECAGEM_INATIVIDADE_MS = 5_000;

// ── Simulação de Hesitação (Fake Typing) ─────────────────────────
/** Probabilidade (0 a 1) de a IA simular que está digitando mas desistir (hesitação). */
export const CHANCE_DIGITACAO_FAKE = 0.15;

/** Tempo mínimo (ms) da simulação de digitação fake de hesitação. */
export const TEMPO_MINIMO_DIGITACAO_FAKE_MS = 1000;

/** Tempo máximo (ms) da simulação de digitação fake de hesitação. */
export const TEMPO_MAXIMO_DIGITACAO_FAKE_MS = 3000;

