# Walkthrough: Calibração de Tempos da IA, Bug do Veredito e Observabilidade no Backend

Este documento registra as melhorias de calibragem de reação das IAs, a correção do bug do cronômetro de veredito e a introdução de um sistema de logs estruturado no backend para o **Game of Turing**.

## Contexto da Demanda

1. **Calibração de Reação das IAs**: As respostas das IAs pareciam instantâneas e artificiais no chat, impulsionadas por loops assíncronos no monitor de inatividade. O `setInterval` sofria com closures obsoletos do React, fazendo com que o chat identificasse inatividades fictícias e ativasse bots indesejados simultaneamente.
2. **Bug do Veredito por Tempo Esgotado**: Quando o tempo do veredito de 60 segundos se esgotava, o sistema ignorava as seleções de identidades que o Analista já tinha selecionado na tela de veredito e aplicava uma derrota cega (errando as duas entidades).
3. **Observabilidade das Partidas no Backend**: Como a PoC roda inteiramente no lado do cliente, o terminal do desenvolvedor Next.js ficava cego sobre as transições de estado do jogo, como início da partida, envio de mensagens de IA/humano, vereditos e MMR.

## Mudanças Realizadas

### 1. Observabilidade: Centralização de Logs no Backend
- **[route.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/app/api/match/event/route.ts)**: Criada uma nova rota POST para escutar eventos de domínio e logar com cores ANSI no console do terminal:
  - `PARTIDA_INICIADA` (Magenta): Identifica início ou reset do jogo.
  - `MENSAGEM_REGISTRADA`: Diferencia o remetente com cores (Amarelo para `analista`, Ciano para `azul`, Vermelho para `vermelho`).
  - `FASE_VEREDITO`: Avisa quando o jogo entra na classificação.
  - `VEREDITO_SUBMETIDO`: Mostra a escolha final ou o estado no momento do estouro de tempo.
  - `PARTIDA_FINALIZADA` (Verde para vitória, Vermelho para derrota): Lista tabela de MMR e PDR individuais dos participantes e do Analista.

- **[page.tsx](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/app/game/[matchId]/page.tsx)**:
  - Criada a função reativa `enviarEventoBackend(tipoEvento, detalhes)` envolvida em um `useCallback` do React.
  - Disparados os eventos apropriados em todas as transições de estado críticas da partida.

### 2. Correção do Bug do Veredito por Tempo Esgotado
- **[page.tsx](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/app/game/[matchId]/page.tsx)**:
  - Adicionadas referências mutáveis `vereditoAzulRef` e `vereditoVermelhoRef` para rastrear as escolhas na interface gráfica sem perturbar e reiniciar o temporizador.
  - Modificado o cronômetro do veredito (`useEffect`) para consolidar as respostas do usuário no momento do estouro do tempo, aplicando a natureza oposta da real (erro punitivo) apenas no participante que ficou em branco.

### 3. Calibração de Tempos de IA & Resolução de Closures
- **[page.tsx](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/app/game/[matchId]/page.tsx)**:
  - Criadas referências mutáveis para a partida (`partidaRef`) e jogadores pensando (`jogadoresPensandoRef`) para ler dados atualizados a partir do timer de inatividade, blindando a lógica contra closures antigos do React.
  - Extraídas todas as constantes de tempo, velocidade e comportamento reativo para centralização e fácil customização.

- **[constantes.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src/lib/ia/constantes.ts)**:
  - Centralizadas as novas variáveis de simulação comportamental das IAs:
    - `CARACTERES_POR_SEGUNDO_LEITURA`: Velocidade de leitura simulada (padrão: 25).
    - `CARACTERES_POR_SEGUNDO_DIGITACAO`: Velocidade de digitação simulada (padrão: 23).
    - `TEMPO_MAXIMO_DIGITACAO_UI_MS`: Teto máximo de tempo de digitação na UI para evitar esperas tediosas (padrão: 3500ms).
    - `NOVO_DELAY_BASE_DIGITACAO_MS`: Delay base adicionado (padrão: 600ms).
    - `NOVO_DELAY_VARIACAO_DIGITACAO_MS`: Variação de delay de digitação (padrão: 600ms).
    - `TEMPO_PENSAMENTO_MINIMO_IA_MS`: Delay cognitivo mínimo (padrão: 300ms).
    - `TEMPO_PENSAMENTO_VARIACAO_IA_MS`: Variação de delay cognitivo (padrão: 500ms).
    - `TEMPO_HESITACAO_PROATIVIDADE_MINIMO_MS` e `TEMPO_HESITACAO_PROATIVIDADE_VARIACAO_MS`: Delays para digitação espontânea de IA inativa.



### 4. Resolução de Avisos do Linter (ESLint)
- Resolvidos 4 avisos de dependências de React Hooks (`react-hooks/exhaustive-deps`) no arquivo de visualização do jogo, envolvendo chamadas assíncronas em `useCallback` e incluindo supressões onde referências mutáveis (`useRef`) são propositalmente acessadas de modo assíncrono fora do ciclo de render.

## Validação Executada

1. **Análise Estática de Tipos (TypeScript)**:
   O comando `npm run typecheck` (executado via `cmd.exe /c`) finalizou com sucesso total e sem qualquer erro de compilação:
   ```text
   > game-of-turing@0.1.0 typecheck
   > tsc --noEmit
   ```

2. **Linter e Formatação (ESLint)**:
   O comando `npm run lint` finalizou limpo, sem avisos ou erros:
   ```text
   > game-of-turing@0.1.0 lint
   > eslint .
   ```

3. **Sincronização do Grafo de Conhecimento**:
   O grafo de conhecimento do projeto foi reindexado com sucesso executando `graphify update .`:
   ```text
   Re-extracting code files in . (no LLM needed)...
   [graphify watch] Rebuilt: 691 nodes, 1168 edges, 30 communities
   [graphify watch] graph.json, graph.html and GRAPH_REPORT.md updated in graphify-out
   ```
