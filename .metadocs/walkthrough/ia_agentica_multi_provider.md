# Walkthrough: M3.5 — IA Agêntica Multi-Provider

Este documento registra a implementação do sistema de IA multi-provider do **Game of Turing**, incluindo orquestrador com load balancing, circuit breaker, prompt engineering agêntico e integração com Groq, OpenRouter e Gemini.

## Contexto da Demanda

O projeto precisava evoluir de um provider único selecionado por variável de ambiente para um sistema resiliente que:
- Distribui carga entre múltiplos providers simultaneamente.
- Sobrevive a falhas individuais sem interromper partidas.
- Faz a IA jogar de verdade como jogador, com persona, blefe e missão secreta.
- Encerra graciosamente quando todos os providers falham, sem prejudicar o rank dos jogadores.

---

## Mudanças Realizadas

### 1. Tipos do Orquestrador

Criado [tipos-orquestrador.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/lib/ia/tipos-orquestrador.ts) com:
- `EstadoCircuitBreaker`: `fechado`, `aberto`, `meio_aberto`.
- `EstadoSaude`: rastreamento de falhas, latência e totais.
- `ConfiguracaoProvider`: nome, peso, tempo de recuperação e limite de erros.
- `RegistroProvider`: combina provider, configuração e saúde.
- `ErroIndisponibilidadeIa`: erro tipado lançado quando todos os providers falham.

### 2. Orquestrador Multi-Provider

Criado [orquestrador.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/lib/ia/orquestrador.ts) com:
- **Weighted Round-Robin**: seleção de provider baseada em pesos configuráveis.
- **Circuit Breaker**: fechado → aberto (após N falhas) → meio-aberto (após tempo de recuperação) → fechado (após sucesso).
- **Health Check Passivo**: rastreamento de latência média e taxa de erro sem requests extras.
- **Fallback Sequencial**: quando o provider selecionado falha, tenta os restantes em ordem de peso.
- **Falha Total**: lança `ErroIndisponibilidadeIa` quando nenhum provider está disponível.

### 3. Prompt Engineering Agêntico

Criado [prompt-agentico.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/lib/ia/prompt-agentico.ts) com:
- System prompt com regras do jogo, persona e restrições de comunicação.
- Instruções específicas por missão secreta (`convencer_humano` vs `convencer_ia`).
- Estratégias de blefe calibradas para naturalidade.
- Formatação de histórico multi-turno (últimas 20 mensagens).
- Separação em `montarPromptSistema()` e `montarPromptUsuario()` para compatibilidade com qualquer API.

### 4. Providers Reais

- [provedor-gemini.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/lib/ia/provedor-gemini.ts) — Gemini 2.5 Flash via SDK `@google/genai`, peso 5.
- [provedor-groq.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/lib/ia/provedor-groq.ts) — Llama 3.3 70B via fetch nativo, peso 3.
- [provedor-openrouter.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/lib/ia/provedor-openrouter.ts) — Llama 3.3 70B Instruct via fetch nativo, peso 2.

Todos respeitam a interface `ProvedorIa`, usam o módulo de prompt agêntico e truncam respostas que excedam o limite de caracteres.

### 5. Refatoração do Módulo de IA

Refatorado [index.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/lib/ia/index.ts):
- `obterOrquestrador()`: ponto de entrada principal, configura providers via `AI_PROVIDERS` e `AI_PROVIDER_WEIGHTS`.
- `obterProvedorIa()`: mantida para compatibilidade retroativa (testes e dev local).
- Mapa de providers registra todos os 4 providers (fake, groq, openrouter, gemini).
- Cache de instância do orquestrador para evitar recriação.

### 6. API Route

Refatorada [route.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/app/api/ai/route.ts):
- Usa `obterOrquestrador()` em vez de `obterProvedorIa()`.
- Trata `ErroIndisponibilidadeIa` com HTTP 503 e código `INDISPONIBILIDADE_IA`.

### 7. Documentação

- [ADR 0003](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/.metadocs/adr/0003-orquestrador-multi-provider.md) — Decisão arquitetural documentada.
- [roadmap.md](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/.metadocs/roadmap.md) — M3.5 adicionada com todas as entregas marcadas como concluídas.
- [README.md](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/README.md) — Tabela de variáveis de ambiente expandida.
- [.env.example](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/.env.example) — Novas variáveis documentadas.
- [historico.md](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/.metadocs/historico.md) — Entrada registrada.

---

## Validação Executada

1. **Testes Automatizados (Vitest):**
   Executado `npm run test` para validar o orquestrador, prompt agêntico e compatibilidade retroativa.
   - *Resultado:* **126 testes passaram com sucesso** em 10 suítes.

2. **Typecheck (TypeScript):**
   Executado `npx tsc --noEmit` para validar tipagem estática.
   - *Resultado:* **Zero erros de tipos.**

3. **Linter (ESLint):**
   Executado `npx eslint .` para validar qualidade de código.
   - *Resultado:* **Zero violações.**
