/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.doohub.com'],
  },
};

module.exports = nextConfig;

