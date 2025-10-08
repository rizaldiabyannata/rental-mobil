# Copilot Instructions for AI Agents

## Project Overview

- This is a Next.js app (see `src/app/`) for a car rental platform, using Prisma ORM for database access.
- Local development uses SQLite (`prisma/dev.db`), with schema in `prisma/schema.prisma`.
- API routes live in `src/app/api/` (see `health/route.js` for DB access example).
- Prisma client is instantiated as a singleton in `src/lib/prisma.js`.

## Key Workflows

- Generate client: `npm run db:generate`
- Migrate DB: `npm run db:migrate -- --name <migration_name>`
- Open Prisma Studio: `npm run db:studio`
- Seed DB: `npm run db:seed`
- Reset DB: `npm run db:reset`

## Conventions & Patterns

## UI Component

- Untuk pembuatan komponen UI, gunakan shadcn ui yang sudah diatur pada MCP server.
- Jika ada permintaan pembuatan komponen secara manual, selalu konfirmasi terlebih dahulu kepada user apakah ingin menggunakan shadcn ui atau dibuat manual.

## Proses Development

- Untuk penambahan fitur UI baru, buat branch dari `development`:
  ```bash
  git checkout development
  git pull origin development
  git checkout -b fitur/ui-nama-fitur
  ```
- Setelah fitur selesai dan sudah dipastikan benar, langsung merge branch fitur ke branch `development` tanpa perlu membuat pull request.

## Aturan Migrasi

- Migrasi: `npm run db:migrate -- --name <nama_migrasi>`

## Komponen UI

- Untuk pembuatan komponen UI, gunakan shadcn ui yang sudah diatur pada MCP server.
- Jika ada permintaan pembuatan komponen secara manual, selalu konfirmasi kepada user apakah ingin menggunakan shadcn ui atau dibuat manual.

## Integration Points

## Testing Rules

- Jika melakukan testing dan database tidak terkoneksi, **jangan langsung menjalankan** `docker-compose up -d`.
- Beberapa rekan menjalankan database langsung pada host tanpa Docker, jadi pastikan cara koneksi sesuai dengan environment yang digunakan.
- **API routes:** Use Next.js API route conventions in `src/app/api/`.
- **Seed script:** See `prisma/seed.js` for sample data population.

## Examples

- To add a new DB model, update `prisma/schema.prisma`, run `db:migrate`, then update API routes in `src/app/api/`.
- To change money handling, update all references to `*_Cents` fields in models and UI.

## References

- See `README.md` for more details and workflow commands.
- Key files: `prisma/schema.prisma`, `src/lib/prisma.js`, `src/app/api/health/route.js`, `prisma/seed.js`, `src/app/(public)/page.jsx`, `src/app/(admin)/admin/`

---

If any conventions or workflows are unclear, please provide feedback so this guide can be improved.
