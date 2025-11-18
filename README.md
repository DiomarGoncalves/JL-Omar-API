# TruckControl API (Vercel + Neon)

API em Node + TypeScript + Express, pensada para rodar na Vercel com banco PostgreSQL serverless da Neon.

## Passos básicos

1. Copie `.env.example` para `.env` e configure `DATABASE_URL` e `JWT_SECRET`.
2. Rode o script SQL `src/db/migrations.sql` na sua base da Neon.
3. Local: `npm install` e `npm run dev`.
4. Vercel: importe o repositório e configure as variáveis de ambiente.

Rotas principais ficam em `/api/...`:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/trucks` etc.
