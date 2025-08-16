/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper build output for Vercel
  distDir: '.next',
  
  // Enable experimental features for better compatibility
  experimental: {
    appDir: true,
  },
  
  // Ensure proper image handling
  images: {
    unoptimized: true,
  },
  
  // Disable telemetry for production builds
  telemetry: false,
  
  // Ensure proper TypeScript handling
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Ensure proper ESLint handling
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Ensure proper webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
