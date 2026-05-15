# ADR 0001 - Gameplay Primeiro

## Status

Aceita.

## Contexto

O projeto nasceu com ambição de SaaS, autenticação, banco, IA real, métricas, cosméticos e experiência visual rica. Porém o risco central ainda é anterior a tudo isso: o jogo precisa ser divertido e compreensível.

## Decisão

A primeira versão jogável não terá autenticação obrigatória nem persistência em banco. O foco será validar o loop central: iniciar partida, conversar, votar, revelar identidades e jogar novamente.

## Consequências

- O jogo pode ser testado sem credenciais.
- A arquitetura de domínio nasce separada da infraestrutura.
- Supabase entra depois que o loop local estiver sólido.
- Evitamos gastar tempo criando infraestrutura para um produto cuja diversão ainda precisa ser validada.
