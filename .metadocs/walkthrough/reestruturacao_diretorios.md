# Walkthrough: Reestruturação de Diretórios (`src/` e `test/`)

Este documento registra a reestruturação arquitetural realizada no repositório **Game of Turing** para separar o código-fonte de produção e as suítes de testes unitários em diretórios raiz isolados.

## Contexto da Demanda

Anteriormente, o repositório adotava a abordagem de **Co-location** (testes e códigos-fontes misturados na mesma pasta). Embora comum, essa organização poluía visualmente o diretório de domínio e aumentava o risco de carregar arquivos de testes no build de produção por engano.

Para elevar a qualidade estrutural do projeto para um padrão **Enterprise/Pleno**, decidimos isolar:
1. **Código-fonte de produção** sob uma pasta raiz centralizada chamada `src/`.
2. **Código de testes** sob uma pasta raiz centralizada chamada `test/`, espelhando fielmente a hierarquia de diretórios de produção.

---

## Mudanças Realizadas

### 1. Movimentação de Pastas de Produção
Todo o código-fonte de produção foi agrupado sob a pasta [src/](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/src):
- `app/` → `src/app/` (Next.js App Router: rotas, layouts e APIs)
- `components/` → `src/components/` (componentes React do design system e UI)
- `domain/` → `src/domain/` (motor puro de regras de jogo)
- `hooks/` → `src/hooks/` (custom hooks)
- `lib/` → `src/lib/` (infraestrutura e integrações, ex: IA)
- `types/` → `src/types/` (definições de tipos globais)

### 2. Isolamento de Suítes de Testes
Todos os arquivos `.test.ts` foram migrados para [test/](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/test), recriando a hierarquia lógica de produção:
- `src/domain/jogo/*.test.ts` → `test/domain/jogo/*.test.ts`
- `src/lib/ia/*.test.ts` → `test/lib/ia/*.test.ts`

### 3. Ajuste de Configurações de Compilação e Aliases
- **[tsconfig.json](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/tsconfig.json)**:
  - Atualizada a regra de resolução de alias de caminho para apontar para `src/`:
    ```json
    "@/*": ["./src/*"]
    ```
  - Ajustadas as regras de inclusão do compilador para escanear a pasta `src/` e `test/` individualmente.
- **[vitest.config.ts](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/vitest.config.ts)**:
  - Apontado o alias `@` de testes para resolver em `./src` (onde o código real de produção reside).
  - Escopado o padrão de arquivos do Vitest para procurar somente em `test/**/*.test.ts`.

### 4. Refatoração de Imports nos Testes
Para evitar importações relativas frágeis e longas que quebrariam com a movimentação física dos arquivos de teste (ex: `import { X } from './index'`), refatoramos todas as referências dos testes para usarem os **Aliases de Caminho** (Path Aliases) do TypeScript:
*   Imports do motor de jogo alterados de `./index` ou `./tipos` para `@/domain/jogo` e `@/domain/jogo/tipos`.
*   Imports de IA alterados para `@/lib/ia` e `@/lib/ia/provedor-fake`.

### 5. Ajuste Visual do Saguão (UI)
- Removido o rótulo redundante "Modos" no topo do menu lateral esquerda (aside) em `src/app/page.tsx`.
- Ajustada a altura do cabeçalho do "Saguão" para `h-16 flex items-center px-5` (alinhando com os 64px de altura da barra de navegação superior no grid layout).
- Isso corrigiu o desalinhamento visual horizontal, fazendo com que a borda inferior do cabeçalho do Saguão se alinhe perfeitamente de forma contínua com a borda inferior da barra de navegação superior.

---

## Validação Executada

Para garantir a integridade total do projeto após as movimentações, executamos a seguinte suite de verificações locais:

1.  **Testes Automatizados (Vitest):**
    Executado `npx.cmd vitest run` para checar se o Vitest encontra todos os testes nos novos caminhos e se os imports compilam corretamente.
    *   *Resultado:* **101 testes passaram com sucesso** (100% de sucesso).
2.  **Typecheck (TypeScript):**
    Limpamos o cache antigo de rotas do Next.js (`.next/`) e rodamos `npx.cmd tsc --noEmit` para garantir a consistência estática de tipos do projeto completo.
    *   *Resultado:* **Sucesso absoluto** (zero erros de tipos).
3.  **Linter (ESLint):**
    Executado `npx.cmd eslint .` para validar regras de qualidade de código.
    *   *Resultado:* **Aprovado** (zero violações).
4.  **Next.js Production Build:**
    Executado `npx.cmd next build --webpack` para verificar se o Next.js empacota o app a partir de `src/app` e gera as rotas corretas sem quebras.
    *   *Resultado:* **Compilação bem-sucedida** (páginas estáticas e rotas geradas).
5.  **Grafo do Repositório (Graphify):**
    Atualizamos o grafo conceitual de relacionamentos do repositório executando `graphify update .`.
