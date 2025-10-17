import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "rentalmobil-minio-f331ad-70-153-208-49.traefik.me"], // Add your MinIO host here, e.g. "minio.yourdomain.com" for production
  },
  // Configure Turbopack root explicitly to silence workspace root inference warnings
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
