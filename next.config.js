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