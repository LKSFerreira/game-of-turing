# Graph Report - .  (2026-05-19)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 243 nodes · 362 edges · 12 communities (11 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f82d6386`
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
- [[_COMMUNITY_Community 11|Community 11]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 46 edges
2. `ParticipantePartida` - 9 edges
3. `Partida` - 7 edges
4. `Game of Turing` - 7 edges
5. `GameRoom()` - 6 edges
6. `criarPartidaPoc()` - 6 edges
7. `validarCorpoRequisicao()` - 4 edges
8. `Button()` - 4 edges
9. `finalizarPartidaPorTempoVeredito()` - 4 edges
10. `obterProvedorIa()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `GameRoom()` --calls--> `calcularResultadoPartida()`  [INFERRED]
  app/game/[matchId]/page.tsx → domain/jogo/veredito.ts
- `Game of Turing` --implements--> `Supabase`  [INFERRED]
  PRD.md → README.md
- `domain/jogo/mmr.ts` --implements--> `PDR (Pontuação Visível)`  [EXTRACTED]
  domain/jogo/mmr.ts → PRD.md
- `domain/jogo/mmr.ts` --implements--> `MMR (Pontuação Oculta)`  [EXTRACTED]
  domain/jogo/mmr.ts → PRD.md
- `Walkthrough: Renomeação de Interlocutor para Jogador` --references--> `domain/jogo/tipos.ts`  [EXTRACTED]
  .metadocs/walkthrough/renomeacao_jogador.md → domain/jogo/tipos.ts

## Communities (12 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (42): geist, inter, jetbrainsMono, metadata, RootLayout(), cn(), Avatar(), AvatarBadge() (+34 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (44): calcularEstatisticasParticipante(), contarPalavras(), EstatisticasParticipante, analista, azul, partida, stats, vermelho (+36 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (17): CorpoRequisicaoIa, isCorJogador(), isMissaoSecreta(), POST(), validarCorpoRequisicao(), obterProvedorIa(), PROVEDORES_IA, escolherResposta() (+9 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (14): MODOS_LOBBY, PERFIL_LOCAL_POC, PreferenciaFila, PREFERENCIAS, REGRAS_CHAVE, ChatMessage, Match, MatchParticipant (+6 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (15): possuiCaracteresRepetidosEmSequencia(), analista, analistaAtualizado, azul, azulAtualizado, conteudo, partida, partidaAtualizada (+7 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (14): analista, azul, estatisticas, partida, partidaComMensagem, partidaFinalizada, resultado, vermelho (+6 more)

### Community 6 - "Community 6"
Cohesion: 0.15
Nodes (12): BotaoNatureza(), buscarParticipantePorCor(), CorVisual, ESTILOS_PARTICIPANTE, formatarTempo(), GameRoom(), obterDiretriz(), obterNatureza() (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (14): ADR 0001 - Gameplay Primeiro, ADR 0002 - IA Com Strategy Pattern, domain/jogo/mensagens.ts, domain/jogo/partida.ts, domain/jogo/tipos.ts, Analista, Game of Turing, Jogador (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.21
Nodes (9): criarPartidaTeste(), criarPartidaTeste(), criarPartidaTeste(), atualizarFasePorTempo(), avancarParaVeredito(), calcularSegundosRestantes(), criarPartidaPoc(), reiniciarPartida() (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (3): domain/jogo/mmr.ts, MMR (Pontuação Oculta), PDR (Pontuação Visível)

## Knowledge Gaps
- **88 isolated node(s):** `geist`, `inter`, `jetbrainsMono`, `metadata`, `PreferenciaFila` (+83 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ParticipantePartida` connect `Community 1` to `Community 8`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `Partida` connect `Community 1` to `Community 8`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `geist`, `inter`, `jetbrainsMono` to the rest of the system?**
  _90 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06578947368421052 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.058001397624039136 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._