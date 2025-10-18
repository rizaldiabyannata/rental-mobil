import { randomUUID } from "crypto";
import path from "path";
import { minioClient, BUCKET_NAME } from "./minio.js";

// Valid extensions and MIME types
const IMAGE_MIME_MAP = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

/**
 * Mengunggah satu file ke MinIO.
 *
 * @param {File} file - Objek file dari FormData.
 * @param {object} [options] - Opsi tambahan.
 * @param {string} [options.subfolder] - Subfolder di dalam bucket untuk menyimpan file.
 * @param {number} [options.maxSizeMB=5] - Ukuran file maksimum dalam MB.
 * @returns {Promise<{url: string, path: string, size: number, mime: string}>} - Informasi file yang diunggah.
 */
export async function uploadFileToMinio(file, { subfolder = "", maxSizeMB = 5 } = {}) {
  if (!file) throw new Error("File is required");
  if (!IMAGE_MIME_MAP[file.type]) throw new Error(`Unsupported file type: ${file.type}`);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (buffer.length > maxBytes) {
    throw new Error(`File too large. Max ${maxSizeMB}MB`);
  }

  const extension = IMAGE_MIME_MAP[file.type];
  const uniqueName = `${randomUUID()}${extension}`;
  const objectName = subfolder ? `${subfolder.replace(/^\/|\/$/g, '')}/${uniqueName}` : uniqueName;

  await minioClient.putObject(BUCKET_NAME, objectName, buffer, {
    "Content-Type": file.type,
  });

  const port = process.env.MINIO_PORT ? `:${process.env.MINIO_PORT}` : "";
  const protocol = process.env.MINIO_USE_SSL === 'true' ? "https" : "http";

  // URL ini mengasumsikan MinIO dapat diakses dari luar dengan endpoint dan port yang sama.
  // Untuk setup yang lebih kompleks (misalnya dengan reverse proxy), URL ini mungkin perlu disesuaikan.
  const fileUrl = `${protocol}://${process.env.MINIO_ENDPOINT}${port}/${BUCKET_NAME}/${objectName}`;

  return {
    url: fileUrl,
    path: objectName, // Path/key objek di dalam bucket
    size: buffer.length,
    mime: file.type,
    storage: "minio",
  };
}

/**
 * Mengunggah beberapa file sekaligus ke MinIO.
 *
 * @param {File[]} files - Array objek file.
 * @param {object} [opts] - Opsi yang sama dengan uploadFileToMinio.
 * @returns {Promise<Array<{url: string, path: string}>>} - Array hasil unggahan.
 */
export async function uploadMultipleFilesToMinio(files, opts = {}) {
  const results = [];
  for (const f of files) {
    if (!f || typeof f === "string") continue;
    try {
      const saved = await uploadFileToMinio(f, opts);
      results.push(saved);
    } catch (e) {
      console.warn(`Skipping file due to error: ${e.message}`);
      // Skip file yang gagal dan lanjutkan dengan yang lain
    }
  }
  return results;
}

/**
 * Menghapus file dari MinIO berdasarkan URL lengkapnya.
 *
 * @param {string} fileUrl - URL publik dari file yang akan dihapus.
 */
export async function deleteFileFromMinio(fileUrl) {
  if (!fileUrl) return;

  try {
    const url = new URL(fileUrl);
    // Pathname akan menjadi: /<bucket-name>/<object-path>
    // Kita perlu menghapus bucket name dan slash di awal.
    const objectName = url.pathname.replace(`/${BUCKET_NAME}/`, "");

    if (objectName) {
      await minioClient.removeObject(BUCKET_NAME, objectName);
    }
  } catch (error) {
    console.error(`Failed to delete file from MinIO: ${fileUrl}`, error);
    // Tidak melempar error agar proses lain bisa berlanjut, hanya catat di log.
  }
}

/**
 * Menghapus beberapa file dari MinIO.
 *
 * @param {string[]} fileUrls - Array URL file yang akan dihapus.
 */
export async function deleteMultipleFilesFromMinio(fileUrls) {
    if (!Array.isArray(fileUrls) || fileUrls.length === 0) {
        return;
    }
    const objectNames = fileUrls.map(url => {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.pathname.replace(`/${BUCKET_NAME}/`, "");
        } catch (e) {
            return null;
        }
    }).filter(Boolean);

    if (objectNames.length > 0) {
        try {
            await minioClient.removeObjects(BUCKET_NAME, objectNames);
        } catch (error) {
            console.error('Failed to delete multiple files from MinIO:', error);
        }
    }
}