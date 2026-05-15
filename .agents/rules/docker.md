---
trigger: model_decision
description: Regras para uso de Docker Compose nos projetos gerados por este template.
---

# Regras Docker

- Use `.docker/compose.yaml` como arquivo Compose padrão.
- Use `bash dev.sh` para subir o ambiente quando o script existir.
- Use `bash exec.sh <comando>` para executar comandos no serviço `app`.
- Não instale dependências no host quando o projeto tiver ambiente Docker configurado.
- Mantenha serviços padrão como `app` e `database`, salvo quando a stack exigir nomes mais específicos.
- Não versione `.env`; mantenha `.env.example` como referência segura.
- Templates Docker devem ficar em `.agents/templates/.docker/`.
