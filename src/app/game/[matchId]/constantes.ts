// ── Comportamento de IA no Frontend ─────────────────────────────
/** Delay base (ms) do indicador de digitação antes da IA enviar a mensagem. */
export const DELAY_BASE_DIGITACAO_MS = 1200;

/** Variação aleatória (ms) adicionada ao delay base de digitação. */
export const DELAY_VARIACAO_DIGITACAO_MS = 800;

/** Quantidade máxima de mensagens do histórico enviadas à API de IA. */
export const MAXIMO_MENSAGENS_CONTEXTO_API = 20;

/** Segundos de silêncio no chat antes de considerar que a IA pode tomar a iniciativa. */
export const LIMITE_INATIVIDADE_SEGUNDOS = 15;

/** Probabilidade (0 a 1) de a IA enviar uma mensagem espontânea após período de inatividade. */
export const CHANCE_PROATIVIDADE_IA = 0.25;

/** Intervalo (ms) entre cada checagem de inatividade no chat. */
export const INTERVALO_CHECAGEM_INATIVIDADE_MS = 5_000;

// ── Simulação de Hesitação (Fake Typing) ─────────────────────────
/** Probabilidade (0 a 1) de a IA simular que está digitando mas desistir (hesitação). */
export const CHANCE_DIGITACAO_FAKE = 0.20;

/** Tempo mínimo (ms) da simulação de digitação fake de hesitação. */
export const TEMPO_MINIMO_DIGITACAO_FAKE_MS = 1000;

/** Tempo máximo (ms) da simulação de digitação fake de hesitação. */
export const TEMPO_MAXIMO_DIGITACAO_FAKE_MS = 3500;

// ── Ritmos de Leitura e Digitação das IAs ──────────────────────────
/** Velocidade de leitura simulada das IAs (caracteres por segundo). */
export const CARACTERES_POR_SEGUNDO_LEITURA = 20;

/** Velocidade de digitação simulada das IAs (caracteres por segundo). */
export const CARACTERES_POR_SEGUNDO_DIGITACAO = 10;

/** Tempo máximo de digitação visual (ms) para evitar travar a interface. */
export const TEMPO_MAXIMO_DIGITACAO_UI_MS = 5000;

/** Delay base de digitação (ms) sob a nova fórmula. */
export const NOVO_DELAY_BASE_DIGITACAO_MS = 600;

/** Variação de delay de digitação (ms) sob a nova fórmula. */
export const NOVO_DELAY_VARIACAO_DIGITACAO_MS = 700;

/** Delay cognitivo de pensamento mínimo da IA antes de começar a responder (ms). */
export const TEMPO_PENSAMENTO_MINIMO_IA_MS = 300;

/** Variação aleatória do delay cognitivo de pensamento da IA (ms). */
export const TEMPO_PENSAMENTO_VARIACAO_IA_MS = 500;

/** Delay cognitivo de hesitação silenciosa mínimo para proatividade (ms). */
export const TEMPO_HESITACAO_PROATIVIDADE_MINIMO_MS = 800;

/** Variação aleatória de hesitação silenciosa para proatividade (ms). */
export const TEMPO_HESITACAO_PROATIVIDADE_VARIACAO_MS = 1200;
