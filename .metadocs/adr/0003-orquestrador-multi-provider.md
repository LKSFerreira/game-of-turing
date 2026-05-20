# ADR 0003 - Orquestrador Multi-Provider de IA

## Status

Aceita.

## Contexto

O Game of Turing usa LLMs como jogadores controlados por IA. Na PoC, a integração era feita com um único provider selecionado por variável de ambiente (`AI_PROVIDER`), sem fallback, sem resiliência e sem distribuição de carga.

Para cenários de produção e escalabilidade (viral), múltiplos providers precisam funcionar simultaneamente, balanceando requisições e sobrevivendo a falhas individuais sem comprometer a experiência do jogador.

## Decisão

Implementar um orquestrador interno (`src/lib/ia/orquestrador.ts`) que:

1. **Distribui requisições** entre providers usando Weighted Round-Robin configurável por variáveis de ambiente.
2. **Aplica circuit breaker** por provider: após N falhas consecutivas, o provider é bloqueado por um período de recuperação antes de ser testado novamente (padrão fechado → aberto → meio-aberto → fechado).
3. **Monitora saúde passivamente**: registra latência e taxa de erro a partir das respostas reais, sem health checks ativos que consumiriam tokens.
4. **Encerra graciosamente** quando todos os providers falham: lança `ErroIndisponibilidadeIa`, que a API route trata com HTTP 503, permitindo ao frontend encerrar a partida sem vencedor e sem prejuízo ao rank.
5. **Nunca degrada para respostas artificiais**: o provider fake existe apenas para testes e desenvolvimento local, nunca como fallback de produção.

Prioridade de providers: Gemini (peso 5) > Groq (peso 3) > OpenRouter (peso 2). Escolha baseada nos rate limits do Tier 1 do Gemini (~150-300 RPM), superiores ao free tier da Groq (30 RPM) e OpenRouter (50 RPD sem créditos).

Os providers usam fetch nativo (Groq, OpenRouter) ou o SDK oficial (`@google/genai` para Gemini), sem dependências externas adicionais.

## Consequências

- Partidas sobrevivem à queda de um provider individual sem interrupção visível.
- O sistema se auto-regula: providers degradados são temporariamente removidos e reintroduzidos automaticamente.
- Novos providers podem ser adicionados implementando a interface `ProvedorIa` e registrando no mapa de providers.
- Toda a infraestrutura de IA permanece server-side: nenhuma chave, configuração ou detalhe de arquitetura é exposto ao client.
- Complexidade adicionada no módulo de IA é contida e isolada, com testes unitários dedicados.
