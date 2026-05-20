# Histórico

Registre aqui entregas concluídas, decisões importantes e links para walkthroughs.

## Entradas

- 2026-05-15: Definido que o projeto seguirá a estratégia "gameplay primeiro", com PoC local sem autenticação antes de Supabase, persistência e SaaS.
- 2026-05-15: Registradas ADRs iniciais para gameplay primeiro e Strategy Pattern de IA.
- 2026-05-15: Reescrito `README.md` com apresentação profissional do produto, estado atual da PoC, stack, arquitetura, setup, variáveis de ambiente, scripts, qualidade, segurança, roadmap e referências documentais.
- 2026-05-16: Fechada a primeira intervenção técnica: M0 marcado como concluído, provider fake de IA isolado por Strategy Pattern, sala local priorizada como Analista, UI conectada ao motor `domain/jogo` e testes unitários iniciais adicionados para regras principais.
- 2026-05-16: Ajustada validação de mensagens para mínimo de 15 caracteres e bloqueio de mais de 5 caracteres repetidos em sequência, com cobertura unitária.
- 2026-05-16: Fechados casos extremos de M2: transição por tempo esgotado, bloqueio de veredito incompleto, marcação de interlocutor inativo e feedback visual de IA digitando.
- 2026-05-16: Separada a pontuação em PDR visível e MMR oculto: PDR passa a ser exibido como recompensa pública e MMR fica reservado para matchmaking futuro.
- 2026-05-17: Substituição global de todas as referências ao termo "Interlocutor" para "Jogador" (ou "Player" em termos do banco de dados) no domínio, testes, APIs, componentes de interface, esquema SQL e documentação, registrado no walkthrough [.metadocs/walkthrough/renomeacao_jogador.md](.metadocs/walkthrough/renomeacao_jogador.md).
- 2026-05-20: Correção de inconsistências no roadmap e ajuste de teste unitário quebrado no cálculo do bônus de participação devido ao novo orçamento de caracteres do jogador, registrado no walkthrough [.metadocs/walkthrough/correcao_inconsistencias_e_problemas.md](.metadocs/walkthrough/correcao_inconsistencias_e_problemas.md).
- 2026-05-20: Reestruturação global do projeto para isolar o código-fonte de produção sob `src/` e as suítes de testes unitários sob `test/`, ajustando aliases do TypeScript e configurações do Vitest, registrado no walkthrough [.metadocs/walkthrough/reestruturacao_diretorios.md](.metadocs/walkthrough/reestruturacao_diretorios.md).
