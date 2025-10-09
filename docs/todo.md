# Todo List Backend - Rental Mobil Platform

## 📋 Manajemen Konten Utama

> Konten inti dari bisnis yang paling sering diperbarui

### 🚗 Manajemen Armada (Mobil)

**Fungsi:** Menambah, mengubah, atau menghapus data mobil

**Konten yang dikelola:**

- Nama mobil
- Deskripsi
- Galeri foto (untuk slider)
- Harga mulai
- Fitur unggulan (contoh: Kabin Luas, AC Double Blower)
- Spesifikasi lengkap (contoh: kapasitas penumpang, transmisi)
- Detail tarif (daftar harga sewa per 12 jam, antar-jemput, dll.)

### 🎯 Manajemen Paket Tour

**Fungsi:** Membuat, mengedit, dan menghapus paket wisata yang ditawarkan

**Konten yang dikelola:**

- Nama paket
- Deskripsi singkat
- Gambar utama
- Detail itinerary atau harga

### 🔧 Manajemen Layanan

**Fungsi:** Mengelola jenis layanan yang ditampilkan di beberapa halaman

**Konten yang dikelola:**

- Nama layanan (contoh: Rental Mobil All-in-one)
- Deskripsi singkat

## 🎨 Manajemen Konten Pendukung

> Konten yang mendukung pemasaran dan memberikan informasi tambahan kepada pengunjung

### ⭐ Manajemen Keunggulan Layanan (Why Choose Us)

**Fungsi:** Mengubah poin-poin keunggulan layanan Anda

**Konten yang dikelola:**

- Ikon (opsional)
- Judul keunggulan (contoh: Sopir Profesional)
- Deskripsi singkat

### ❓ Manajemen FAQ (Pertanyaan yang Sering Diajukan)

**Fungsi:** Menambah atau mengubah daftar pertanyaan dan jawaban

**Konten yang dikelola:**

- Pertanyaan
- Jawaban

### 📄 Manajemen Konten Halaman Statis

**Fungsi:** Mengubah konten tekstual pada halaman seperti "Tentang Kami" dan "Syarat & Ketentuan"

**Konten yang dikelola:**

- Judul halaman
- Deskripsi/paragraf utama
- Visi dan Misi
- Poin-poin utama Syarat & Ketentuan

### 🤝 Manajemen Mitra

**Fungsi:** Mengelola logo-logo mitra yang ditampilkan

**Konten yang dikelola:**

- Nama mitra
- File gambar logo

## 💬 Fungsionalitas Interaktif

> Fitur yang menangani input dari pengguna

### 📧 Manajemen Pesan/Pertanyaan

**Fungsi:** Menerima dan menyimpan data dari form kontak atau pemesanan

**Data yang diterima:**

- Nama Lengkap
- Nomor Telepon
- Tanggal Mulai Sewa
- Alamat Penjemputan
- Paket yang dipilih

---

# 🔄 Progress Log (Backend Recent Changes)

## ✅ Sinkronisasi Model Car

- API diselaraskan dengan schema Prisma terbaru (startingPrice, available, features[], specifications, capacity, transmission, fuelType).
- Field lama (pricePerDay, isAvailable, brand, model, year, imageUrl) dihapus dari endpoint.
- Mapper `carToApi()` digunakan untuk serialisasi konsisten.
- Endpoint publik sekarang mengembalikan coverImage (dari specifications.coverImage), gallery, dan tariffs.

## 🖼️ Manajemen Gambar & Upload

- Endpoint upload: `POST /api/cars/images/upload` (cover + multiple gallery + alt text + remove + orderMapping).
- Endpoint reorder sederhana: `POST /api/cars/images/reorder`.
- Endpoint cleanup orphan: `POST /api/cars/images/cleanup` (hapus file yang tidak direferensikan di DB / spesifikasi).
- Validasi file: MIME whitelist + max size (default 5MB) + dimensi min 50x50 / max 4000x4000.
- Rate limit upload (5 request / 30 detik / IP).

## 🤝 Partner

- CRUD + upload logo `POST /api/partners/upload`.
- Update mendukung ganti logo & auto delete file lama.

## ❓ FAQ & 📋 Terms & Conditions

- FAQ: admin endpoints + public listing.
- Terms: admin CRUD + categories endpoint + public grouped listing.

## 🗂️ Utility Baru

- `upload.js`: saveImageFile, saveMultipleImages, listUploadedFiles, deleteUploadedFile.
- `rateLimit.js`: in-memory limiter (scope "upload").
- Dependency baru: `image-size`.

## 🔐 Keamanan & Validasi

- Semua admin endpoints dibungkus `withAuth`.
- Upload dibatasi rate limiter.
- Validasi array features & integer parsing.

## ⚠️ Perhatian

- Frontend lama yang masih mengirim `pricePerDay` / `isAvailable` akan gagal – butuh adapter jika backward compatibility diperlukan.
- brand/model/year tidak ada di schema saat ini — bisa ditambahkan kembali jika dibutuhkan di UI/marketing.
- coverImage belum jadi kolom khusus, masih di `specifications.coverImage`.

## 🔜 Rekomendasi Lanjutan

1. CRUD `CarTariff` & `TourPackage` + upload image utama paket.
2. Advanced filter: kapasitas range, features contains, fuelType, transmission.
3. Soft delete untuk Car / Partner.
4. Thumbnail generation + optional compression.
5. Redis-based rate limiter untuk horizontal scaling.
6. Caching (ISR / memory) untuk public endpoints.
7. Test otomatis (unit & integration minimal untuk auth + upload + car CRUD).
8. Export data (CSV) untuk bookings & partners.
9. Notifikasi admin (email / WA) saat booking masuk.
10. Role tambahan (STAFF) dengan hak terbatas.

## 📝 Metadata

Last updated: {{9/10/2025}}
