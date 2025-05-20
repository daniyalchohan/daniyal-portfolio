/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  // Remove basePath and assetPrefix if you're deploying to the root domain
  // If you're deploying to a subdirectory, keep these
  // basePath: '/daniyal-portfolio',
  // assetPrefix: '/daniyal-portfolio/',
};

export default nextConfig;
