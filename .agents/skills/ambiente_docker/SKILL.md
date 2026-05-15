---
name: ambiente_docker
description: Gerencia setup e manutenção do ambiente Docker Compose usando os templates oficiais do repositório.
---

# Propósito

Use esta skill quando o usuário pedir `/setup_docker`, ajuste de containers, correção de Compose ou manutenção de dependências em ambiente Docker.

# Setup

1. Identifique a stack pelo projeto e pela tag `LINGUAGEM_PROJETO`.
2. Use templates em `.agents/templates/.docker/`.
3. Crie `.docker/` na raiz do projeto, se não existir.
4. Copie o Dockerfile da stack escolhida para `.docker/`.
5. Gere ou ajuste `.docker/compose.yaml` usando serviços padrão:
   - `app` para aplicação;
   - `database` para PostgreSQL quando necessário.
6. Copie `.agents/templates/.docker/.env.example` para `.env.example`.
7. Crie `.env` local apenas quando o usuário autorizar ou quando o fluxo exigir execução local.

# Regras

- Não crie Dockerfile do zero se houver template compatível.
- Os Dockerfiles ficam em `.docker/`.
- Use `postgres` como nome da stack e do serviço de banco.
- `dev.sh` deve usar `docker compose -f .docker/compose.yaml`.
- `exec.sh` deve executar comandos no serviço `app`.
- Não instale dependências no host quando Docker estiver ativo.

# Comandos

```bash
bash dev.sh
bash dev.sh --build
bash exec.sh <comando>
docker compose -f .docker/compose.yaml config
```
