# Referência: Gemini API (Google AI)

> Fontes oficiais:
> - [Documentação Geral](https://ai.google.dev/gemini-api/docs)
> - [Modelos](https://ai.google.dev/gemini-api/docs/models)
> - [Pricing](https://ai.google.dev/gemini-api/docs/pricing)
> - [API Keys](https://ai.google.dev/gemini-api/docs/api-key)
> - [Libraries](https://ai.google.dev/gemini-api/docs/libraries)
> - [OpenAI Compatibility](https://ai.google.dev/gemini-api/docs/openai)
>
> Última atualização: 2026-05-20

---

## Índice

- [Visão Geral](#visão-geral)
- [Autenticação](#autenticação)
- [Planos, Preços e Free Tier](#planos-preços-e-free-tier)
- [Modelos](#modelos)
- [Rate Limits](#rate-limits)
- [SDK e Integração](#sdk-e-integração)
- [API REST Nativa](#api-rest-nativa)
- [Compatibilidade OpenAI](#compatibilidade-openai)
- [Segurança e Restrições de Chave](#segurança-e-restrições-de-chave)
- [Auditoria: Nosso Provider vs Documentação Oficial](#auditoria-nosso-provider-vs-documentação-oficial)

---

## Visão Geral

A Gemini API é a plataforma de IA generativa do Google, oferecendo acesso direto aos modelos Gemini. Diferente da Groq e do OpenRouter, a API tem **formato nativo próprio** (não OpenAI-compatible por padrão), mas oferece um **endpoint de compatibilidade OpenAI** e SDKs oficiais.

**Base URL (nativa):** `https://generativelanguage.googleapis.com/v1beta`
**Base URL (OpenAI-compat):** `https://generativelanguage.googleapis.com/v1beta/openai/`

**Formas de integração:**
- **SDK oficial `@google/genai`** (nosso approach — GA, recomendado pelo Google)
- REST API nativa (`/v1beta/models/{model}:generateContent`)
- Endpoint OpenAI-compatible (`/v1beta/openai/chat/completions`)
- SDK OpenAI apontando para a base URL Gemini

---

## Autenticação

### API Key

Obtida em [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).

A chave é passada de formas diferentes dependendo do método de acesso:

| Método | Como passar a chave |
|---|---|
| **SDK `@google/genai`** | `new GoogleGenAI({ apiKey })` — no construtor |
| **REST API Nativa** | Header `x-goog-api-key: $GEMINI_API_KEY` |
| **OpenAI-compatible** | Header `Authorization: Bearer $GEMINI_API_KEY` |

### Variáveis de ambiente

O SDK reconhece automaticamente:
- `GEMINI_API_KEY` — principal
- `GOOGLE_API_KEY` — alternativa (tem **precedência** se ambas existirem)

> **Segurança:** A `GEMINI_API_KEY` é server-side. Nunca usar `NEXT_PUBLIC_` nem expor ao client.

---

## Planos, Preços e Free Tier

### Planos Disponíveis

| Característica | Free (Gratuito) | Paid (Pago) | Enterprise |
|---|---|---|---|
| **Custo** | $0 | Pay-as-you-go (por token) | Custom |
| **Billing** | Não requer | Requer Cloud Billing | Contrato |
| **Rate Limits** | Limites base | Limites maiores (Tier 1-3) | Provisioned throughput |
| **Context Caching** | ❌ | ✅ | ✅ |
| **Batch API** | ❌ | ✅ (50% desconto) | ✅ |
| **Dados usados para treino** | **Sim** | **Não** | Não |

> **⚠️ ATENÇÃO:** No Free Tier, o Google **pode usar seus dados para melhorar os produtos**. Para produção com dados sensíveis, usar o Paid Tier.

### Preços — Gemini 2.5 Flash (nosso modelo)

| Tier | Input $/1M | Output $/1M |
|---|---|---|
| **Free** | $0 | $0 |
| Standard (Paid) | ~$0.15 | ~$3.50 |
| Batch (Paid) | ~$0.075 | ~$1.75 |

### Preços — Gemini 3.5 Flash (modelo mais recente)

| Tier | Input $/1M | Output $/1M |
|---|---|---|
| **Free** | $0 | $0 |
| Standard (Paid) | $1.50 | $9.00 |
| Batch (Paid) | $0.75 | $4.50 |
| Flex (Paid) | $0.75 | $4.50 |
| Priority (Paid) | $2.70 | $16.20 |
| Context Caching | $0.15 | — |

### Preços — Gemini 3.1 Flash-Lite (mais barato)

| Tier | Input $/1M | Output $/1M |
|---|---|---|
| **Free** | $0 | $0 |
| Standard (Paid) | $0.25 | $1.50 |
| Batch (Paid) | $0.125 | $0.75 |

### Links para Consulta Direta

- 🔗 **Suas API Keys:** [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- 🔗 **Pricing oficial:** [ai.google.dev/gemini-api/docs/pricing](https://ai.google.dev/gemini-api/docs/pricing)
- 🔗 **Google AI Studio:** [aistudio.google.com](https://aistudio.google.com)
- 🔗 **Status:** [aistudio.google.com/status](https://aistudio.google.com/status)

---

## Modelos

### Modelos de Produção

| Model ID | Geração | Context Window | Max Output | Velocidade | Status |
|---|---|---|---|---|---|
| **`gemini-2.5-flash`** | 2.5 | 1M tokens | ~65K | Rápido | ✅ GA (nosso modelo) |
| `gemini-3.5-flash` | 3.5 | 1M tokens | 65,536 | **4x mais rápido** | ✅ GA (maio 2026) |
| `gemini-3.1-flash-lite` | 3.1 | Grande | ~8K | Muito rápido | ✅ GA |
| `gemini-3.1-pro-preview` | 3.1 | Grande | ~8K | Mais lento | Preview |

### Hierarquia de Modelos

| Classe | Modelo | Uso |
|---|---|---|
| **Mais inteligente** | Gemini 3.1 Pro | Raciocínio complexo, multimodal avançado |
| **Melhor custo-benefício** | Gemini 3.5 Flash | Agentic workflows, coding, raciocínio |
| **Mais barato** | Gemini 3.1 Flash-Lite | Alto volume, tradução, processamento simples |
| **Legado (nosso)** | Gemini 2.5 Flash | General purpose, velocidade |

### Capacidades Especiais (não usadas no Game of Turing)

- Geração de imagens (Nano Banana)
- Geração de vídeo (Veo 3.1)
- Transcrição de áudio
- Long Context (1M tokens)
- Google Search grounding
- Code Execution
- Live API (voice agents)

> **Nosso modelo:** `gemini-2.5-flash` — estável e gratuito. Considerar migração para `gemini-3.5-flash` no futuro (4x mais rápido, mesmos rate limits).

---

## Rate Limits

Rate limits se aplicam no nível do **Google Cloud Project** (não por API key).

### Free Tier

| Modelo | RPM | RPD | TPM |
|---|---|---|---|
| **`gemini-2.5-flash`** | 10-15 | 1.500 | 1.000.000 |
| `gemini-3.5-flash` | ~10-15 | ~1.500 | 1.000.000 |
| `gemini-2.5-pro` | 5 | 50-100 | 250.000 |
| `gemini-3.1-flash-lite` | ~15 | ~1.500 | 1.000.000 |

> **Comparação com outros providers (Free Tier):**
>
> | Provider | RPM | RPD |
> |---|---|---|
> | **Gemini** | **10-15** | **1.500** |
> | Groq | 30 | 1.000 |
> | OpenRouter | ~20 | 50 (sem créditos) |
>
> **Gemini tem o maior RPD gratuito (1.500)**, mas o menor RPM (10-15). Groq tem o melhor RPM (30). OpenRouter tem o pior RPD sem pagar (50).

### Paid Tier (Tier 1 — com billing)

Com billing ativado, os limites aumentam significativamente (150-300 RPM estimado).

### Tratamento de Erros

Quando excede o rate limit, retorna `429: Too Many Requests` com corpo `RESOURCE_EXHAUSTED`.

---

## SDK e Integração

### SDK Oficial: `@google/genai` (nosso approach)

```typescript
import { GoogleGenAI } from '@google/genai';

const cliente = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const resposta = await cliente.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: 'Explique como IA funciona',
  config: {
    systemInstruction: 'Você é um assistente útil.',
    maxOutputTokens: 200,
    temperature: 0.9,
  },
});

console.log(resposta.text);
```

**Parâmetros do `config`:**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `systemInstruction` | `string` | Prompt de sistema (separado do conteúdo) |
| `maxOutputTokens` | `number` | Máximo de tokens na resposta |
| `temperature` | `number` | Aleatoriedade (0-2) |
| `topP` | `number` | Nucleus sampling (0-1) |
| `topK` | `number` | Top-K sampling |
| `stopSequences` | `string[]` | Sequências de parada |
| `responseMimeType` | `string` | `application/json` para forçar JSON |
| `responseSchema` | `object` | Schema JSON (structured output) |

**Campos da resposta:**

| Campo | Descrição |
|---|---|
| `resposta.text` | Texto gerado (getter direto) |
| `resposta.candidates[0].content.parts[0].text` | Acesso manual ao texto |
| `resposta.usageMetadata.promptTokenCount` | Tokens do prompt |
| `resposta.usageMetadata.candidatesTokenCount` | Tokens gerados |
| `resposta.usageMetadata.totalTokenCount` | Total |

### Instalação

```bash
npm install @google/genai
```

> **Importante:** O SDK `@google/genai` é a biblioteca **GA** (General Availability). A biblioteca anterior `@google/generative-ai` está **deprecated** (legacy). Nosso código já usa a biblioteca correta.

---

## API REST Nativa

Formato proprietário do Google (diferente do OpenAI):

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          { "text": "Explique como IA funciona" }
        ]
      }
    ]
  }'
```

### Diferenças do formato nativo vs OpenAI

| Aspecto | Gemini Nativo | OpenAI / Groq / OpenRouter |
|---|---|---|
| Endpoint | `/models/{model}:generateContent` | `/chat/completions` |
| Autenticação | `x-goog-api-key` header | `Authorization: Bearer` |
| Mensagens | `contents[].parts[].text` | `messages[].content` |
| System prompt | `systemInstruction` (separado) | `role: "system"` (inline) |
| Max tokens | `generationConfig.maxOutputTokens` | `max_tokens` / `max_completion_tokens` |
| Resposta | `candidates[0].content.parts[0].text` | `choices[0].message.content` |

---

## Compatibilidade OpenAI

O Google oferece um **endpoint compatível com OpenAI** para facilitar migrações:

**Base URL:** `https://generativelanguage.googleapis.com/v1beta/openai/`

```bash
curl https://generativelanguage.googleapis.com/v1beta/openai/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $GEMINI_API_KEY" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      { "role": "system", "content": "Você é um assistente." },
      { "role": "user", "content": "Olá!" }
    ],
    "max_tokens": 200,
    "temperature": 0.9
  }'
```

Ou via SDK OpenAI:

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

const completion = await client.chat.completions.create({
  model: 'gemini-2.5-flash',
  messages: [
    { role: 'system', content: 'Você é um assistente.' },
    { role: 'user', content: 'Olá!' },
  ],
});
```

> **Nota:** Nosso provider usa o **SDK oficial `@google/genai`** em vez do endpoint OpenAI-compatible. Isso nos dá acesso a features nativas como `systemInstruction` e `config` dedicados.

---

## Segurança e Restrições de Chave

### Regras de segurança

- ❌ Nunca commitar API keys no source control
- ❌ Nunca expor no client-side (exceto ephemeral tokens para Live API)
- ✅ Restringir chave à Generative Language API apenas
- ✅ Auditar e rotacionar chaves periodicamente

### Mudança importante: Chaves não restritas

> **⚠️ A partir de 19 de junho de 2026**, a Gemini API **descontinuará suporte a chaves de tráfego não restritas**. Chaves devem ser restritas à "Gemini API only" em [aistudio.google.com/api-keys](https://aistudio.google.com/api-keys).

Ação necessária:
1. Acessar [aistudio.google.com/api-keys](https://aistudio.google.com/api-keys)
2. Clicar em **"Restrict to Gemini API"** para cada chave
3. Ou restringir via [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

---

## Auditoria: Nosso Provider vs Documentação Oficial

Arquivo: [`src/lib/ia/provedor-gemini.ts`](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/lib/ia/provedor-gemini.ts)

### Itens Corretos ✅

| Item | Nosso Código | Documentação |
|---|---|---|
| SDK | `@google/genai` (GoogleGenAI) | ✅ Biblioteca GA oficial |
| Instanciação | `new GoogleGenAI({ apiKey })` | ✅ |
| Variável de ambiente | `GEMINI_API_KEY` | ✅ Reconhecida pelo SDK |
| Modelo | `gemini-2.5-flash` | ✅ GA, estável |
| Método | `cliente.models.generateContent()` | ✅ API atual |
| Input | `contents: promptUsuario` | ✅ Aceita string |
| System prompt | `config.systemInstruction` | ✅ Forma nativa |
| Max tokens | `config.maxOutputTokens: 200` | ✅ Parâmetro correto |
| Temperature | `config.temperature: 0.9` | ✅ Range 0-2 |
| Leitura da resposta | `resposta.text` | ✅ Getter do SDK |
| Tratamento de vazio | Verifica `textoGerado` vazio | ✅ |

### Inconsistências Encontradas

**Nenhuma.** ✅ A implementação está 100% correta e alinhada com a documentação oficial e o SDK GA.

### Melhorias Opcionais (Futuro)

| Item | Descrição | Prioridade |
|---|---|---|
| Migrar para `gemini-3.5-flash` | 4x mais rápido, mesma interface de SDK | Média |
| Logging de usage | Ler `usageMetadata` para métricas | Baixa |
| Restringir API key | Antes de 19/06/2026 — obrigatório! | **Alta** |
| Safety settings | Configurar `safetySettings` para evitar bloqueios | Baixa |

### Consideração: Free Tier em Produção

O Gemini Free Tier tem **1.500 RPD** e **10-15 RPM**. Limitações:
- **10-15 RPM** é restritivo para picos de tráfego. Mas como é o 3º provider (fallback), raramente será chamado.
- **1.500 RPD** é o mais generoso dos três providers no Free Tier.
- **Dados usados para treino** — no Free Tier, o Google pode usar inputs/outputs para melhorar produtos. Para produção, avaliar Paid Tier.
