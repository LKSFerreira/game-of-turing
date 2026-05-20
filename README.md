# Game of Turing

<p align="center">
  <strong>Dedução social, blefe textual e inteligência artificial em uma arena inspirada no Teste de Turing.</strong>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Planejado-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
</p>

## Visão Geral

**Game of Turing** é um jogo web de dedução social baseado em texto. Em partidas curtas, um Analista conversa com dois Jogadores e tenta descobrir quem é humano e quem é IA. O problema é que cada Jogador também recebe uma missão secreta: convencer o Analista de uma identidade específica, mesmo que ela não corresponda à sua natureza real.

O projeto está sendo construído com uma estratégia pragmática: primeiro validar se o loop de jogo é divertido, depois evoluir para autenticação, persistência, multiplayer em tempo real, ranking, cosméticos e operação SaaS.

## Estado Atual

O repositório está na fase de consolidação da PoC local.

| Área | Situação |
| --- | --- |
| Aplicação web | Base em Next.js App Router com interface cyber/neon |
| Lobby | Fluxo local com autenticação mock |
| Partida | Sala mock com timer, chat, cooldown, antipaste, veredito, revelação e PDR visível |
| Domínio | Motor de regras em TypeScript puro em `domain/jogo` |
| IA | Endpoint experimental em API route, com migração planejada para Strategy Pattern |
| Banco e auth real | Supabase planejado para milestones futuras |
| Testes | Vitest configurado para regras de domínio |

> A prioridade imediata é concluir M1/M2: PoC jogável sem dependência real de autenticação, motor de regras puro conectado à UI e providers de IA isolados por estratégia.

## Como o Jogo Funciona

Uma partida tem três papéis principais:

| Papel | Objetivo |
| --- | --- |
| Analista | Interrogar Azul e Vermelho e classificar corretamente a natureza de ambos: Humano ou IA |
| Jogador Azul | Conversar, blefar e cumprir sua missão secreta |
| Jogador Vermelho | Conversar, blefar e cumprir sua missão secreta |

Regras centrais da experiência:

- Partidas rápidas, com duração padrão de 3 minutos.
- Chat global lido por todos os participantes.
- Mensagens curtas, com limite de 2 a 150 caracteres.
- Cooldown entre envios para evitar flood e simular ritmo humano.
- Bloqueio de colagem no campo de mensagem durante a partida.
- Orçamento de caracteres para Jogadores.
- Fase final de veredito, seguida por revelação das naturezas reais e missões.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 15 com App Router |
| UI | React 19, Tailwind CSS 4, Motion, Lucide React |
| Linguagem | TypeScript com foco em tipagem estrita |
| Componentes | Base UI, shadcn/components e utilitários próprios |
| Regras de jogo | Módulos puros em `domain/jogo` |
| Testes | Vitest |
| Banco/Auth planejados | Supabase |
| IA planejada | Providers isolados por Strategy Pattern |

## Arquitetura

O projeto separa experiência, regras e infraestrutura para evitar que o jogo fique preso à UI ou a um provider específico.

```text
src/
  app/
    api/ai/            # Rotas server-side para integração com IA
    game/[matchId]/    # Experiência de partida
    layout.tsx         # Layout raiz
    page.tsx           # Entrada/lobby

  components/
    ui/                # Componentes reutilizáveis de interface
    Auth.tsx           # Autenticação mock da PoC atual

  domain/jogo/
    constantes.ts      # Parâmetros centrais da partida
    estatisticas.ts    # Métricas de participação
    mensagens.ts       # Validação e regras de mensagem
    mmr.ts             # Cálculo de PDR visível e MMR oculto
    partida.ts         # Criação e transição de partida
    tipos.ts           # Tipos do domínio
    veredito.ts        # Avaliação de vitória e derrota

  hooks/               # Custom hooks React
  lib/
    ia/                # Providers de IA com Strategy Pattern
    utils.ts           # Utilitários compartilhados
  types/               # Definições de tipos globais

test/
  domain/jogo/         # Testes unitários do motor de regras
  lib/ia/              # Testes unitários dos providers de IA

.metadocs/
  roadmap.md           # Fonte de verdade da evolução do produto
  historico.md         # Decisões e entregas registradas
  adr/                 # Decisões arquiteturais
  feat/                # Planos de features em andamento
  walkthrough/         # Entregas finalizadas e validadas
```

## Começando

### Pré-requisitos

- Node.js 20 LTS ou superior
- npm

### Instalação

```bash
npm install
```

### Ambiente

No Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Em Unix/macOS:

```bash
cp .env.example .env.local
```

Para desenvolvimento sem custo e sem credenciais externas, mantenha:

```env
AI_PROVIDER=fake
```

### Execução local

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Variáveis de Ambiente

| Variável | Obrigatória | Uso |
| --- | --- | --- |
| `APP_URL` | Não | URL base da aplicação local ou deploy |
| `AI_PROVIDER` | Dev local | Define um único provider de IA: `fake`, `groq`, `openrouter` ou `gemini` |
| `AI_PROVIDERS` | Produção | Providers ativos separados por vírgula, em ordem de prioridade (ex: `gemini,groq,openrouter`). Tem prioridade sobre `AI_PROVIDER` |
| `AI_PROVIDER_WEIGHTS` | Não | Pesos dos providers na mesma ordem de `AI_PROVIDERS` (ex: `5,3,2`). Defaults internos se omitido |
| `AI_CIRCUIT_BREAKER_THRESHOLD` | Não | Falhas consecutivas para abrir o circuit breaker (default: `3`) |
| `AI_CIRCUIT_BREAKER_RECOVERY_MS` | Não | Tempo em ms antes de tentar um provider bloqueado (default: `30000`) |
| `GROQ_API_KEY` | Apenas com Groq | Chave server-side para Groq |
| `OPENROUTER_API_KEY` | Apenas com OpenRouter | Chave server-side para OpenRouter |
| `GEMINI_API_KEY` | Apenas com Gemini | Chave server-side para Gemini |
| `NEXT_PUBLIC_SUPABASE_URL` | Futuro | URL pública do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Futuro | Chave pública anon do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Futuro | Chave privilegiada server-side |

Chaves privadas de IA e `SUPABASE_SERVICE_ROLE_KEY` devem permanecer exclusivamente no servidor. Não exponha secrets com prefixo `NEXT_PUBLIC_`.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run start` | Serve a build de produção |
| `npm run lint` | Executa ESLint no projeto |
| `npm run typecheck` | Valida TypeScript sem emitir arquivos |
| `npm run test` | Executa testes com Vitest |
| `npm run test:watch` | Executa Vitest em modo observação |

## Qualidade e Segurança

Princípios técnicos do projeto:

- Regras críticas devem viver no domínio ou no servidor, não apenas no cliente.
- Providers externos devem ficar atrás de interfaces, permitindo troca sem reescrever gameplay.
- Secrets de IA devem ser server-side.
- Supabase será introduzido com RLS, migrações versionadas e separação entre client público e operações privilegiadas.
- Testes unitários devem cobrir motor de regras, validação de mensagens, veredito, PDR, MMR oculto e estatísticas.

## Roadmap

| Milestone | Foco |
| --- | --- |
| M0 | Saneamento do projeto, documentação, scripts e ambiente |
| M1 | PoC jogável local sem autenticação real |
| M2 | Motor de regras puro e testável |
| M3 | MVP local completo com fluxo demonstrável |
| M4 | Autenticação e perfis com Supabase |
| M5 | Persistência, banco e RLS |
| M6 | Multiplayer e tempo real |
| M7 | Métricas, ranking e balanceamento |
| M8 | Alpha SaaS com cosméticos e operação pública |

Consulte o plano completo em `.metadocs/roadmap.md`.

## Documentação

| Arquivo | Finalidade |
| --- | --- |
| `PRD.md` | Requisitos de produto, regras de negócio e visão de evolução |
| `.metadocs/roadmap.md` | Roadmap técnico e de produto |
| `.metadocs/historico.md` | Histórico de decisões e entregas |
| `.metadocs/adr/` | Decisões arquiteturais |
| `.metadocs/feat/` | Planos detalhados de features |
| `.metadocs/walkthrough/` | Registros de entregas finalizadas |

## Direção de Produto

O norte do projeto é construir uma experiência competitiva, rápida e mentalmente interessante, onde a pergunta central não é apenas “quem é a IA?”, mas “quem está manipulando melhor a percepção do Analista?”.

Gameplay vem antes de infraestrutura. Arquitetura limpa vem desde o início. Escala, monetização e tempo real entram quando resolverem problemas reais de produto.
