/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [],
    domains: [],
  },
  experimental: {
    // Disable static optimization for problematic pages
    skipTrailingSlashRedirect: true,
  },
  // Force all pages to be dynamic to avoid build issues
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Disable static optimization to prevent build failures
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  // webpack: (config, { dev, isServer }) => {
  //   if (!dev && !isServer) {
  //     config.optimization.minimizer = config.optimization.minimizer || [];
      
  //     const TerserPlugin = require('terser-webpack-plugin');
  //     config.optimization.minimizer.push(
  //       new TerserPlugin({
  //         terserOptions: {
  //           compress: {
  //             drop_console: true,
  //             drop_debugger: true,
  //           },
  //         },
  //       })
  //     );
  //   }
  //   return config;
  // },
};

module.exports = nextConfig;