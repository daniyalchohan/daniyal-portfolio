/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['via.placeholder.com'],
  },
  basePath: '/daniyal-portfolio',
  assetPrefix: '/daniyal-portfolio/',
};

export default nextConfig;
