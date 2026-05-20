---
trigger: always_on
description: Consult the graphify knowledge graph at graphify-out/ for codebase and architecture questions.
---

## graphify

Este projeto possui um grafo de conhecimento gerado pelo Graphify sob a pasta `graphify-out/`.

### Diretrizes de Uso para o Agente:

1. **Consultas Focadas (Termos Específicos & Relacionamentos):**
   - Sempre que precisar procurar elementos específicos, classes, funções ou entender caminhos de dependência direta entre dois arquivos/módulos, use o terminal para rodar:
     - `graphify query "<pergunta_ou_termo>"` para extrair subgrafos focados.
     - `graphify path "<ArquivoA>" "<ArquivoB>"` para entender acoplamentos e conexões de fluxo.
     - `graphify explain "<conceito>"` para obter detalhes de escopo.
   - Evite fazer buscas cegas com `grep` de texto ou ler arquivos de ponta a ponta quando puder direcionar a busca via query.

2. **Visão Geral e Contexto de Alto Nível:**
   - Para mapear comunidades, entender a arquitetura conceitual ou em processos de inicialização de contexto (como `/novo_chat`), leia o arquivo estático [GRAPH_REPORT.md](file:///c:/Users/LKSFERREIRA/Documents/GitHub/game-of-turing/graphify-out/GRAPH_REPORT.md). Ele dá um panorama rápido de comunidades e acoplamentos (*God Nodes*) sem exigir execuções de terminal.

3. **Uso de Integração MCP (Server):**
   - Caso o servidor MCP do Graphify esteja ativo nas ferramentas declaradas do agente, prefira usar as ferramentas nativas (`query_graph`, `get_node`, `get_neighbors`, `shortest_path`, `list_prs`, `get_pr_impact`, `triage_prs`) em vez do CLI via terminal, economizando requisições manuais de aprovação.

4. **Sincronização Pós-Mudanças:**
   - Após modificar arquivos de código durante a sessão, sempre execute `graphify update .` para manter o grafo atualizado com a AST mais recente (operação local rápida, sem custo de API).

---

### Instruções para o Usuário (Ativar MCP no Agente):
Para expor o grafo como um servidor MCP local e dar acesso estruturado nativo ao agente, você pode rodar no seu terminal local:
```bash
python -m graphify.serve graphify-out/graph.json
```
E registrar no seu cliente IDE (se compatível) apontando para o transporte stdio:
```bash
kimi mcp add --transport stdio graphify -- python -m graphify.serve graphify-out/graph.json
```
*(Nota para Windows/WSL: Se necessário, use um ambiente virtual `python3 -m venv .venv && .venv/bin/pip install "graphify[mcp]"`).*
