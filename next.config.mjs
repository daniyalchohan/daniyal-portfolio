/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true,
    domains: ['via.placeholder.com'],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/daniyal-portfolio' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/daniyal-portfolio/' : '',
};

export default nextConfig;
