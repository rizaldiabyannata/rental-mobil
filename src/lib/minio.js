import { Client } from "minio";

let cached = globalThis.__minioClient;

export function getMinioClient() {
  if (cached !== undefined) return cached;
  const {
    MINIO_ENDPOINT,
    MINIO_PORT,
    MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY,
    MINIO_USE_SSL,
  } = process.env;

  if (!MINIO_ENDPOINT || !MINIO_ACCESS_KEY || !MINIO_SECRET_KEY) {
    cached = null;
    globalThis.__minioClient = cached;
    return cached;
  }

  const port = MINIO_PORT ? Number(MINIO_PORT) : 9000;
  const useSSL = String(MINIO_USE_SSL || "false").toLowerCase() === "true";

  const client = new Client({
    endPoint: MINIO_ENDPOINT,
    port,
    useSSL,
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY,
  });

  cached = client;
  globalThis.__minioClient = cached;
  return cached;
}

export async function ensureBucketExists(bucket) {
  const client = getMinioClient();
  if (!client || !bucket) return false;
  const exists = await client.bucketExists(bucket).catch(() => false);
  if (!exists) {
    await client.makeBucket(bucket, "");
  }
  return true;
}

export function buildMinioPublicUrl({ bucket, objectName }) {
  const base = (process.env.MINIO_PUBLIC_URL || "").replace(/\/$/, "");
  if (base) return `${base}/${bucket}/${objectName}`;
  const proto =
    String(process.env.MINIO_USE_SSL || "false").toLowerCase() === "true"
      ? "https"
      : "http";
  const host = process.env.MINIO_ENDPOINT;
  const port = process.env.MINIO_PORT || "9000";
  return `${proto}://${host}:${port}/${bucket}/${objectName}`;
}
