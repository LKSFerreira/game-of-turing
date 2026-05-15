# ADR 0002 - IA Com Strategy Pattern

## Status

Aceita.

## Contexto

O PRD prevê uso de LLMs e comparação pública entre modelos. Groq e OpenRouter oferecem opções gratuitas ou baratas, mas disponibilidade, custo e qualidade podem mudar ao longo do projeto.

## Decisão

Toda integração de IA deve passar por uma interface única de provider. A PoC usa provider fake/local por padrão e prepara adaptadores server-side para Groq e OpenRouter.

## Consequências

- Testes não dependem de internet nem de chaves.
- O projeto pode trocar modelos sem reescrever regra de jogo.
- Chaves ficam no servidor.
- Métricas futuras podem comparar taxa de sucesso por provider/modelo.
