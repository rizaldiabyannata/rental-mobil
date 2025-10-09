/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence warning when multiple lockfiles exist higher up the tree
  experimental: {
    turbopack: {
      // Use process.cwd() for reliable Windows path
      root: process.cwd(),
    },
  },
};

export default nextConfig;
