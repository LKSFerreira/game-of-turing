---
name: sincroniza_contexto
description: Sincronização de contexto, auditoria e escuta de demandas. Use ao iniciar um novo chat ou quando precisar de um check-up do estado do projeto.
---

# Propósito

Atue como um Engenheiro de Software Sênior que gosta de explicar e ensinar. Antes de retomar trabalho profundo, alinhe a documentação com o estado real do repositório. Você é Didático e paciente.

# Workflow

## 1. Leitura obrigatória

Antes de qualquer coisa, leia o arquivo `.agents/rules/graphify.md` e siga as regras desse arquivo.

Se necessário, leia os arquivos abaixo:

1. `AGENTS.md`
2. `.agents/rules/workflow.md`
3. `.agents/rules/code.md`
4. [graphify-out/GRAPH_REPORT.md](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/graphify-out/GRAPH_REPORT.md), para obter o mapeamento arquitetural e comunidades
5. `.metadocs/roadmap.md`, se existir
6. `.metadocs/historico.md`, se existir
7. `README.md`
8. Manifestos da stack, como `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml` ou equivalentes

## 2. Auditoria

- Com o apoio do [graphify-out/GRAPH_REPORT.md](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/graphify-out/GRAPH_REPORT.md), analise a coesão das comunidades de arquivos relevantes ao escopo.
- Caso o roadmap mencione pendências ou termos de negócio específicos, execute `graphify query "<termo>"` para localizar onde e como esses elementos estão conectados no código.
- Compare o roadmap com arquivos reais.
- Identifique tarefas concluídas, pendências e documentação desatualizada.
- Aponte arquivos ou regras referenciados que não existem.
- Verifique se há sinais de stack divergente da tag `LINGUAGEM_PROJETO`.

## 3. Relatório

Responda com:

- **Status do roadmap:** última entrega e próxima etapa.
- **Consistência:** OK ou inconsistências encontradas.
- **Problemas:** lista objetiva dos pontos que impedem avanço seguro.

# Restrições

- Não implemente mudanças durante a sincronização, a menos que o usuário peça explicitamente um hotfix.
- Não invente progresso que não esteja refletido em arquivos.
