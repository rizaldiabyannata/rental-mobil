import path from "node:path";
import { fileURLToPath } from "node:url";
import createNextIntlPlugin from 'next-intl/plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", process.env.MINIO_ENDPOINT],
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.MINIO_ENDPOINT,
        port: process.env.MINIO_PORT,
        pathname: "/reborn-lombok/**",
      },
    ],
  },
  // Configure Turbopack root explicitly to silence workspace root inference warnings
  turbopack: {
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
