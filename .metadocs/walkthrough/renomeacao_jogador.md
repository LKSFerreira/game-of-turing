# Walkthrough: Renomeação de Interlocutor para Jogador

Este documento registra a refatoração global realizada no repositório **Game of Turing** para substituir o termo "Interlocutor" por "Jogador" na lógica de domínio, testes, APIs, componentes de interface, esquema do banco de dados e documentações do projeto.

## Contexto da Demanda

O termo **"Interlocutor"** (originalmente utilizado para os participantes da partida que conversam com o Analista) foi considerado menos natural e intuitivo do que **"Jogador"** na experiência de usuário final de um jogo de dedução social em português brasileiro. A alteração consolida a linguagem do projeto e alinha o código às melhores práticas de clareza e nomenclatura expressiva.

## Mudanças Realizadas

A substituição foi executada em todas as camadas da aplicação, com o cuidado técnico de preservar os tipos técnicos de banco de dados em inglês (consolidando para `player` em vez de `interlocutor`).

### 1. Domínio (`domain/jogo/`)
- **[tipos.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/domain/jogo/tipos.ts)**: Alterada a definição de `PapelParticipante` de `'analista' | 'interlocutor'` para `'analista' | 'jogador'`. A propriedade `orcamentoCaracteresInterlocutor` da interface `Partida` foi renomeada para `orcamentoCaracteresJogador`.
- **[constantes.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/domain/jogo/constantes.ts)**: Renomeada a constante global `ORCAMENTO_PADRAO_INTERLOCUTOR` para `ORCAMENTO_PADRAO_JOGADOR`.
- **[partida.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/domain/jogo/partida.ts)**: Atualizada a criação de partidas da PoC para inicializar os participantes Azul e Vermelho com a role `'jogador'` e mapear o orçamento de caracteres.
- **[mensagens.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/domain/jogo/mensagens.ts) e [estatisticas.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/domain/jogo/estatisticas.ts)**: Atualizadas as verificações de papel de participante para `'jogador'` e o uso de seu respectivo orçamento de caracteres.
- **[mmr.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/domain/jogo/mmr.ts) e [veredito.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/domain/jogo/veredito.ts)**: Renomeadas as funções matemáticas de ajuste de pontuação para `calcularAjustePdrJogador` e `calcularAjusteMmrJogador`.

### 2. Testes Unitários (`domain/jogo/jogo.test.ts`)
- Atualizadas todas as descrições de testes de "interlocutor" para "jogador".
- Refatoradas as funções mock de partida e as validações de expect para utilizar a nova tipagem, constantes e funções do domínio.

### 3. APIs e Interfaces (`app/`)
- **[app/api/ai/route.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/app/api/ai/route.ts)**: Renomeada a validação interna `isCorInterlocutor` para `isCorJogador` e atualizada a mensagem de erro da API.
- **[app/page.tsx](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/app/page.tsx)**: Alteradas as labels de UI de "Preferir Interlocutor" para "Preferir Jogador" no saguão (matchmaking) e o bloco de pontuação "PDR Interlocutor" para "PDR Jogador".
- **[app/game/[matchId]/page.tsx](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/app/game/[matchId]/page.tsx)**: Renomeados estados React (`interlocutoresPensando` -> `jogadoresPensando`), helpers (`isCorInterlocutor` -> `isCorJogador`), links internos e todos os textos visíveis no chat ("Faça perguntas aos jogadores...", "...natureza real dos jogadores.", "Resultado do jogador:").

### 4. Banco de Dados e Nomenclaturas em Inglês
- **[types/game.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/types/game.ts)**: Substituída a definição técnica da role de banco `PlayerRole` de `'analyst' | 'interlocutor'` para `'analyst' | 'player'`, padronizando com o uso de `player` nas colunas de MMR e PDR do repositório.
- **[database_schema.sql](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/database_schema.sql)**: Atualizada a constraint check na tabela `match_participants` (`role check (role in ('analyst', 'player'))`) para refletir a terminologia limpa.

### 5. Documentação Geral
- **[README.md](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/README.md)**: Substituídas as menções a interlocutores pelos papéis e orçamentos corretos de jogadores.
- **[PRD.md](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/PRD.md)**: Atualizados os requisitos de produto, seções de ranking, orçamento de palavras, anti-spam e especificações de banco de dados para a terminologia de "Jogador/Player".

## Validação Executada

1. **Testes Unitários**:
   A suíte de testes unitários foi executada com o Vitest no Windows (`npx.cmd vitest run`) e todos os 10 testes passaram com sucesso absoluto e tempo de execução reduzido:
   ```text
   ✓ domain/jogo/jogo.test.ts (10 tests) 16ms
   Test Files  1 passed (1)
        Tests  10 passed (10)
   ```
2. **Compilação TypeScript**:
   O typecheck global (`npm run typecheck` executando `tsc --noEmit`) foi finalizado sem nenhum erro ou aviso de tipo, confirmando a consistência dos contratos no frontend, APIs e lógica pura de negócio.
