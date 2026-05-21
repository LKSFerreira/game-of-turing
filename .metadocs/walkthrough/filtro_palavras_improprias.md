# Walkthrough: Filtro de Palavras Impróprias

Este documento registra a implementação do filtro robusto de palavras impróprias para participantes humanos no **Game of Turing**, projetado para combater evasões de chat sem afetar palavras seguras.

## Contexto da Demanda

O chat do jogo aceitava qualquer palavra livremente. Para proteger o fluxo de jogo e evitar que termos vulgares cheguem às APIs das IAs que participam como jogadores (o que causa bloqueios de políticas de segurança de provedores como Azure/OpenAI), foi necessária a criação de um sistema de moderação robusto.

Os requisitos definidos foram:
1. **Detecção de Evasão (Leet Speak):** Bloquear palavras mascaradas com números ou caracteres especiais (ex: `p0rr4`, `v14d0`).
2. **Espaçamentos e Símbolos:** Detectar palavras separadas por espaços ou pontuações (ex: `p o r r a`, `f.o.d.a`).
3. **Repetições Excessivas:** Tratar repetições de caracteres (ex: `pooorrrraaa`).
4. **Prevenção de Falsos Positivos:** Impedir que termos legítimos contendo substrings proibidas sejam bloqueados (ex: `computador` contendo `puta`, ou `recuo` contendo `cu`).
5. **Restrição a Humanos:** O filtro deve ser executado apenas em mensagens enviadas por humanos (Analista e Jogadores Humanos), isentando as IAs de passarem pelo validador local de termos.

## Mudanças Realizadas

### 1. Constantes (`src/domain/jogo/constantes.ts`)
- **[constantes.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/domain/jogo/constantes.ts)**:
  - Adição e expansão massiva da lista `PALAVRAS_BLOQUEADAS`, englobando termos de baixo calão, variações de gênero, plurais, gírias anatômicas vulgares, siglas comuns da internet (como `fdp`, `pqp`, `vtnc`, `sfd`) e termos ofensivos em inglês.

### 2. Algoritmo de Validação (`src/domain/jogo/mensagens.ts`)
- **[mensagens.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/domain/jogo/mensagens.ts)**:
  - Criação da função `decodificarLeetSpeak`, que normaliza símbolos e números para letras (`4` -> `a`, `3` -> `e`, etc.). Para evitar que exclamações de fim de frase fossem substituídas por `i` (ex: transformando `v14d0!` em `viadoi`, que burlaria o limite de palavra), foi aplicado um lookahead positivo: `replace(/!(?=[a-z0-9])/gi, 'i')`.
  - Atualização da função `contemPalavraBloqueada` para criar expressões regulares dinâmicas para cada palavra bloqueada. A regex insere curingas de caracteres não alfanuméricos e espaços (`\s*[^a-z0-9]*\s*`) entre as letras e delimita as extremidades com `(?:^|[^a-z0-9])` para garantir que o termo seja uma palavra isolada na frase, impedindo falsos positivos.
  - Inclusão do filtro na função principal `validarMensagem` apenas sob a condição `participante.controle === 'humano'`.

### 3. Testes Unitários (`test/domain/jogo/mensagens.test.ts`)
- **[mensagens.test.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/test/domain/jogo/mensagens.test.ts)**:
  - Criação do bloco `validarMensagem — filtro de palavras impróprias para humanos`, cobrindo termos normais, variações de maiúsculas/minúsculas, acentuação, espaçamentos flexíveis, mistura de leet speak com pontuações, repetições excessivas, palavras legítimas seguras e verificação de isenção para bots (controle `ia`).

## Validação Executada

A suite completa de testes automatizados foi executada usando o Vitest com sucesso absoluto:

```text
 ✓ test/domain/jogo/partida.test.ts (20 tests) 25ms
 ✓ test/lib/ia/orquestrador.test.ts (10 tests) 44ms
 ✓ test/domain/jogo/veredito.test.ts (18 tests) 28ms
 ✓ test/domain/jogo/jogo.test.ts (11 tests) 66ms
 ✓ test/domain/jogo/mensagens.test.ts (25 tests) 107ms
 ✓ test/domain/jogo/estatisticas.test.ts (6 tests) 7ms
 ✓ test/lib/ia/provedor-ia.test.ts (7 tests) 5ms

 Test Files  9 passed (9)
      Tests  128 passed (128)
```
