# Referência: OpenRouter API

> Fontes oficiais:
> - [Documentação Geral](https://openrouter.ai/docs/quickstart)
> - [API Reference](https://openrouter.ai/docs/api-reference/overview)
> - [Models](https://openrouter.ai/models)
> - [FAQ](https://openrouter.ai/docs/faq)
> - [Rate Limits](https://openrouter.ai/docs/api-reference/limits)
>
> Última atualização: 2026-05-20

---

## Índice

- [Visão Geral](#visão-geral)
- [Autenticação e Headers](#autenticação-e-headers)
- [Planos, Preços e Free Tier](#planos-preços-e-free-tier)
- [Modelos e Variantes](#modelos-e-variantes)
- [Rate Limits](#rate-limits)
- [Chat Completions](#chat-completions)
- [Models API](#models-api)
- [Provider Routing e Fallback](#provider-routing-e-fallback)
- [Privacidade e Logging](#privacidade-e-logging)
- [Auditoria: Nosso Provider vs Documentação Oficial](#auditoria-nosso-provider-vs-documentação-oficial)

---

## Visão Geral

OpenRouter é um **gateway unificado** para 300+ modelos de IA de múltiplos providers. Funciona como proxy — recebe sua requisição, roteia para o melhor provider disponível, e devolve a resposta. A API é **compatível com o formato OpenAI**, atuando como drop-in replacement.

**Base URL:** `https://openrouter.ai/api/v1`

**Diferenciais:**
- API única para todos os modelos (OpenAI, Anthropic, Meta, Google, Mistral, etc.)
- Fallback automático entre providers quando um deles falha.
- Sem markup no preço de inferência — mesmo preço do provider direto.
- Modelos gratuitos com rate limits baixos (suficientes para dev/teste).
- Variantes de modelo (`:free`, `:nitro`, `:thinking`, `:floor`).

**Formas de integração:**
- REST API via `fetch` nativo (nosso approach — zero dependências extras)
- SDK OpenAI apontando para a base URL do OpenRouter
- Qualquer SDK compatível com OpenAI

---

## Autenticação e Headers

### Header Obrigatório

```http
Authorization: Bearer $OPENROUTER_API_KEY
Content-Type: application/json
```

A chave é obtida em [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys).

### Headers Opcionais (recomendados)

| Header | Descrição |
|---|---|
| `HTTP-Referer` | URL do seu site/app. Aparece no dashboard e ajuda a identificar o tráfego. |
| `X-Title` | Nome do seu app. Exibido no dashboard e nas listagens de uso. |

> **Segurança:** A `OPENROUTER_API_KEY` é server-side. Nunca usar `NEXT_PUBLIC_` nem expor ao client.

---

## Planos, Preços e Free Tier

### Modelo de Cobrança

OpenRouter usa um sistema de **créditos pré-pagos**. Você deposita saldo e as requisições consomem créditos conforme o preço por token de cada modelo.

| Item | Detalhe |
|---|---|
| **Forma de pagamento** | Cartão de crédito, AliPay, crypto (USDC) |
| **Taxa da plataforma** | ~5.5% na compra de créditos |
| **Markup de inferência** | **Nenhum** — mesmo preço do provider direto |
| **Validade dos créditos** | Reserva-se o direito de expirar após 1 ano sem uso |
| **Reembolso** | Até 24h após a compra (exceto crypto) |
| **Logging opt-in** | 1% de desconto se optar por logar prompts/completions |

### Free Tier

| Cenário | Rate Limit de Modelos Gratuitos |
|---|---|
| **Sem créditos comprados** | **50 requests/dia** total |
| **Com ≥ $10 em créditos** | **1.000 requests/dia** total |
| RPM (ambos) | ~20 requests/minuto |

> **Modelos gratuitos** usam o sufixo `:free` no slug (ex: `meta-llama/llama-3.3-70b-instruct:free`). Não há custo por token — o rate limit é a única restrição.

### Preços dos Modelos Pagos (exemplos)

O preço é por token. Cada modelo tem preço de input e output separados. Exemplo:

| Modelo | Input $/1M tokens | Output $/1M tokens |
|---|---|---|
| `meta-llama/llama-3.3-70b-instruct` | Varia por provider | Varia por provider |
| `openai/gpt-4o` | ~$2.50 | ~$10.00 |
| `anthropic/claude-3.5-sonnet` | ~$3.00 | ~$15.00 |

> Preços exatos estão na API de modelos ou em [openrouter.ai/models](https://openrouter.ai/models). O campo `pricing` de cada modelo contém `prompt` e `completion` em USD por token.

### Links para Consulta Direta

- 🔗 **Seus créditos:** [openrouter.ai/settings/credits](https://openrouter.ai/settings/credits)
- 🔗 **Suas API keys:** [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys)
- 🔗 **Histórico de uso:** [openrouter.ai/activity](https://openrouter.ai/activity)
- 🔗 **Modelos gratuitos:** [openrouter.ai/models?max_price=0](https://openrouter.ai/models?max_price=0)
- 🔗 **Todos os modelos:** [openrouter.ai/models](https://openrouter.ai/models)

---

## Modelos e Variantes

### Catálogo

OpenRouter agrega **300+ modelos** de múltiplos providers. Cada modelo tem um `id` no formato `owner/model-name` (ex: `meta-llama/llama-3.3-70b-instruct`).

### Variantes de Modelo

Sufixos que podem ser adicionados ao slug para alterar o comportamento:

#### Variantes Estáticas (modelo-específicas)

| Sufixo | Descrição | Exemplo |
|---|---|---|
| `:free` | Modelo gratuito, rate limits baixos | `meta-llama/llama-3.3-70b-instruct:free` |
| `:extended` | Contexto mais longo que o padrão | `model-slug:extended` |
| `:thinking` | Reasoning ativado por padrão | `model-slug:thinking` |

#### Variantes Dinâmicas (todos os modelos)

| Sufixo | Descrição |
|---|---|
| `:nitro` | Providers ordenados por throughput (mais rápido) |
| `:floor` | Providers ordenados por preço (mais barato) |
| `:exacto` | Otimizado para confiabilidade de tool calling |
| `:online` | *(deprecated)* Web search automático |

> **Nosso modelo:** `meta-llama/llama-3.3-70b-instruct:free` — variante gratuita do Llama 3.3 70B.

### Schema de Modelo (API)

Cada modelo retornado pela Models API contém:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `string` | Slug do modelo (ex: `meta-llama/llama-3.3-70b-instruct`) |
| `name` | `string` | Nome legível |
| `context_length` | `number` | Janela de contexto máxima (tokens) |
| `pricing.prompt` | `string` | Custo por token de input (USD) |
| `pricing.completion` | `string` | Custo por token de output (USD) |
| `top_provider.max_completion_tokens` | `number` | Max tokens na resposta |
| `top_provider.is_moderated` | `boolean` | Se tem moderação de conteúdo |
| `supported_parameters` | `string[]` | Parâmetros suportados |
| `architecture.tokenizer` | `string` | Tipo de tokenizador |

---

## Rate Limits

Rate limits se aplicam no nível da **organização** (não por API key individual).

### Modelos Gratuitos (`:free`)

| Condição | Limite |
|---|---|
| Sem créditos | 50 requests/dia |
| Com ≥ $10 em créditos | 1.000 requests/dia |
| RPM | ~20 requests/minuto |

> Tentativas que falham (erros) contam no quota diário.

### Modelos Pagos

Para modelos pagos, geralmente não há rate limit imposto pela plataforma OpenRouter — o throttling vem dos providers upstream.

### Headers de Rate Limit

Quando uma requisição excede o limite, retorna `429 Too Many Requests`. Os headers de rate limit são enviados em todas as respostas:

| Header | Descrição |
|---|---|
| `x-ratelimit-limit-requests` | Total de requests permitidos |
| `x-ratelimit-remaining-requests` | Requests restantes |
| `x-ratelimit-reset-requests` | Quando o contador reseta |

---

## Chat Completions

**Endpoint principal usado pelo Game of Turing.**

```
POST https://openrouter.ai/api/v1/chat/completions
```

### Request Body — Parâmetros Obrigatórios

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `messages` | `array` | Lista de mensagens. Cada uma com `role` (`system`, `user`, `assistant`) e `content`. |
| `model` | `string` | Slug do modelo (ex: `meta-llama/llama-3.3-70b-instruct:free`). |

### Request Body — Parâmetros Opcionais Relevantes

| Parâmetro | Tipo | Default | Descrição |
|---|---|---|---|
| `max_tokens` | `integer` | — | Máximo de tokens na resposta. (OpenRouter usa `max_tokens`, não `max_completion_tokens`) |
| `temperature` | `number` | `1` | Aleatoriedade. Range: `0`-`2`. |
| `top_p` | `number` | `1` | Nucleus sampling. Range: `0`-`1`. |
| `stream` | `boolean` | `false` | Streaming via Server-Sent Events. |
| `stop` | `string \| array` | — | Sequências de parada. |
| `seed` | `integer` | — | Reprodutibilidade (best-effort). |
| `frequency_penalty` | `number` | `0` | Penaliza repetição. Range: `-2` a `2`. |
| `presence_penalty` | `number` | `0` | Incentiva novos tópicos. Range: `-2` a `2`. |
| `response_format` | `object` | — | Força JSON (`json_object` ou `json_schema`). |
| `tools` | `array` | — | Function calling. |
| `tool_choice` | `string \| object` | `auto` | Controle de tool selection. |

> **Nota sobre `max_tokens`:** Diferente da Groq que deprecou `max_tokens` em favor de `max_completion_tokens`, o OpenRouter continua usando `max_tokens` como parâmetro padrão na documentação. Ambos são aceitos dependendo do provider downstream, mas `max_tokens` é o mais amplamente compatível.

### Response Object

```json
{
  "id": "gen-...",
  "object": "chat.completion",
  "created": 1730241104,
  "model": "meta-llama/llama-3.3-70b-instruct",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Texto gerado..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 120,
    "total_tokens": 170
  }
}
```

**Campos relevantes:**

| Campo | Descrição |
|---|---|
| `choices[].message.content` | Texto gerado. |
| `choices[].finish_reason` | `stop`, `length`, `tool_calls`. |
| `usage.prompt_tokens` | Tokens consumidos pelo prompt. |
| `usage.completion_tokens` | Tokens gerados. |
| `usage.total_tokens` | Total. |

### Exemplo Completo (curl)

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "HTTP-Referer: http://localhost:3000" \
  -H "X-Title: Game of Turing" \
  -d '{
    "model": "meta-llama/llama-3.3-70b-instruct:free",
    "messages": [
      { "role": "system", "content": "Você é um assistente." },
      { "role": "user", "content": "Olá!" }
    ],
    "max_tokens": 200,
    "temperature": 0.9,
    "stream": false
  }'
```

### Exemplo com SDK OpenAI (TypeScript)

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'Game of Turing',
  },
});

const completion = await client.chat.completions.create({
  model: 'meta-llama/llama-3.3-70b-instruct:free',
  messages: [
    { role: 'system', content: 'Você é um assistente.' },
    { role: 'user', content: 'Olá!' },
  ],
  max_tokens: 200,
  temperature: 0.9,
});

console.log(completion.choices[0].message.content);
```

---

## Models API

```
GET https://openrouter.ai/api/v1/models
```

Lista todos os modelos disponíveis. Suporta filtros via query parameters:

| Parâmetro | Descrição |
|---|---|
| `output_modalities` | `text` (default), `image`, `audio`, `embeddings`, `all` |
| `supported_parameters` | Filtra por parâmetro suportado (ex: `tools`) |
| `category` | Filtra por caso de uso (`programming`, `roleplay`, `marketing`, etc.) |

```
GET https://openrouter.ai/api/v1/models/count
```

Retorna o total de modelos disponíveis.

---

## Provider Routing e Fallback

O OpenRouter roteia automaticamente requisições entre providers. Configurações de roteamento:

### Fallback Automático

Se um provider retorna erro, o OpenRouter faz fallback transparente para o próximo provider disponível. Isso é feito sem intervenção do cliente.

### Opções de Roteamento

Via parâmetro `provider` no request body ou via variantes de modelo:

| Método | Descrição |
|---|---|
| `:nitro` | Otimiza por throughput (mais rápido) |
| `:floor` | Otimiza por preço (mais barato) |
| `:exacto` | Otimiza por qualidade de tool calling |
| `provider.order` | Lista explícita de providers preferidos |
| `provider.allow_fallbacks` | `true` (default) — permite fallback |

> **Implicação para o Game of Turing:** O fallback automático do OpenRouter complementa o circuit breaker do nosso orquestrador. Quando o OpenRouter faz fallback internamente, é transparente para nós. Quando o próprio OpenRouter falha, nosso orquestrador faz fallback para Groq ou Gemini.

---

## Privacidade e Logging

| Aspecto | Comportamento |
|---|---|
| **Prompts/Completions** | **Não logados** por padrão |
| **Metadata** | Timestamps, modelo, token counts são logados |
| **Opt-in** | Opção de logar prompts/completions em troca de 1% de desconto |
| **Provider logging** | Providers que logam/treinam são filtrados pelas configurações de privacidade da conta |
| **Configurações de privacidade** | [openrouter.ai/settings/privacy](https://openrouter.ai/settings/privacy) |

> **Zero logging por padrão** é positivo para o Game of Turing — conversas dos jogadores não ficam armazenadas no OpenRouter.

---

## Auditoria: Nosso Provider vs Documentação Oficial

Arquivo: [`src/lib/ia/provedor-openrouter.ts`](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/lib/ia/provedor-openrouter.ts)

### Itens Corretos ✅

| Item | Nosso Código | Documentação |
|---|---|---|
| URL do endpoint | `https://openrouter.ai/api/v1/chat/completions` | ✅ |
| Modelo | `meta-llama/llama-3.3-70b-instruct:free` | ✅ Variante gratuita válida |
| Autenticação | `Bearer ${chaveApi}` | ✅ |
| `HTTP-Referer` | `process.env.APP_URL ?? 'http://localhost:3000'` | ✅ Recomendado pela docs |
| `X-Title` | `'Game of Turing'` | ✅ Recomendado pela docs |
| Formato do body | `messages` com `role` + `content` | ✅ Compatível OpenAI |
| Roles usadas | `system` + `user` | ✅ |
| `max_tokens` | `200` | ✅ Parâmetro padrão no OpenRouter |
| `temperature` | `0.9` | ✅ Range 0-2 |
| `stream` | `false` | ✅ |
| Leitura da resposta | `choices[0].message.content` | ✅ |
| Tratamento de erro | `response.ok` + `response.text()` | ✅ |

### Inconsistências Encontradas

**Nenhuma.** ✅ A implementação está 100% correta e alinhada com a documentação oficial.

### Melhorias Opcionais (Futuro)

| Item | Descrição | Prioridade |
|---|---|---|
| Tipo da resposta | Adicionar `usage` para log de tokens consumidos | Baixa |
| Provider routing | Usar `provider.order` para preferir providers específicos | Baixa |
| Modelo pago | Migrar de `:free` para variante paga em produção (rate limits maiores) | Média |
| Fallback interno | Usar o fallback nativo do OpenRouter antes do nosso orquestrador | Baixa |

### Consideração Importante: Modelo `:free` em Produção

O modelo `meta-llama/llama-3.3-70b-instruct:free` tem rate limit de **50 RPD** (sem créditos) ou **1.000 RPD** (com ≥$10 em créditos). Para produção viral, será necessário:
1. Comprar créditos no OpenRouter (mínimo $10).
2. Considerar migrar para a variante paga (`meta-llama/llama-3.3-70b-instruct` sem `:free`).
3. O modelo pago tem rate limits do provider upstream, muito mais altos que o free tier.
