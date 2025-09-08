/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Built-in console removal
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'] // Keep console.error and console.warn for debugging
    } : false,
  },
  // Remove static export to allow API routes
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;