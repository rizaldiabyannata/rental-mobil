/**
 * Skrip Migrasi Gambar dari Penyimpanan Lokal ke MinIO
 *
 * Cara Menjalankan:
 * 1. Pastikan MinIO dan database berjalan.
 * 2. Pastikan file .env sudah terisi dengan konfigurasi MinIO dan Database yang benar.
 * 3. Pastikan direktori `public/uploads` berisi semua gambar yang akan dimigrasi.
 * 4. Jalankan perintah: `npm run migrate:minio`
 *
 * Skrip ini bersifat idempoten: jika dijalankan lagi, ia akan melewatkan file yang sudah dimigrasi (URL-nya sudah URL MinIO).
 */
import { PrismaClient } from "@prisma/client";
import { minioClient, BUCKET_NAME } from "../src/lib/minio.js";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), "public");

// Helper untuk mengunggah file lokal ke MinIO
async function uploadLocalFile(filePath, subfolder) {
  try {
    const fullPath = path.join(UPLOAD_DIR, filePath);
    await fs.access(fullPath); // Cek apakah file ada

    const buffer = await fs.readFile(fullPath);
    const fileName = path.basename(filePath);
    const objectName = `${subfolder}/${fileName}`;

    await minioClient.putObject(BUCKET_NAME, objectName, buffer);

    const port = process.env.MINIO_PORT ? `:${process.env.MINIO_PORT}` : "";
    const protocol = process.env.MINIO_USE_SSL === 'true' ? "https" : "http";
    const url = `${protocol}://${process.env.MINIO_ENDPOINT}${port}/${BUCKET_NAME}/${objectName}`;

    return url;
  } catch (error) {
    // Jika file tidak ditemukan, error akan ditangkap di sini
    console.warn(`      - ⚠️ File tidak ditemukan di disk: ${filePath}`);
    return null;
  }
}

async function migratePartners() {
  console.log("\n--- Memulai Migrasi Logo Partner ---");
  const partners = await prisma.partner.findMany();
  let migratedCount = 0;
  let skippedCount = 0;

  for (const partner of partners) {
    if (partner.logoUrl && partner.logoUrl.startsWith("/uploads/")) {
      console.log(`  - Memproses partner: ${partner.name}`);
      const newUrl = await uploadLocalFile(partner.logoUrl, "partners");
      if (newUrl) {
        await prisma.partner.update({
          where: { id: partner.id },
          data: { logoUrl: newUrl },
        });
        console.log(`      - ✅ Berhasil dimigrasi ke: ${newUrl}`);
        migratedCount++;
      }
    } else {
      skippedCount++;
    }
  }
  console.log(`--- Migrasi Partner Selesai ---`);
  console.log(`Total: ${partners.length}, Dimigrasi: ${migratedCount}, Dilewati: ${skippedCount}`);
}

async function migrateCarImages() {
  console.log("\n--- Memulai Migrasi Gambar Mobil ---");
  const carImages = await prisma.carImage.findMany();
  let migratedCount = 0;
  let skippedCount = 0;

  for (const image of carImages) {
    if (image.imageUrl && image.imageUrl.startsWith("/uploads/")) {
      console.log(`  - Memproses gambar mobil: ${image.id}`);
      const newUrl = await uploadLocalFile(image.imageUrl, "cars");
      if (newUrl) {
        await prisma.carImage.update({
          where: { id: image.id },
          data: { imageUrl: newUrl },
        });
        console.log(`      - ✅ Berhasil dimigrasi ke: ${newUrl}`);
        migratedCount++;
      }
    } else {
      skippedCount++;
    }
  }
  console.log(`--- Migrasi Gambar Mobil Selesai ---`);
  console.log(`Total: ${carImages.length}, Dimigrasi: ${migratedCount}, Dilewati: ${skippedCount}`);
}

async function migrateTourPackages() {
  console.log("\n--- Memulai Migrasi Galeri Paket Tur ---");
  const packages = await prisma.tourPackage.findMany();
  let migratedCount = 0;
  let skippedCount = 0;

  for (const pkg of packages) {
    if (pkg.galleryImages && pkg.galleryImages.length > 0) {
      console.log(`  - Memproses paket tur: ${pkg.name}`);
      let needsUpdate = false;
      const newGalleryUrls = [];

      for (const imageUrl of pkg.galleryImages) {
        if (imageUrl.startsWith("/uploads/")) {
          const newUrl = await uploadLocalFile(imageUrl, "tours");
          if (newUrl) {
            newGalleryUrls.push(newUrl);
            needsUpdate = true;
          } else {
            newGalleryUrls.push(imageUrl); // Pertahankan URL lama jika file tidak ditemukan
          }
        } else {
          newGalleryUrls.push(imageUrl); // URL sudah di MinIO atau eksternal
        }
      }

      if (needsUpdate) {
        await prisma.tourPackage.update({
          where: { id: pkg.id },
          data: { galleryImages: newGalleryUrls },
        });
        console.log(`      - ✅ Galeri berhasil diperbarui.`);
        migratedCount++;
      } else {
        skippedCount++;
      }
    } else {
      skippedCount++;
    }
  }
  console.log(`--- Migrasi Paket Tur Selesai ---`);
  console.log(`Total: ${packages.length}, Dimigrasi: ${migratedCount}, Dilewati: ${skippedCount}`);
}

async function main() {
  console.log("Memulai skrip migrasi ke MinIO...");
  try {
    await migratePartners();
    await migrateCarImages();
    await migrateTourPackages();
    console.log("\n🎉 Semua migrasi telah selesai dengan sukses!");
  } catch (error) {
    console.error("\n❌ Terjadi error selama proses migrasi:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();