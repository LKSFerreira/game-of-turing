# Graph Report - game-of-turing  (2026-05-19)

## Corpus Check
- 11 files · ~8,321 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 388 nodes · 532 edges · 24 communities (22 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8abc6bce`
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 46 edges
2. `Roadmap Robusto: Game of Turing` - 17 edges
3. `Game of Turing` - 13 edges
4. `Product Requirements Document (PRD): Game of Turing` - 11 edges
5. `ParticipantePartida` - 11 edges
6. `Partida` - 9 edges
7. `Game of Turing` - 7 edges
8. `Mudanças Realizadas` - 6 edges
9. `GameRoom()` - 6 edges
10. `criarPartidaPoc()` - 6 edges

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

## Communities (24 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (42): geist, inter, jetbrainsMono, metadata, RootLayout(), cn(), Avatar(), AvatarBadge() (+34 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (42): calcularEstatisticasParticipante(), contarPalavras(), EstatisticasParticipante, calcularAjusteMmrAnalista(), calcularAjusteMmrJogador(), calcularAjustePdrAnalista(), calcularAjustePdrJogador(), calcularBonusParticipacao() (+34 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (17): CorpoRequisicaoIa, isCorJogador(), isMissaoSecreta(), POST(), validarCorpoRequisicao(), obterProvedorIa(), PROVEDORES_IA, escolherResposta() (+9 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (14): MODOS_LOBBY, PERFIL_LOCAL_POC, PreferenciaFila, PREFERENCIAS, REGRAS_CHAVE, ChatMessage, Match, MatchParticipant (+6 more)

### Community 4 - "Community 4"
Cohesion: 0.16
Nodes (19): possuiCaracteresRepetidosEmSequencia(), analista, analistaAtualizado, azul, azulAtualizado, buscarPorCor(), conteudo, criarPartidaTeste() (+11 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (13): analista, azul, criarPartidaTeste(), partida, stats, vermelho, criarPartidaTeste(), atualizarFasePorTempo() (+5 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (13): BotaoNatureza(), buscarParticipantePorCor(), CorJogador, CorVisual, ESTILOS_PARTICIPANTE, formatarTempo(), GameRoom(), obterDiretriz() (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (14): ADR 0001 - Gameplay Primeiro, ADR 0002 - IA Com Strategy Pattern, domain/jogo/mensagens.ts, domain/jogo/partida.ts, domain/jogo/tipos.ts, Analista, Game of Turing, Jogador (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (29): 10. Comunicação em Tempo Real (Supabase Realtime), 1. Visão Geral do Produto, 2. Objetivos, 4. Design e Experiência do Usuário (UI/UX) e Monetização, 5.1. Front-end (Cliente), 5.2. Back-end e Infraestrutura (Serverless/BaaS), 5.3. Integração com IA (Arquitetura Flexível), 5. Requisitos Funcionais e Técnicos (Escopo Inicial) (+21 more)

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (3): domain/jogo/mmr.ts, MMR (Pontuação Oculta), PDR (Pontuação Visível)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (24): Ambiente, Arquitetura, code:text (app/), code:bash (npm install), code:powershell (Copy-Item .env.example .env.local), code:bash (cp .env.example .env.local), code:env (AI_PROVIDER=fake), code:bash (npm run dev) (+16 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (17): Documentação Obrigatória, Estado Atual, M0 - Saneamento e Roadmap, M1 - PoC Jogável Sem Auth, M2 - Motor de Regras, M3 - MVP Local Completo, M4 - Autenticação e Perfis, M5 - Persistência e Banco (+9 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (14): 3.1. Papéis, Condições de Vitória e Composição da Mesa, 3.2. Dinâmica e Regras da Partida (O Jogo do Engano), 3.3. Sistema de Rank, PDR e MMR, 3. Regras de Negócio e Mecânicas Core, A Grande Revelação (Tela Final):, Fim do Tempo (Fase de Veredito - 15 Segundos):, Início da Partida (Timer de 3 Minutos):, Limitações Anti-Spam e Anti-Bot (Crucial): (+6 more)

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
Cohesion: 0.18
Nodes (9): analista, azul, estatisticas, partida, partidaComMensagem, partidaFinalizada, resultado, vermelho (+1 more)

### Community 22 - "Community 22"
Cohesion: 0.20
Nodes (9): 1. Movimentação de Pastas de Produção, 2. Isolamento de Suítes de Testes, 3. Ajuste de Configurações de Compilação e Aliases, 4. Refatoração de Imports nos Testes, code:json ("@/*": ["./src/*"]), Contexto da Demanda, Mudanças Realizadas, Validação Executada (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (5): analista, cores, original, partida, reiniciada

## Knowledge Gaps
- **166 isolated node(s):** `1. Visão Geral do Produto`, `2. Objetivos`, `O Analista (Sempre 1 por mesa):`, `Os Jogadores (Jogador Azul e Jogador Vermelho):`, `Mecânica do Chat e Gestão de Recursos:` (+161 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ParticipantePartida` connect `Community 1` to `Community 21`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Product Requirements Document (PRD): Game of Turing` connect `Community 8` to `Community 14`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `1. Visão Geral do Produto`, `2. Objetivos`, `O Analista (Sempre 1 por mesa):` to the rest of the system?**
  _168 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06578947368421052 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07215686274509804 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._