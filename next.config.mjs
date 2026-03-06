/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["bcrypt", "sharp"],
  },
};

export default nextConfig;
