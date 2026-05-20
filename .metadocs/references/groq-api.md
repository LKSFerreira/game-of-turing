# Referência: Groq API

> Fontes oficiais:
> - [API Reference](https://console.groq.com/docs/api-reference)
> - [Supported Models](https://console.groq.com/docs/models)
> - [Rate Limits](https://console.groq.com/docs/rate-limits)
> - [OpenAI Compatibility](https://console.groq.com/docs/openai)
> - [Responses API](https://console.groq.com/docs/responses-api)
>
> Última atualização: 2026-05-20

---

## Índice

- [Visão Geral](#visão-geral)
- [Autenticação](#autenticação)
- [Planos e Preços](#planos-e-preços)
- [Modelos de Produção](#modelos-de-produção)
- [Rate Limits](#rate-limits)
- [Chat Completions](#chat-completions)
- [Compatibilidade OpenAI](#compatibilidade-openai)
- [Responses API (beta)](#responses-api-beta)
- [Audio](#audio)
- [Batches e Flex Processing](#batches-e-flex-processing)
- [Auditoria: Nosso Provider vs Documentação Oficial](#auditoria-nosso-provider-vs-documentação-oficial)

---

## Visão Geral

A Groq oferece inferência ultra-rápida usando hardware proprietário (LPU — Language Processing Unit). A API é compatível com o formato OpenAI (`/openai/v1/...`), permitindo reutilizar o mesmo formato de request/response.

**Base URL:** `https://api.groq.com/openai/v1`

**Formas de integração:**
- REST API via `fetch` nativo (nosso approach — zero dependências extras)
- SDK oficial: `groq-sdk` (npm)
- SDK OpenAI apontando para a base URL da Groq

---

## Autenticação

Todas as requisições exigem Bearer token no header `Authorization`:

```http
Authorization: Bearer $GROQ_API_KEY
Content-Type: application/json
```

A chave é obtida em [console.groq.com/keys](https://console.groq.com/keys).

> **Segurança:** A `GROQ_API_KEY` é server-side. Nunca usar `NEXT_PUBLIC_` nem expor ao client.

---

## Planos e Preços

### Planos Disponíveis

| Característica | Free (Gratuito) | Developer (Pago) |
|---|---|---|
| **Custo** | $0 | Pay-as-you-go (por token) |
| **Cartão de crédito** | Não exige | Exige |
| **Rate Limits** | Limites base | Até **10x** os limites base |
| **Batch API** | ❌ | ✅ (50% desconto) |
| **Flex Processing** | ❌ | ✅ (10x rate limits) |
| **Prompt Caching** | ✅ (50% desconto em input tokens repetidos) | ✅ |
| **Acesso a modelos** | Todos os modelos | Todos os modelos |

> **Importante para o Game of Turing:** O plano Free dá acesso a **todos os modelos** sem custo, limitado apenas por rate limits. Suficiente para desenvolvimento e testes. Para produção (viral), será necessário o plano Developer.

### Preços por Token (Developer Plan)

| Modelo | Input (por 1M tokens) | Output (por 1M tokens) |
|---|---|---|
| **Llama 3.3 70B** (nosso modelo) | $0.59 | $0.79 |
| Llama 3.1 8B | $0.05 | $0.08 |
| GPT-OSS 120B | $0.15 | $0.60 |
| GPT-OSS 20B | $0.075 | $0.30 |
| Whisper Large V3 | $0.111 por hora | — |
| Whisper Large V3 Turbo | $0.04 por hora | — |

### Descontos

| Tipo | Desconto | Condição |
|---|---|---|
| **Batch API** | 50% | Processamento offline (24h-7d) |
| **Prompt Caching** | 50% em input tokens | Prompts repetidos (ex: system prompt) |

> O desconto de Batch **não acumula** com Prompt Caching. Tokens em batch são cobrados na taxa batch, independente de cache.

### Links para Consulta Direta

- 🔗 **Seus limites atuais:** [console.groq.com/settings/limits](https://console.groq.com/settings/limits)
- 🔗 **Upgrade de plano:** [console.groq.com/settings/billing/plans](https://console.groq.com/settings/billing/plans)
- 🔗 **Suas chaves de API:** [console.groq.com/keys](https://console.groq.com/keys)

---

## Modelos de Produção

Modelos marcados como "Production" pela Groq — estáveis, sem risco de remoção repentina.

| Model ID | Owner | Velocidade | Input $/1M | Output $/1M | Context Window | Max Completion Tokens |
|---|---|---|---|---|---|---|
| **`llama-3.3-70b-versatile`** | Meta | ~280 t/s | $0.59 | $0.79 | 131,072 | 32,768 |
| `llama-3.1-8b-instant` | Meta | ~560 t/s | $0.05 | $0.08 | 131,072 | 131,072 |
| `openai/gpt-oss-120b` | OpenAI | ~500 t/s | $0.15 | $0.60 | 131,072 | 65,536 |
| `openai/gpt-oss-20b` | OpenAI | ~1000 t/s | $0.075 | $0.30 | 131,072 | 65,536 |
| `whisper-large-v3` | OpenAI | — | $0.111/h | — | — | — |
| `whisper-large-v3-turbo` | OpenAI | — | $0.04/h | — | — | — |

### Modelos Preview (apenas avaliação, não usar em produção)

| Model ID | Owner | Velocidade | Context Window |
|---|---|---|---|
| `meta-llama/llama-4-scout-17b-16e-instruct` | Meta | ~750 t/s | 131,072 |
| `qwen/qwen3-32b` | Alibaba | ~400 t/s | 131,072 |
| `openai/gpt-oss-safeguard-20b` | OpenAI | ~1000 t/s | 131,072 |

### Systems (Compound AI)

| System ID | Velocidade | Context Window | Descrição |
|---|---|---|---|
| `groq/compound` | ~450 t/s | 131,072 | Coleção de modelos + tools (web search, code execution) |
| `groq/compound-mini` | ~450 t/s | 131,072 | Versão compacta do Compound |

> **Nosso modelo:** `llama-3.3-70b-versatile` — melhor equilíbrio entre qualidade e velocidade para o Game of Turing.

---

## Rate Limits

Rate limits se aplicam no nível da **organização** (não por API key).

### Métricas de Rate Limit

| Sigla | Significado |
|---|---|
| RPM | Requests por Minuto |
| RPD | Requests por Dia |
| TPM | Tokens por Minuto |
| TPD | Tokens por Dia |
| ASH | Audio Seconds por Hora |

> **Regra "first-to-hit":** Qualquer métrica que atingir o limite primeiro bloqueia. Ex: se seu RPM=30 e TPM=12K, atingir 30 requests em 1 minuto bloqueia mesmo que não tenha usado 12K tokens.

### Limites por Modelo (Free Tier)

| Modelo | RPM | RPD | TPM | TPD |
|---|---|---|---|---|
| `llama-3.3-70b-versatile` | 30 | 1K | 12K | 100K |
| `llama-3.1-8b-instant` | 30 | 14.4K | 6K | 500K |
| `openai/gpt-oss-120b` | 30 | 1K | 8K | 200K |
| `openai/gpt-oss-20b` | 30 | 1K | 8K | 200K |
| `qwen/qwen3-32b` | 60 | 1K | 6K | 500K |

> **Developer Plan:** Multiplica esses limites por até **10x**.

### Implicação para o Orquestrador

O `llama-3.3-70b-versatile` no free tier tem limite de **30 RPM** e **1K RPD**. Isso significa:
- **30 RPM:** Suficiente para testes (uma partida gera ~10-20 requests de IA por jogo).
- **1K RPD:** ~50-100 partidas por dia no máximo.
- **Para produção viral:** Developer Plan necessário (300 RPM, 10K+ RPD estimado).

Quando a Groq retorna `429 Too Many Requests`, o circuit breaker do orquestrador registra como falha e faz fallback para OpenRouter/Gemini.

### Headers de Rate Limit na Resposta

| Header | Descrição |
|---|---|
| `retry-after` | Segundos para esperar (só quando retorna 429) |
| `x-ratelimit-limit-requests` | RPD total |
| `x-ratelimit-limit-tokens` | TPM total |
| `x-ratelimit-remaining-requests` | RPD restante |
| `x-ratelimit-remaining-tokens` | TPM restante |
| `x-ratelimit-reset-requests` | Tempo até reset do RPD |
| `x-ratelimit-reset-tokens` | Tempo até reset do TPM |

---

## Chat Completions

**Endpoint principal usado pelo Game of Turing.**

```
POST https://api.groq.com/openai/v1/chat/completions
```

### Request Body — Parâmetros Obrigatórios

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `messages` | `array` | Lista de mensagens. Cada uma com `role` (`system`, `user`, `assistant`) e `content`. |
| `model` | `string` | ID do modelo. Ex: `llama-3.3-70b-versatile`. |

### Request Body — Parâmetros Opcionais Relevantes

| Parâmetro | Tipo | Default | Descrição |
|---|---|---|---|
| `max_completion_tokens` | `integer \| null` | — | Máximo de tokens na resposta. **Substitui `max_tokens`** (deprecated). |
| `temperature` | `number \| null` | `1` | Aleatoriedade. Range: `0`-`2`. |
| `top_p` | `number \| null` | `1` | Nucleus sampling. Range: `0`-`1`. Não usar junto com `temperature`. |
| `stream` | `boolean \| null` | `false` | Streaming via Server-Sent Events. |
| `stop` | `string \| array \| null` | — | Até 4 sequências de parada. |
| `seed` | `integer \| null` | — | Reprodutibilidade (best-effort, não garantida). |
| `response_format` | `object \| null` | — | Força JSON. Suporta `json_object` e `json_schema`. |
| `tools` | `array \| null` | — | Function calling. Máximo: 128 funções. |
| `tool_choice` | `string \| object \| null` | `auto` | Controla tool selection. |
| `user` | `string \| null` | — | ID do end-user para monitoramento. |
| `service_tier` | `string \| null` | `on_demand` | `auto`, `on_demand`, `flex`, `performance`. |

### Parâmetros Deprecated

| Parâmetro | Substituído por |
|---|---|
| `max_tokens` | `max_completion_tokens` |
| `function_call` | `tool_choice` |
| `functions` | `tools` |

### Parâmetros Não Suportados (documentados mas inativos)

`frequency_penalty`, `presence_penalty`, `logprobs`, `top_logprobs`, `logit_bias`, `metadata`, `store`.

### Limitação Importante: Temperature 0

> Se `temperature: 0` for enviado, a Groq converte internamente para `1e-8`. Se houver problemas, usar um float > 0 e <= 2.

### Response Object

```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1730241104,
  "model": "llama-3.3-70b-versatile",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Texto gerado..."
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "queue_time": 0.037,
    "prompt_tokens": 18,
    "prompt_time": 0.000680,
    "completion_tokens": 556,
    "completion_time": 0.463,
    "total_tokens": 574,
    "total_time": 0.464
  },
  "system_fingerprint": "fp_179b0f92c9",
  "x_groq": { "id": "req_01jbd6g2qdfw2adyrt2az8hz4w" }
}
```

**Campos relevantes:**

| Campo | Descrição |
|---|---|
| `choices[].message.content` | Texto gerado. |
| `choices[].finish_reason` | `stop` (natural), `length` (max tokens), `tool_calls`. |
| `usage.prompt_tokens` | Tokens consumidos pelo prompt. |
| `usage.completion_tokens` | Tokens gerados. |
| `usage.total_tokens` | Total (prompt + completion). |
| `usage.queue_time` | Tempo na fila (s). |
| `x_groq.id` | ID interno (debug/suporte). |

---

## Compatibilidade OpenAI

A API Groq é **compatível com o formato OpenAI**. É possível usar o SDK `openai` apontando a `base_url`:

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});
```

### Funcionalidades NÃO Suportadas

Ao usar o SDK OpenAI com Groq, as seguintes funcionalidades retornam `400 Bad Request`:

- `logprobs`
- `logit_bias`
- `top_logprobs`
- `messages[].name`
- `n` > 1 (apenas `n=1` é suportado)

---

## Responses API (beta)

```
POST https://api.groq.com/openai/v1/responses
```

API alternativa mais recente. Diferenças do Chat Completions:

| Aspecto | Chat Completions | Responses API |
|---|---|---|
| Input | `messages` (array) | `input` (string ou array) |
| System prompt | `role: system` | `instructions` (campo dedicado) |
| Max tokens | `max_completion_tokens` | `max_output_tokens` |
| Resposta | `choices[].message.content` | `output[].content[].text` |
| Reasoning | Via parâmetros | Suporte nativo |
| Built-in tools | ❌ | ✅ (browser search, code execution) |
| MCP | ❌ | ✅ |
| Stateful conversations | N/A | Não suportado (manual) |

### Modelos com Suporte a Built-in Tools

| Modelo | Browser Search | Code Execution |
|---|---|---|
| `openai/gpt-oss-20b` | ✅ | ✅ |
| `openai/gpt-oss-120b` | ✅ | ✅ |

### Funcionalidades NÃO Suportadas na Responses API

`previous_response_id`, `store`, `truncation`, `include`, `safety_identifier`, `prompt_cache_key`, `prompt` (reusable prompts).

**Status:** Beta — **não usamos no Game of Turing**. O Chat Completions é mais estável.

---

## Audio

Não utilizados no Game of Turing, mas documentados para referência:

| Endpoint | Descrição | Modelos |
|---|---|---|
| `/v1/audio/transcriptions` | Áudio → Texto | `whisper-large-v3`, `whisper-large-v3-turbo` |
| `/v1/audio/translations` | Áudio → Inglês | Mesmos |
| `/v1/audio/speech` | Texto → Áudio | `playai-tts` |

---

## Batches e Flex Processing

### Batch API

- **Desconto:** 50% sobre preço on-demand.
- **Janela:** 24h a 7d.
- **Uso:** Processamento offline (classificação em massa, traduções, sumarização).
- **Requisitos:** Developer Plan.
- **Não acumula** com Prompt Caching.

### Flex Processing

- **Sem desconto** no preço por token.
- **Rate limits:** 10x maiores que on-demand.
- **Risco:** Se sem capacidade, retorna `498 capacity_exceeded`.
- **Requisitos:** Developer Plan.
- **Recomendação:** Implementar jittered backoff e retries.

**Nenhum dos dois é utilizado no Game of Turing** — nosso caso é real-time com o endpoint padrão de Chat Completions.

---

## Auditoria: Nosso Provider vs Documentação Oficial

Arquivo: [`src/lib/ia/provedor-groq.ts`](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/lib/ia/provedor-groq.ts)

### Itens Corretos ✅

| Item | Nosso Código | Documentação |
|---|---|---|
| URL do endpoint | `https://api.groq.com/openai/v1/chat/completions` | ✅ |
| Modelo | `llama-3.3-70b-versatile` | ✅ Production model |
| Autenticação | `Bearer ${chaveApi}` | ✅ |
| Formato do body | `messages` com `role` + `content` | ✅ |
| Roles usadas | `system` + `user` | ✅ |
| `max_completion_tokens` | `200` | ✅ (corrigido de `max_tokens`) |
| `temperature` | `0.9` | ✅ Range 0-2 |
| `stream` | `false` | ✅ |
| Leitura da resposta | `choices[0].message.content` | ✅ |
| Tratamento de erro | `response.ok` | ✅ |

### Inconsistências Corrigidas ✅

| Item | Antes | Depois |
|---|---|---|
| `max_tokens` | ~~Deprecated~~ | `max_completion_tokens` ✅ |

### Melhorias Opcionais (Futuro)

| Item | Descrição | Prioridade |
|---|---|---|
| Tipo da resposta | Adicionar `usage` e `x_groq.id` para log/métricas | Baixa |
| `service_tier` | Usar `flex` para requests mais rápidos (risco de falha) | Baixa |
| `user` | Enviar ID da partida para monitoramento no dashboard | Baixa |
| Rate limit headers | Ler `x-ratelimit-remaining-*` para ajustar peso do provider em tempo real | Média |
