# Instruksi Penggunaan & Development

#

# Sebelum menjalankan project, salin file `.env.example` menjadi `.env` lalu sesuaikan value sesuai environment Anda.

#

# Contoh:

# ```bash

# cp .env.example .env

# # Edit .env sesuai konfigurasi database dan kebutuhan lain

# ```

## Menjalankan Project

1. Install dependencies:
   ```bash
   npm install
   ```
2. Jalankan development server:
   ```bash
   npm run dev
   ```
3. Buka [http://localhost:3000](http://localhost:3000) di browser.

## Proses Development

### Catatan UI

- Dalam pengembangan tampilan, utamakan desain untuk mobile terlebih dahulu (mobile first), kemudian lanjutkan ke tampilan tablet dan desktop.

Jika ingin menambahkan fitur UI baru, buat branch dari `development`:

```bash
git checkout development
git pull origin development
git checkout -b fitur/ui-nama-fitur
```

Setelah fitur selesai dikerjakan:

1. Push perubahan ke branch fitur:

```bash
git add .
git commit -m "feat: tambah fitur ..."
git push origin fitur/ui-nama-fitur
```

2. Setelah fitur selesai dan sudah dipastikan benar, langsung merge branch fitur ke branch `development` tanpa perlu membuat pull request.

### Cara merge branch fitur ke branch development:

1. Pastikan berada di branch development:

```bash
git checkout development
```

2. Merge branch fitur ke branch development:

```bash
git merge fitur/ui-nama-fitur
```

3. Push hasil merge ke remote:

```bash
git push origin development
```

## Koneksi Database Tanpa Docker

Jika tidak menggunakan Docker dan database berjalan langsung di device (misal WSL):

- Pastikan database sudah berjalan dan dapat diakses dari host/WSL.
- Ubah `DATABASE_URL` di file `.env` sesuai koneksi database yang digunakan. Contoh untuk Postgres:
  ```env
  DATABASE_URL="postgresql://user:password@localhost:5432/nama_db"
  ```
- Jalankan migrasi dan seed seperti biasa:
  ```bash
  npm run db:migrate -- --name <migration_name>
  npm run db:seed
  ```

---

Ini adalah project [Next.js](https://nextjs.org) yang dibuat dengan [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Memulai Project

1. Jalankan perintah berikut untuk memulai server development:

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
```

2. Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.
3. Untuk mengedit halaman, ubah file `app/page.js`. Perubahan akan otomatis ter-update.

Project ini menggunakan [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) untuk optimasi font [Geist](https://vercel.com/font).

## Database (Prisma ORM)

Project ini menggunakan Prisma ORM dan database PostgreSQL untuk pengembangan dan produksi.

- Skema: `prisma/schema.prisma`
- Prisma Client singleton: `src/lib/prisma.js`
- Contoh API route yang akses DB: `src/app/api/health/route.js`

Perintah umum:

```bash
# Generate Prisma Client
npm run db:generate

# Membuat/menerapkan migrasi jika ada perubahan pada schema.prisma
npm run db:migrate -- --name <nama_migrasi>

# Buka Prisma Studio
npm run db:studio

# Seed data contoh
npm run db:seed

# Reset DB (drop, migrasi ulang, lalu seed)
npm run db:reset
```

## Environment

- Koneksi database menggunakan PostgreSQL, atur di file `.env` dengan variabel berikut:

  ```env
  POSTGRES_USER=postgres
  POSTGRES_PASSWORD=postgres
  POSTGRES_DB=rental_mobil
  POSTGRES_HOST=localhost
  POSTGRES_PORT=5432

  # Prisma connection string untuk Postgres
  DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
  ```

- Pastikan `provider` di `prisma/schema.prisma` sudah menggunakan `postgresql`.

## Dokumentasi Lain

Untuk mempelajari lebih lanjut tentang Next.js:

- [Dokumentasi Next.js](https://nextjs.org/docs) - fitur dan API Next.js.
- [Belajar Next.js](https://nextjs.org/learn) - tutorial interaktif Next.js.

Lihat juga [repository Next.js di GitHub](https://github.com/vercel/next.js) untuk feedback dan kontribusi.

## Deploy ke Vercel

Cara termudah untuk deploy aplikasi Next.js adalah menggunakan [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Lihat [dokumentasi deploy Next.js](https://nextjs.org/docs/app/building-your-application/deploying) untuk detail lebih lanjut.
