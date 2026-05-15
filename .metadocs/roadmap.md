# Roadmap Robusto: Game of Turing

Este roadmap é a fonte de verdade para evolução do projeto. Ele existe para evitar vibe coding desorganizado: cada milestone precisa deixar o jogo mais jogável, mais testável e mais fácil de manter.

## Norte do Projeto

Construir primeiro um jogo funcional, divertido e testável. A fundação deve ser sólida o bastante para evoluir para SaaS, mas sem criar infraestrutura prematura para uma escala que ainda não foi validada.

A estratégia é gameplay primeiro, arquitetura limpa desde o início e infraestrutura real apenas quando ela resolver um problema concreto. A estética atual será preservada como direção visual, mas a lógica será reconstruída com separação clara entre domínio, aplicação, infraestrutura e UI.

## Estado Atual

- Aplicação Next/React na raiz do projeto.
- `.metadocs/` reservado para roadmap, histórico, features, ADRs e walkthroughs.
- Login original do AI Studio removido do caminho crítico da PoC.
- Prioridade atual: provar o loop jogável local sem autenticação.

## Problemas Identificados

- A primeira implementação misturou UI, regras de jogo, mocks e providers externos.
- O login bloqueava a validação do jogo.
- A lógica crítica vivia em componentes React.
- `database_schema.sql` ainda é rascunho, não migração.
- Policies Supabase estão permissivas demais para produção.
- Chaves de IA precisam ser sempre server-side.
- Testes precisam nascer junto com o motor de regras.

## Princípios de Arquitetura

- Domínio puro em TypeScript: regras sem React, Supabase, fetch ou provider de IA.
- UI como casca visual: React renderiza estado e dispara ações, mas não decide regra crítica.
- Providers externos atrás de interfaces: Groq, OpenRouter, Gemini ou qualquer outro provider entram por Strategy Pattern.
- Banco como fonte de verdade apenas quando necessário: primeiro validar o loop, depois persistir.
- Testes desde cedo: regra de jogo sem teste não entra como regra final.
- Documentação como parte da entrega: cada milestone registra decisão, validação e próximos passos.
- Segurança por padrão: nenhuma secret no client, validação crítica server-side nas fases com backend.

## M0 - Saneamento e Roadmap

Objetivo: transformar o projeto em uma base organizada e compreensível.

Entregas:

- Reescrever este roadmap.
- Atualizar `AGENTS.md` para `JavaScript/TypeScript`.
- Corrigir `README.md` com setup real.
- Renomear package para `game-of-turing`.
- Definir scripts: `dev`, `build`, `lint`, `typecheck`, `test`.
- Corrigir `.env.example` para separar variáveis públicas e secrets server-side.

Critérios de aceite:

- Qualquer pessoa entende objetivo, stack, comandos e próxima etapa lendo a documentação.
- Dependências instalam e validações básicas rodam.
- Nenhuma chave sensível fica exposta como `NEXT_PUBLIC`.

Status: em execução.

## M1 - PoC Jogável Sem Auth

Objetivo: validar se o jogo é divertido antes de investir em conta, banco e SaaS.

Escopo:

- Uma partida jogável localmente.
- Sem login obrigatório.
- Sala manual/local.
- Papéis visíveis na interface: Analista, Azul e Vermelho.
- Timer, chat, missões secretas, veredito e revelação.
- IA via Strategy Pattern.
- Provider fake/local obrigatório para testes, fallback e desenvolvimento sem custo.
- Providers Groq e OpenRouter preparados para uso via API server-side.

Critérios de aceite:

- O jogador inicia a partida sem passar por login.
- O Analista conversa com pelo menos um interlocutor IA.
- O jogo chega até veredito e revelação.
- Regras principais têm testes unitários.

## M2 - Motor de Regras

Objetivo: separar definitivamente jogo de interface.

Módulos:

- Criação de partida.
- Papéis e missões.
- Validação de mensagem: mínimo 2 e máximo 150 caracteres.
- Cooldown.
- Orçamento total de caracteres dos interlocutores.
- Fases: lobby, em andamento, veredito, revelação e encerrada.
- Cálculo de vitória.
- Cálculo inicial de MMR.
- Estatísticas: mensagens, caracteres usados, WPM aproximado e participação.

Critérios de aceite:

- Regras rodam em testes sem navegador.
- UI usa o motor em vez de duplicar regras.
- Casos extremos cobertos: tempo esgotado, mensagem inválida, veredito parcial e jogador inativo.

## M3 - MVP Local Completo

Objetivo: ter um jogo completo antes de autenticação e banco.

Escopo:

- Fluxo completo: iniciar, jogar, votar, revelar e jogar novamente.
- UI refinada com a estética cyber/neon atual.
- Estados claros de erro, loading, cooldown e bloqueio.
- Seleção configurável de provider IA.
- Histórico em memória.
- Documentação de como jogar e validar.

Critérios de aceite:

- O jogo é demonstrável localmente sem Supabase.
- Playtests manuais podem ser feitos sem credenciais.
- `lint`, `typecheck`, `test` e `build` passam.

## M4 - Autenticação e Perfis

Objetivo: adicionar conta apenas depois do loop principal estar validado.

Escopo:

- Supabase Auth.
- Login, cadastro, logout e sessão persistente.
- Perfil com username, MMR de Analista, MMR de Interlocutor e saldo cosmético.
- Termos de uso no cadastro.
- Tratamento claro de erros.

Critérios de aceite:

- Usuário real entra e sai sem mock.
- Perfil é criado/carregado com segurança.
- A tela de login nunca bloqueia teste do jogo sem mensagem útil.

## M5 - Persistência e Banco

Objetivo: transformar partidas em dados confiáveis.

Escopo:

- Migrar `database_schema.sql` para migrações versionadas.
- Tabelas iniciais: `profiles`, `matches`, `match_participants`, `messages`, `match_results`, `ai_providers`, `game_events`.
- RLS segura.
- Seeds de desenvolvimento.
- Repositórios de dados com interface.
- Supabase fora da UI.

Critérios de aceite:

- Partidas finalizadas ficam registradas.
- Mensagens são persistidas para auditoria.
- RLS impede escrita indevida.
- Migrações são reproduzíveis.

## M6 - Multiplayer e Tempo Real

Objetivo: sair do local para partidas reais.

Escopo:

- Salas por link ou matchmaking simples.
- Supabase Realtime para chat e presença.
- Reconexão básica.
- Controle server-side das ações críticas.
- Encerramento por desconexão ou abandono.

Critérios de aceite:

- Dois humanos participam da mesma partida.
- IA completa mesa quando faltar interlocutor.
- Chat e veredito sincronizam entre clientes.

## M7 - Métricas, Ranking e Balanceamento

Objetivo: medir se o jogo funciona.

Métricas:

- Taxa de vitória dos Analistas.
- Taxa de sucesso por provider/modelo de IA.
- Tempo médio de partida.
- Quantidade média de mensagens.
- Uso médio do orçamento de caracteres.
- Abandono por fase.
- Retenção simples por sessão.

Critérios de aceite:

- Dashboard interno simples ou queries documentadas.
- MMR separado para Analista e Interlocutor.
- Rank das IAs baseado em dados reais.

## M8 - Alpha SaaS

Objetivo: transformar o jogo em produto.

Escopo:

- Lobby completo.
- Cosméticos sem pay-to-win.
- Loja visual.
- Passe de batalha cosmético.
- Leaderboards públicos.
- Melhorias visuais 2D/isométricas.
- Deploy Vercel + Supabase.
- Política básica de privacidade e moderação.

Critérios de aceite:

- Usuários externos conseguem jogar.
- O projeto possui documentação de operação.
- Métricas ajudam a decidir próximos ajustes.

## Testes e Qualidade

- Unitários: motor de regras, MMR, validação de mensagens, veredito e estatísticas.
- Integração: APIs, repositories e providers IA fake.
- E2E: fluxo completo de partida.
- UI: estados de erro, loading, cooldown e mobile básico.
- Segurança: env vars, RLS e rotas protegidas.

## Documentação Obrigatória

- `.metadocs/roadmap.md`: estado e próxima etapa.
- `.metadocs/historico.md`: decisões e entregas concluídas.
- `.metadocs/feat/`: plano detalhado de feature em andamento.
- `.metadocs/walkthrough/`: registro final de entrega validada.
- `.metadocs/adr/`: decisões arquiteturais.
- `README.md`: setup, comandos e variáveis.

## Próxima Entrega

Concluir M1/M2 com PoC local jogável, motor de regras puro, Strategy Pattern para IA e testes unitários.
