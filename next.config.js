/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable Next.js image optimization
    remotePatterns: [],
    domains: [],
  },
  // Disable console statements in production
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Remove console statements in production builds
      config.optimization.minimizer = config.optimization.minimizer || [];
      
      // Add TerserPlugin to remove console statements
      const TerserPlugin = require('terser-webpack-plugin');
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // Remove console statements
              drop_debugger: true, // Remove debugger statements
            },
          },
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
