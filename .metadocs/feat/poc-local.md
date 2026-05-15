# Feature - PoC Local Jogável

## Objetivo

Validar o loop central do Game of Turing sem autenticação, banco ou realtime.

## Entregas

- Lobby local sem login.
- Partida como Analista.
- Interlocutores Azul e Vermelho controlados por IA fake/local.
- Chat com limite de caracteres e cooldown.
- Timer e avanço manual para veredito.
- Veredito para Azul e Vermelho.
- Revelação com resultado e estatísticas.
- Motor de regras testável fora do React.
- API server-side para provider de IA com fallback fake.

## Fora de Escopo

- Supabase Auth.
- Persistência de partidas.
- Multiplayer real.
- Monetização.
- Renderização isométrica.

## Validação

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- Teste manual do fluxo completo no navegador.
