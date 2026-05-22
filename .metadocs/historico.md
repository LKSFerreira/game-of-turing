# Histórico

Registre aqui entregas concluídas, decisões importantes e links para walkthroughs.

## Entradas

- 2026-05-15: Definido que o projeto seguirá a estratégia "gameplay primeiro", com PoC local sem autenticação antes de Supabase, persistência e SaaS.
- 2026-05-15: Registradas ADRs iniciais para gameplay primeiro e Strategy Pattern de IA.
- 2026-05-15: Reescrito `README.md` com apresentação profissional do produto, estado atual da PoC, stack, arquitetura, setup, variáveis de ambiente, scripts, qualidade, segurança, roadmap e referências documentais.
- 2026-05-16: Fechada a primeira intervenção técnica: M0 marcado como concluído, provider fake de IA isolado por Strategy Pattern, sala local priorizada como Analista, UI conectada ao motor `domain/jogo` e testes unitários iniciais adicionados para regras principais.
- 2026-05-16: Ajustada validação de mensagens para mínimo de 15 caracteres e bloqueio de mais de 5 caracteres repetidos em sequência, com cobertura unitária.
- 2026-05-16: Fechados casos extremos de M2: transição por tempo esgotado, bloqueio de veredito incompleto, marcação de jogador inativo e feedback visual de IA digitando.
- 2026-05-16: Separada a pontuação em PDR visível e MMR oculto: PDR passa a ser exibido como recompensa pública e MMR fica reservado para matchmaking futuro.
- 2026-05-17: Substituição global de todas as referências ao termo "Interlocutor" para "Jogador" (ou "Player" em termos do banco de dados) no domínio, testes, APIs, componentes de interface, esquema SQL e documentação, registrado no walkthrough [.metadocs/walkthrough/renomeacao_jogador.md](.metadocs/walkthrough/renomeacao_jogador.md).
- 2026-05-20: Correção de inconsistências no roadmap e ajuste de teste unitário quebrado no cálculo do bônus de participação devido ao novo orçamento de caracteres do jogador, registrado no walkthrough [.metadocs/walkthrough/correcao_inconsistencias_e_problemas.md](.metadocs/walkthrough/correcao_inconsistencias_e_problemas.md).
- 2026-05-20: Reestruturação global do projeto para isolar o código-fonte de produção sob `src/` e as suítes de testes unitários sob `test/`, ajustando aliases do TypeScript e configurações do Vitest, registrado no walkthrough [.metadocs/walkthrough/reestruturacao_diretorios.md](.metadocs/walkthrough/reestruturacao_diretorios.md).
- 2026-05-20: Implementação da M3.5 — IA Agêntica Multi-Provider: orquestrador com Weighted Round-Robin, circuit breaker e fallback automático para Groq, OpenRouter e Gemini; prompt engineering agêntico com persona, missão secreta e contexto multi-turno; ADR 0003 registrando a decisão arquitetural.
- 2026-05-21: Integração do provedor principal GitHub Models usando o modelo `openai/gpt-5-nano` com a API oficial do GitHub, ajustando o sistema de pesos do orquestrador para que este atue como principal absoluto (peso 100) sobrepondo os demais em load balancing.
- 2026-05-21: Calibração de reação das IAs com delays cognitivos realistas, correção do bug de estouro de tempo do veredito para preservar seleções parciais na UI, e criação de logger de eventos de partida coloridos no terminal do Next.js, registrado no walkthrough [.metadocs/walkthrough/calibracao_e_observabilidade.md](.metadocs/walkthrough/calibracao_e_observabilidade.md).
- 2026-05-21: Implementação de um filtro de palavras impróprias robusto para jogadores humanos que previne burlas (Leet Speak, espaçamentos, repetições, pontuações) sem causar falsos positivos em palavras seguras, registrado no walkthrough [.metadocs/walkthrough/filtro_palavras_improprias.md](.metadocs/walkthrough/filtro_palavras_improprias.md).
