/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence warning when multiple lockfiles exist higher up the tree
  experimental: {
    turbopack: {
      root: new URL(".", import.meta.url).pathname,
    },
  },
};

export default nextConfig;
