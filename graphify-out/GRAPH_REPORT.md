# Graph Report - game-of-turing  (2026-05-19)

## Corpus Check
- 48 files · ~21,414 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 426 nodes · 831 edges · 22 communities (19 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d10f5ad4`
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
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 57 edges
2. `ParticipantePartida` - 22 edges
3. `Partida` - 18 edges
4. `Roadmap Robusto: Game of Turing` - 17 edges
5. `Game of Turing` - 13 edges
6. `Product Requirements Document (PRD): Game of Turing` - 11 edges
7. `GameRoom()` - 7 edges
8. `criarPartidaPoc()` - 7 edges
9. `obterProvedorIa()` - 7 edges
10. `Game of Turing` - 7 edges

## Surprising Connections (you probably didn't know these)
- `criarPartidaTeste()` --calls--> `criarPartidaPoc()`  [INFERRED]
  test/domain/jogo/estatisticas.test.ts → src/domain/jogo/partida.ts
- `criarPartidaTeste()` --calls--> `criarPartidaPoc()`  [INFERRED]
  test/domain/jogo/mensagens.test.ts → src/domain/jogo/partida.ts
- `criarPartidaTeste()` --calls--> `criarPartidaPoc()`  [INFERRED]
  test/domain/jogo/veredito.test.ts → src/domain/jogo/partida.ts
- `Game of Turing` --implements--> `Supabase`  [INFERRED]
  PRD.md → README.md
- `domain/jogo/mmr.ts` --implements--> `PDR (Pontuação Visível)`  [EXTRACTED]
  domain/jogo/mmr.ts → PRD.md

## Communities (22 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (46): geist, inter, jetbrainsMono, metadata, RootLayout(), cn(), Avatar(), AvatarBadge() (+38 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (45): calcularEstatisticasParticipante(), contarPalavras(), EstatisticasParticipante, calcularAjusteMmrAnalista(), calcularAjusteMmrJogador(), calcularAjustePdrAnalista(), calcularAjustePdrJogador(), calcularBonusParticipacao() (+37 more)

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (19): CorpoRequisicaoIa, isCorJogador(), isMissaoSecreta(), POST(), validarCorpoRequisicao(), obterProvedorIa(), PROVEDORES_IA, escolherResposta() (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (18): BotaoModo(), Home(), MODOS_LOBBY, PERFIL_LOCAL_POC, PortalPareamento(), PreferenciaFila, PREFERENCIAS, REGRAS_CHAVE (+10 more)

### Community 4 - "Community 4"
Cohesion: 0.20
Nodes (19): possuiCaracteresRepetidosEmSequencia(), registrarMensagem(), analista, analistaAtualizado, azul, azulAtualizado, buscarPorCor(), conteudo (+11 more)

### Community 5 - "Community 5"
Cohesion: 0.19
Nodes (12): analista, azul, buscarPorCor(), criarPartidaTeste(), partida, stats, vermelho, analista (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.23
Nodes (17): BotaoNatureza(), buscarParticipantePorCor(), CartaoParticipante(), CorJogador, CorVisual, ESTILOS_PARTICIPANTE, formatarTempo(), formatarTimestamp() (+9 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (14): ADR 0001 - Gameplay Primeiro, ADR 0002 - IA Com Strategy Pattern, domain/jogo/mensagens.ts, domain/jogo/partida.ts, domain/jogo/tipos.ts, Analista, Game of Turing, Jogador (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (43): 10. Comunicação em Tempo Real (Supabase Realtime), 1. Visão Geral do Produto, 2. Objetivos, 3.1. Papéis, Condições de Vitória e Composição da Mesa, 3.2. Dinâmica e Regras da Partida (O Jogo do Engano), 3.3. Sistema de Rank, PDR e MMR, 3. Regras de Negócio e Mecânicas Core, 4. Design e Experiência do Usuário (UI/UX) e Monetização (+35 more)

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (3): domain/jogo/mmr.ts, MMR (Pontuação Oculta), PDR (Pontuação Visível)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (24): Ambiente, Arquitetura, code:text (app/), code:bash (npm install), code:powershell (Copy-Item .env.example .env.local), code:bash (cp .env.example .env.local), code:env (AI_PROVIDER=fake), code:bash (npm run dev) (+16 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (17): Documentação Obrigatória, Estado Atual, M0 - Saneamento e Roadmap, M1 - PoC Jogável Sem Auth, M2 - Motor de Regras, M3 - MVP Local Completo, M4 - Autenticação e Perfis, M5 - Persistência e Banco (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.18
Nodes (10): 1. Domínio (`domain/jogo/`), 2. Testes Unitários (`domain/jogo/jogo.test.ts`), 3. APIs e Interfaces (`app/`), 4. Banco de Dados e Nomenclaturas em Inglês, 5. Documentação Geral, code:text (✓ domain/jogo/jogo.test.ts (10 tests) 16ms), Contexto da Demanda, Mudanças Realizadas (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.33
Nodes (5): ADR 0001 - Gameplay Primeiro, Consequências, Contexto, Decisão, Status

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (5): ADR 0002 - IA Com Strategy Pattern, Consequências, Contexto, Decisão, Status

### Community 18 - "Community 18"
Cohesion: 0.22
Nodes (8): 1. Roadmap (`.metadocs/roadmap.md`), 2. Testes Unitários (`domain/jogo/veredito.test.ts`), code:text (✓ lib/ia/provedor-fake.test.ts (6 tests) 8ms), code:text (Creating an optimized production build ...), Contexto da Demanda, Mudanças Realizadas, Validação Executada, Walkthrough: Correção de Inconsistências e Problemas

### Community 19 - "Community 19"
Cohesion: 0.33
Nodes (5): Entregas, Feature - PoC Local Jogável, Fora de Escopo, Objetivo, Validação

### Community 21 - "Community 21"
Cohesion: 0.16
Nodes (18): analista, azul, buscarPorCor(), criarPartidaTeste(), estatisticas, partida, partidaComMensagem, partidaFinalizada (+10 more)

### Community 22 - "Community 22"
Cohesion: 0.18
Nodes (10): 1. Movimentação de Pastas de Produção, 2. Isolamento de Suítes de Testes, 3. Ajuste de Configurações de Compilação e Aliases, 4. Refatoração de Imports nos Testes, 5. Ajuste Visual do Saguão (UI), code:json ("@/*": ["./src/*"]), Contexto da Demanda, Mudanças Realizadas (+2 more)

## Knowledge Gaps
- **106 isolated node(s):** `1. Visão Geral do Produto`, `2. Objetivos`, `O Analista (Sempre 1 por mesa):`, `Os Jogadores (Jogador Azul e Jogador Vermelho):`, `Mecânica do Chat e Gestão de Recursos:` (+101 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ParticipantePartida` connect `Community 1` to `Community 5`, `Community 4`, `Community 21`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `Partida` connect `Community 1` to `Community 5`, `Community 4`, `Community 21`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `1. Visão Geral do Produto`, `2. Objetivos`, `O Analista (Sempre 1 por mesa):` to the rest of the system?**
  _108 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07594381035996488 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Community 7` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `Community 8` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._