# Graph Report - game-of-turing  (2026-05-21)

## Corpus Check
- 67 files · ~38,141 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 705 nodes · 1181 edges · 31 communities (27 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f7589400`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 35|Community 35]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 57 edges
2. `ParticipantePartida` - 22 edges
3. `Partida` - 18 edges
4. `Roadmap Robusto: Game of Turing` - 18 edges
5. `SolicitarRespostaIaParametros` - 13 edges
6. `Game of Turing` - 13 edges
7. `Referência: Groq API` - 13 edges
8. `ProvedorIa` - 12 edges
9. `Referência: Gemini API (Google AI)` - 12 edges
10. `Referência: OpenRouter API` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Verdict Logic` --implements--> `PDR (Pontuação Visível)`  [INFERRED]
  src/domain/jogo/veredito.ts → PRD.md
- `Verdict Logic` --implements--> `MMR (Pontuação Oculta)`  [INFERRED]
  src/domain/jogo/veredito.ts → PRD.md
- `Project Architecture` --references--> `domain/jogo/tipos.ts`  [EXTRACTED]
  README.md → domain/jogo/tipos.ts
- `Renaming Interlocutor to Player` --references--> `domain/jogo/tipos.ts`  [EXTRACTED]
  .metadocs/walkthrough/renomeacao_jogador.md → domain/jogo/tipos.ts
- `AI Strategy Implementation` --implements--> `ADR 0002 - IA Com Strategy Pattern`  [EXTRACTED]
  src/lib/ia/provedor-ia.ts → .metadocs/adr/0002-ia-com-strategy-pattern.md

## Communities (31 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (46): geist, inter, jetbrainsMono, metadata, RootLayout(), cn(), Avatar(), AvatarBadge() (+38 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (52): calcularEstatisticasParticipante(), contarPalavras(), EstatisticasParticipante, analista, azul, buscarPorCor(), criarPartidaTeste(), partida (+44 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (46): 10. Comunicação em Tempo Real (Supabase Realtime), 1. Visão Geral do Produto, 2. Objetivos, 3.1. Papéis, Condições de Vitória e Composição da Mesa, 3.2. Dinâmica e Regras da Partida (O Jogo do Engano), 3.3. Sistema de Rank, PDR e MMR, 3. Regras de Negócio e Mecânicas Core, 4. Design e Experiência do Usuário (UI/UX) e Monetização (+38 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (56): MAPA_PROVIDERS, obterOrquestrador(), parseProvidersAtivos(), PESOS_PADRAO, PROVEDORES_IA, criarEstadoSaudeInicial(), criarOrquestrador(), criarRegistroProvider() (+48 more)

### Community 4 - "Community 4"
Cohesion: 0.14
Nodes (27): PALAVRAS_BLOQUEADAS, partidaComMensagem, contemPalavraBloqueada(), decodificarLeetSpeak(), possuiCaracteresRepetidosEmSequencia(), registrarMensagem(), analista, analistaAtualizado (+19 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (24): Ambiente, Arquitetura, code:text (src/), code:bash (npm install), code:powershell (Copy-Item .env.example .env.local), code:bash (cp .env.example .env.local), code:env (AI_PROVIDER=fake), code:bash (npm run dev) (+16 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (23): ADR 0001 - Gameplay Primeiro, ADR 0001: Gameplay First, ADR 0001 - Gameplay Primeiro, Consequências, Contexto, Decisão, Status, ADR 0002 - IA Com Strategy Pattern (+15 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (21): BotaoModo(), Home(), MODOS_LOBBY, PERFIL_LOCAL_POC, PortalPareamento(), PreferenciaFila, PREFERENCIAS, REGRAS_CHAVE (+13 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (24): CorpoRequisicaoIa, isCorJogador(), isMissaoSecreta(), POST(), validarCorpoRequisicao(), obterProvedorIa(), provedor, BotaoNatureza() (+16 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (18): Documentação Obrigatória, Estado Atual, M0 - Saneamento e Roadmap, M1 - PoC Jogável Sem Auth, M2 - Motor de Regras, M3.5 - IA Agêntica Multi-Provider, M3 - MVP Local Completo, M4 - Autenticação e Perfis (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (17): domain/jogo/mensagens.ts, domain/jogo/partida.ts, domain/jogo/tipos.ts, Project Architecture, Directory Restructuring (src/ and test/), Walkthrough: Renomeação de Interlocutor para Jogador, Renaming Interlocutor to Player, 1. Domínio (`domain/jogo/`) (+9 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (20): 1. Visão Geral e Autenticação, 2. Modelos Suportados (Destaques), 3. Exemplo de Uso (cURL / Fetch), 4. Limites de Taxa (Rate Limits) do "Free Tier", 5. Implementação no Projeto (Game of Turing), 6. Documentação Completa (Referência Oficial), Avaliar a saída do modelo, code:bash (curl -L \) (+12 more)

### Community 12 - "Community 12"
Cohesion: 0.04
Nodes (44): Auditoria: Nosso Provider vs Documentação Oficial, Autenticação e Headers, Catálogo, Chat Completions, code:http (Authorization: Bearer $OPENROUTER_API_KEY), code:block2 (POST https://openrouter.ai/api/v1/chat/completions), code:json ({), code:bash (curl https://openrouter.ai/api/v1/chat/completions \) (+36 more)

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (10): 1. Movimentação de Pastas de Produção, 2. Isolamento de Suítes de Testes, 3. Ajuste de Configurações de Compilação e Aliases, 4. Refatoração de Imports nos Testes, 5. Ajuste Visual do Saguão (UI), code:json ("@/*": ["./src/*"]), Contexto da Demanda, Mudanças Realizadas (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.22
Nodes (8): 1. Roadmap (`.metadocs/roadmap.md`), 2. Testes Unitários (`domain/jogo/veredito.test.ts`), code:text (✓ lib/ia/provedor-fake.test.ts (6 tests) 8ms), code:text (Creating an optimized production build ...), Contexto da Demanda, Mudanças Realizadas, Validação Executada, Walkthrough: Correção de Inconsistências e Problemas

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (5): Entregas, Feature - PoC Local Jogável, Fora de Escopo, Objetivo, Validação

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (4): domain/jogo/mmr.ts, Verdict Logic, MMR (Pontuação Oculta), PDR (Pontuação Visível)

### Community 21 - "Community 21"
Cohesion: 0.05
Nodes (42): Audio, Auditoria: Nosso Provider vs Documentação Oficial, Autenticação, Batch API, Batches e Flex Processing, Chat Completions, code:http (Authorization: Bearer $GROQ_API_KEY), code:block2 (POST https://api.groq.com/openai/v1/chat/completions) (+34 more)

### Community 22 - "Community 22"
Cohesion: 0.05
Nodes (39): API Key, API REST Nativa, Auditoria: Nosso Provider vs Documentação Oficial, Autenticação, Capacidades Especiais (não usadas no Game of Turing), code:typescript (import { GoogleGenAI } from '@google/genai';), code:bash (npm install @google/genai), code:bash (curl "https://generativelanguage.googleapis.com/v1beta/model) (+31 more)

### Community 23 - "Community 23"
Cohesion: 0.17
Nodes (11): 1. Tipos do Orquestrador, 2. Orquestrador Multi-Provider, 3. Prompt Engineering Agêntico, 4. Providers Reais, 5. Refatoração do Módulo de IA, 6. API Route, 7. Documentação, Contexto da Demanda (+3 more)

### Community 24 - "Community 24"
Cohesion: 0.33
Nodes (5): ADR 0003 - Orquestrador Multi-Provider de IA, Consequências, Contexto, Decisão, Status

### Community 26 - "Community 26"
Cohesion: 0.15
Nodes (18): analista, azul, buscarPorCor(), criarPartidaTeste(), estatisticas, partida, partidaBase, partidaFinalizada (+10 more)

### Community 31 - "Community 31"
Cohesion: 0.17
Nodes (11): 1. Observabilidade: Centralização de Logs no Backend, 2. Correção do Bug do Veredito por Tempo Esgotado, 3. Calibração de Tempos de IA & Resolução de Closures, 4. Resolução de Avisos do Linter (ESLint), code:text (> game-of-turing@0.1.0 typecheck), code:text (> game-of-turing@0.1.0 lint), code:text (Re-extracting code files in . (no LLM needed)...), Contexto da Demanda (+3 more)

### Community 32 - "Community 32"
Cohesion: 0.22
Nodes (8): 1. Constantes (`src/domain/jogo/constantes.ts`), 2. Algoritmo de Validação (`src/domain/jogo/mensagens.ts`), 3. Testes Unitários (`test/domain/jogo/mensagens.test.ts`), code:text (✓ test/domain/jogo/partida.test.ts (20 tests) 25ms), Contexto da Demanda, Mudanças Realizadas, Validação Executada, Walkthrough: Filtro de Palavras Impróprias

### Community 35 - "Community 35"
Cohesion: 0.39
Nodes (6): analista, cores, original, partida, partidaBase, reiniciada

## Knowledge Gaps
- **267 isolated node(s):** `CorJogador`, `CriarPartidaPocParametros`, `MAPA_PROVIDERS`, `PESOS_PADRAO`, `TRADUCOES_CB` (+262 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ParticipantePartida` connect `Community 1` to `Community 26`, `Community 4`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `Game of Turing` connect `Community 6` to `Community 7`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `CorJogador`, `CriarPartidaPocParametros`, `MAPA_PROVIDERS` to the rest of the system?**
  _269 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07594381035996488 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08560140474100088 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.051189400782896716 - nodes in this community are weakly interconnected._