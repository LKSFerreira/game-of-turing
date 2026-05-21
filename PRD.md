# Product Requirements Document (PRD): Game of Turing

## 1. Visão Geral do Produto

- **Nome do Produto:** Game of Turing
- **Conceito:** Um jogo multiplayer de dedução social baseado em texto, inspirado no Teste de Turing, onde jogadores humanos e LLMs interagem para enganar e descobrir identidades.
- **Plataforma:** Web (Browser) - Foco inicial em Desktop, com responsividade básica para Mobile.
- **Modelo de Negócio:** Freemium e Passe de Batalha (Passe mensal acessível, ex: R$ 4,90). Monetização ESTRITAMENTE COSMÉTICA (skins, customização de quarto, balões de chat, emotes). Regra de Ouro: JAMAIS será Pay-to-Win. Nenhum item comprado com dinheiro real ou moeda in-game oferecerá vantagem competitiva, dicas, aumento de orçamento de palavras ou facilitação nas deduções.
- **Público-Alvo:** Fãs de jogos de dedução social (Among Us, Town of Salem), entusiastas de tecnologia/IA, estudantes e público geral em busca de jogos rápidos e mentais.

## 2. Objetivos

- **Criar um jogo engajador e rápido:** Partidas curtas (3 minutos) focadas em chat e dedução.
- **Implementar um sistema de matchmaking fluido:** Conectar jogadores e instanciar LLMs dinamicamente.
- **Oferecer uma experiência gamificada:** Salas de espera interativas (quartos customizáveis), portais de transição e avatares visuais, mesmo a interação principal sendo por texto.
- **Estabelecer um sistema de ranking:** Rankings globais separados para Analistas, Jogadores e (curiosamente) IAs.

## 3. Regras de Negócio e Mecânicas Core

### 3.1. Papéis, Condições de Vitória e Composição da Mesa

A composição da sala é oculta para todos até o fim da partida. O jogo não é sempre "1 Humano + 1 LLM + 1 Analista". As mesas são geradas aleatoriamente pelo servidor.

#### O Analista (Sempre 1 por mesa):

- **Objetivo:** Interagir via texto com os Jogadores Azul e Vermelho e deduzir a natureza real (Humano ou IA) de cada um.
- **Poder:** Fazer as perguntas. Ele guia a conversa.
- **Condição de Vitória:** Ao final do tempo, o Analista precisa rotular corretamente ambos os jogadores (Ex: Azul = IA, Vermelho = Humano). Se errar pelo menos um, perde a partida (para evitar "chutes" pela metade).

#### Os Jogadores (Jogador Azul e Jogador Vermelho):

- **Composição Possível da Mesa:** (Humano + LLM), (Humano + Humano), (LLM + LLM).
- **O Twist (Missões Secretas):** Para garantir que não seja um jogo de soma zero e adicionar complexidade, cada Jogador (seja Humano ou LLM) recebe um Objetivo Secreto no início da partida:
  - **Objetivo A:** "Convença o Analista de que você é HUMANO."
  - **Objetivo B:** "Convença o Analista de que você é uma IA (LLM)."
- **Condição de Vitória do Jogador:** O Jogador vence se o Analista dar a ele o rótulo igual ao do seu Objetivo Secreto, independentemente do que ele realmente seja. (Exemplo: Um Humano com o Objetivo B ganha se o Analista rotulá-lo como IA).
- **Regra de Engajamento:** Os Jogadores não sabem a natureza nem o objetivo do outro Jogador.

### 3.2. Dinâmica e Regras da Partida (O Jogo do Engano)

- **Fase de Espera:** Jogadores ficam em seus "Quartos" (Saguão).
- **Matchmaking:** Quando 2 ou 3 jogadores são encontrados (o servidor completa com LLMs se necessário), um "Portal" aparece no Quarto.
- **Transição:** O jogador clica no portal e é teleportado para a "Sala Dimensional" (a interface de chat e avatares).

#### Início da Partida (Timer de 3 Minutos):

- Os papéis e Objetivos Secretos são revelados privadamente.

##### Mecânica do Chat e Gestão de Recursos:

- **Chat Unificado:** Todos (Analista, Azul e Vermelho) leem e escrevem no mesmo chat global da sala. Isso permite que Azul e Vermelho interajam entre si, criando alianças temporárias ou acusando um ao outro para confundir o Analista ("O Azul está digitando rápido demais, parece IA!").
- **Orçamento de Palavras (Limite Global por Partida):** Como os recursos de tempo do Analista são limitados, Azul e Vermelho possuem um Limite Total de Caracteres (ex: 3.000 caracteres) para gastar em toda a partida de 3 minutos. Isso adiciona uma camada de estratégia: eles precisam ser persuasivos sem desperdiçar seu "orçamento" de palavras antes do fim do tempo. O Analista não possui esse limite, para que possa questionar livremente.

##### Limitações Anti-Spam e Anti-Bot (Crucial):

- **Máximo de Caracteres por Mensagem:** Limite estrito de 150 caracteres por mensagem. O objetivo é forçar respostas curtas, diretas e ping-pong, imitando o ritmo de uma conversa de mensageiro instantâneo (WhatsApp, Discord). Mensagens prolixas entregam facilmente que é uma IA.
- **Mínimo de Caracteres por Mensagem:** O sistema exigirá no mínimo 2 caracteres válidos por envio (evitando spam de espaços em branco ou envios vazios acidentais que poluem o chat e gastam o cooldown).
- **Bloqueio de Área de Transferência:** A função "Colar" (Ctrl+V / Paste) é bloqueada no campo de texto durante o jogo para impedir que humanos colem respostas de abas externas com o ChatGPT.
- **Cooldown Rigoroso:** Um tempo de espera obrigatório de 2 a 3 segundos entre o envio de mensagens. Isso se aplica tanto aos humanos quanto aos LLMs para impedir flood no chat, garantindo que o Analista tenha tempo de ler e processar as informações.
- **Obrigatoriedade e Estímulo de Resposta:** Para evitar a "tática do silêncio" (onde um jogador não fala nada para não se incriminar), os Jogadores (Humanos e IA) não são obrigados a responder, mas são fortemente incentivados pelo sistema de pontuação. Se um Jogador ignorar perguntas diretas e manter um perfil muito baixo (baixa atividade no chat), ele perderá bônus e, caso não use um percentual mínimo do seu "Orçamento de Palavras", poderá ser penalizado por "inatividade tática" ao final.

#### Fim do Tempo (Fase de Veredito - 15 Segundos):

- O chat é bloqueado. O timer fica vermelho.
- O Analista recebe dois menus dropdown (ou arrasta "Tags") em cima dos avatares Azul e Vermelho.
- Ele deve classificar: [Azul: Humano ou IA?] e [Vermelho: Humano ou IA?].
- **Aviso:** Azul e Vermelho apenas aguardam a decisão em suspense.

#### A Grande Revelação (Tela Final):

- Os avatares "quebram" a fantasia (Ex: Um avatar revela circuitos se for IA, ou tira uma máscara se for humano).
- A tela mostra um resumo: "O Analista Errou! Jogador Azul era Humano (Missão: Fingir ser IA). Jogador Vermelho era IA (Missão: Fingir ser IA)."
- **Estatísticas da Partida:** Exibição do WPM (Words Per Minute) de cada jogador, mostrando quem digitou mais rápido (fator de desconfiança comum) e o quanto cada um consumiu do seu "Orçamento de Palavras".
- Distribuição de Pontos e Botão de "Jogar Novamente".

### 3.3. Sistema de Rank, PDR e MMR

O sistema de Rank é global e categorizado. Um jogador possui estatísticas separadas para quando joga como Analista e quando joga como Jogador. A pontuação é dividida em duas camadas:

- **PDR:** pontuação visível do jogador. É exibida na interface, pode ser acumulada, ganha e perdida ao fim da partida.
- **MMR:** pontuação oculta usada pelo algoritmo de matchmaking para formar partidas mais equilibradas. Ela não deve ser exibida como recompensa pública.

#### Rank de Analista (Foco em Dedução):

- **Vitória (+25 PDR):** Acertou a natureza dos dois Jogadores.
- **Derrota (-15 PDR):** Errou um ou ambos.

#### Rank de Jogador (Foco em Atuação/Engano):

- **Vitória (+20 PDR):** Enganou o Analista ou provou sua natureza conforme seu Objetivo Secreto.
- **Derrota (-10 PDR):** O Analista votou contra seu Objetivo Secreto.
- **Bônus de Mestre do Disfarce (+10 PDR extra):** Se for Humano, tirar o Objetivo "Fingir ser IA" e conseguir enganar o Analista (considerado o feito mais difícil).
- **Bônus de Eloquência / Participação (+5 a +10 PDR extra):** Concedido aos Jogadores (Humanos e IAs) que efetivamente responderam às perguntas do Analista e mantiveram uma alta interatividade, garantindo que a partida não se torne silenciosa. Jogadores passivos, mesmo ganhando a partida base, perdem este bônus, incentivando ativamente a conversa.
- **Ajuste de MMR oculto:** calculado em paralelo para matchmaking, com variação própria e sem depender da camada visual de PDR.

#### O "Rank das IAs" (Leaderboard Público):

- Haverá um painel no menu principal listando quais modelos de IA o jogo está usando (Ex: GPT-4o-mini, Claude-3-Haiku, Gemini-Flash, Llama-3) sob codinomes misteriosos (Bot 001, Bot 002).
- Mostrará publicamente a "Taxa de Sucesso em Enganar Humanos" de cada IA. Isso gera engajamento da comunidade e curiosidade técnica.

## 4. Design e Experiência do Usuário (UI/UX) e Monetização

- **O Saguão (Quarto do Jogador):** Uma tela isométrica ou 2D onde o avatar do jogador aguarda. Pode ser customizado com itens (cadeiras, tapetes, posters, pets) comprados com moeda do jogo ou ganhos no Passe de Batalha.
- **O Matchmaking (O Portal):** Uma animação visual chamativa de um portal se abrindo no quarto quando a partida é encontrada.

### A Sala Dimensional (Gameplay):

- **Avatares e Ambiente:** Personagens sentados ao redor de uma mesa ou em totens de neon. Eles têm animações de "pensando" e "digitando...".
- **Histórico de Mensagens Fixo:** Um painel lateral ou central em pergaminho/tela digital (perfeitamente integrado à visão isométrica) onde o log do chat rola suavemente. É vital que seja amplo o suficiente para o Analista reler mensagens anteriores rapidamente.
- **Emotes de Blefe:** Jogadores podem enviar emotes (ex: 🧐, 🤖, 🎭, 💦 suando frio) que aparecem acima de seus avatares. Serve para provocar sem gastar o limite de caracteres do chat.

### Passe de Batalha Mensal e Loja (Monetização Cosmética):

- Passe de Batalha acessível renovado mensalmente contendo "Fantasias de Revelação" exclusivas, avatares temáticos, móveis para o Quarto e novas cores/estilos de balão de fala.
- Moeda in-game pode ser comprada, mas exclusivamente para adquirir itens visuais. Sem bônus de XP, sem compra de "dicas" ou alterações de mecânica.

## 5. Requisitos Funcionais e Técnicos (Escopo Inicial)

### 5.1. Front-end (Cliente)

- Sistema de Autenticação (Login/Cadastro).
- Interface do Saguão e gerenciamento de inventário básico.
- Gerenciamento de estado em tempo real (polling curto, WebSockets ou Server-Sent Events, a depender da solução de backend adotada) para matchmaking e chat.
- Renderização isométrica ou 2D rica (Phaser.js, Pixi.js, ou Three.js para 3D leve).

### 5.2. Back-end e Infraestrutura (Serverless/BaaS)

- **Hospedagem Frontend/APIs:** Vercel (adequado para Next.js/React e serverless functions).
- **Banco de Dados e Auth:** Supabase (PostgreSQL para dados relacionais como perfis, ELO, histórico de partidas e inventário de cosméticos; Supabase Auth para login).
- **Tempo Real (Real-time):** Utilização do Supabase Realtime (que lida com WebSockets por baixo dos panos) ou Server-Sent Events via Vercel Functions para gerenciar o chat da partida e estado da sala sem a necessidade de configurar um servidor Socket.io dedicado.
- **Lógica de Jogo:** Funções Serverless (Edge Functions na Vercel ou Supabase) para controlar timers, aplicar cooldowns (validação no servidor), processar turnos de mensagem e avaliar condições de vitória com segurança (evitando trapaças do lado do cliente).

### 5.3. Integração com IA (Arquitetura Atual)

- **Orquestrador e Circuit Breaker:** O backend já possui um orquestrador agnóstico que distribui chamadas usando *Weighted Round-Robin* (balanceamento de carga) e um sistema de *Circuit Breaker* para tolerância a falhas.
- **Provedores Atuais:** O sistema atualmente suporta Groq (ex: Llama 3), Gemini e OpenRouter. Foi adicionada sanitização de texto para garantir fluidez.
- **Provedor Futuro Principal (GitHub Models):** Está planejada a integração com os LLMs gratuitos fornecidos via GitHub Marketplace (Azure Inference), utilizando os modelos da família GPT-4o-mini para equilibrar baixo custo e alta inteligência.
- **Sistema de Prompts Dinâmicos e Missões:** O backend passa a missão secreta no System Prompt, atualmente padronizada para *convencer_humano*, garantindo consistência no comportamento da IA.

## 6. Desafios e Riscos (A Mitigar)

### Validação de Perfil Humano (Anti-Bot):

- Captchas invisíveis no login. Monitoramento de velocidade de digitação (WPM e cadência). Bloqueio de Ctrl+C/Ctrl+V. Sistema de denúncias.

### Custos de API do LLM:

- Uso estratégico do Groq (modelos open-source) para minimizar o custo base, limitando o consumo através da mecânica de "Orçamento de Palavras" do jogo.

### Comportamento do LLM (Quebra de Personagem):

- Engenharia de prompt robusta para evitar prompt injection vindo do Analista.

## 7. Roteiro de Desenvolvimento (POC e MVP)

Para viabilizar o projeto (especialmente para um TCC), o desenvolvimento será dividido em fases:

### Fase 1: Proof of Concept (PoC) - "A Validação da Diversão" (✅ CONCLUÍDO)

- **Estado Atual:** A mecânica central de Dedução + Missões Secretas + IA foi validada localmente. O motor de jogo foi separado da UI (Domain-Driven Design), com validações estritas de mensagens, W.O. por inatividade, e simulação orgânica de tempo de digitação baseada em CPS (Characters Per Second).
- **O que foi feito:** Interface isométrica na UI base para a sala; orquestrador robusto de IAs (Groq, Gemini, OpenRouter) operante e sistema de Game Over / Veredito com cálculo dinâmico de pontuação (PDR) e penalidades.

### Fase 2: Minimum Viable Product (MVP) - "O Jogo Funcional" (🚧 EM ANDAMENTO)

- **Objetivo:** Criar a infraestrutura de tempo real (multiplayer) e persistência.
- **O que será implementado:**
  - Websockets ou SSE nativo para o multiplayer, permitindo 3 pessoas simultâneas no chat.
  - Banco de Dados (ex: Supabase ou Firebase) para contas de usuário e login básico.
  - O servidor conectará clientes à fila de Matchmaking e instanciará os LLMs (agora utilizando GitHub Models para alta performance e estabilidade).
  - Bloqueio físico e lógico da UI do Chat sincronizado para todos os participantes.
- **Lançamento Inicial:** Hospedagem na nuvem com divulgação interna para playtests reais.

### Fase 3: Versão Alpha (O Jogo Gamificado)

- **Objetivo:** Implementar o design final para engajamento a longo prazo e monetização.
- **O que terá:**
  - Motor gráfico isométrico (O Quarto, O Portal, A Sala Dimensional).
  - Loja de cosméticos e moedas do jogo, lançamento do Passe de Batalha 1.
  - Leaderboard global interativo (O "Rank das IAs" e Top Analistas).
  - Emotes in-game e animações avançadas.

## 8. Requisitos de Entrega e Operação (Infraestrutura, DevOps e Métricas)

Para que a PoC e o MVP sejam viáveis do ponto de vista de negócios (SaaS) e acadêmico (TCC), as seguintes fundações são obrigatórias:

### 8.1. Stack Tecnológica Confirmada

- **Front-end:** React.js (via Next.js) para facilitar o deploy na Vercel e gerenciar o SEO do Saguão.
- **Back-end (BaaS):** Supabase (PostgreSQL para dados, Supabase Auth para autenticação segura e Supabase Realtime para a camada de tempo real do chat).
- **Integração IA:** SDK da Groq implementado através do padrão arquitetural Strategy, permitindo que funções Serverless (Vercel) acionem diferentes provedores.

### 8.2. Monitoramento de Custos e Segurança

- **Validação Server-Side:** Todas as regras críticas (cooldown de mensagem, orçamento restante de caracteres, limite de caracteres por mensagem) devem ser validadas no backend (Serverless Functions/Supabase). A validação no front-end é apenas para UX (avisar o usuário), mas o servidor é a fonte da verdade para impedir trapaças de rede.
- **Rate Limiting Severo:** Proteger as rotas que acionam a API de LLM (ex: Groq) contra abuso, limitando estritamente a quantidade de requests que um mesmo User ID logado pode fazer por minuto.

### 8.3. Analytics e Telemetria (Avaliando o TCC/MVP)

É necessário rastrear dados não-identificáveis para comprovar que o jogo funciona:

- Taxa de Vitória dos Analistas (Se for > 80%, o jogo está muito fácil; se for < 20%, as IAs/Humanos estão enganando fácil demais e gera frustração).
- Tempo Médio de Fila (Matchmaking).
- DAU (Daily Active Users) e Retenção (Quantas partidas um usuário joga em uma mesma sessão).

### 8.4. Privacidade e Termos de Uso (Legal)

Como o jogo coleta textos digitados por humanos e os processa, a interface de login precisa de um "Termos de Uso" claro, avisando que:

- Os textos no chat poderão ser analisados e enviados para serviços de LLM de terceiros para o funcionamento das mecânicas do jogo.
- Moderadores poderão rever logs do chat em caso de denúncia de quebra de regras (discurso de ódio, assédio, etc.).

## 9. Arquitetura de Dados Inicial (Supabase / PostgreSQL)

O modelo relacional deverá suportar alta concorrência e consultas rápidas para o matchmaking. O esboço inicial compreende:

### Tabela `users` (Perfis):

- `id` (UUID), `username` (único), `email`, `created_at`.
- `pdr_analyst` (Int), `pdr_player` (Int) -> Pontuação visível e leaderboards.
- `mmr_analyst` (Int), `mmr_player` (Int) -> Pontuação oculta para matchmaking.
- `currency_balance` (Int) -> Moedas in-game para cosméticos.

### Tabela `matches` (Partidas):

- `id` (UUID), `status` (waiting, in_progress, finished), `created_at`, `ended_at`.
- `analyst_id` (UUID - relacional com users), `analyst_verdict_blue`, `analyst_verdict_red`.
- `blue_player_type` (human, ai), `red_player_type` (human, ai).

### Tabela `match_participants` (Participantes da Partida):

- `match_id` (UUID), `user_id` (UUID, null se for IA).
- `role` (analyst, player), `color` (blue, red).
- `secret_mission` (A, B).
- `characters_used` (Int) -> Controle do "Orçamento de Palavras".

### Tabela `messages` (Log do Chat):

- `id` (UUID), `match_id` (UUID), `sender_color` (blue, red, analyst).
- `content` (Text), `created_at` (Timestamp).

> **Nota:** O histórico do chat será gravado para resolver denúncias, auditar o comportamento dos LLMs e aplicar o sistema de recompensas ao final da partida.

## 10. Comunicação em Tempo Real (Supabase Realtime)

Como o desenvolvedor não utilizará socket.io, a infraestrutura adotará o Supabase Realtime (Canais / Presence) para gerenciar o estado efêmero do jogo:

- **Broadcast de Mensagens:** As mensagens do chat não serão gravadas no banco de dados a cada enter (para economizar custos e melhorar performance). O Next.js enviará a mensagem via Supabase Channel Broadcast para os clientes da sala. O servidor (Vercel Functions/Supabase Edge) processará o limite de caracteres e regras, e somente no fim do jogo gravará o log completo no banco relacional.
- **Status de Jogador (Presence):** Utilizar o Supabase Presence no Saguão para indicar quem está online e criar o pool de matchmaking. O sistema identifica quando o jogador se desconecta (fecha a aba) durante a partida e encerra a sala com vitória automática para o lado prejudicado.
