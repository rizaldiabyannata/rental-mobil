import { Client } from "minio";

// Membaca konfigurasi MinIO dari environment variables
const minioConfig = {
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
};

// Validasi konfigurasi
if (!minioConfig.endPoint || !minioConfig.port || !minioConfig.accessKey || !minioConfig.secretKey) {
  console.error("Konfigurasi MinIO tidak lengkap. Pastikan semua variabel environment sudah di-set.");
  // Melempar error agar aplikasi gagal start jika konfigurasi tidak ada
  // Ini mencegah masalah yang sulit di-debug di kemudian hari
  throw new Error("MINIO_ENDPOINT, MINIO_PORT, MINIO_ACCESS_KEY, dan MINIO_SECRET_KEY wajib diisi.");
}

// Membuat satu instance client MinIO untuk digunakan di seluruh aplikasi (singleton pattern)
export const minioClient = new Client(minioConfig);

export const BUCKET_NAME = process.env.MINIO_BUCKET || "rental-mobil";

/**
 * Memastikan bucket utama ada di MinIO. Jika tidak, akan dibuat.
 * Fungsi ini harus dipanggil saat aplikasi pertama kali start.
 * Bucket diatur menjadi 'public-read' agar URL gambar bisa diakses dari browser.
 */
export async function ensureBucketExists() {
  try {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    if (!bucketExists) {
      console.log(`Bucket "${BUCKET_NAME}" tidak ditemukan. Membuat bucket baru...`);
      await minioClient.makeBucket(BUCKET_NAME);
      console.log(`Bucket "${BUCKET_NAME}" berhasil dibuat.`);

      // Mengatur policy agar bucket bisa diakses secara publik (read-only)
      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
          },
        ],
      };
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
      console.log(`Policy untuk bucket "${BUCKET_NAME}" telah diatur ke public-read.`);
    }
  } catch (error) {
    console.error("Gagal memastikan bucket MinIO ada:", error);
    // Jika gagal di sini, kemungkinan besar ada masalah koneksi atau konfigurasi.
    // Sebaiknya hentikan proses agar tidak berlanjut dengan state yang salah.
    process.exit(1);
  }
}

// Contoh pemanggilan fungsi inisialisasi bucket
// Ini bisa dipanggil di file utama server atau di global setup
ensureBucketExists();