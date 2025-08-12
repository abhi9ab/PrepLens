import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['images.unsplash.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        encoding: false,
        canvas: false,
        module: false,
        dgram: false,
        dns: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    
    // Set canvas alias to false
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    
    // Ignore warnings from problematic modules
    config.ignoreWarnings = [
      { module: /node_modules\/face-api\.js/ },
      { module: /node_modules\/node-fetch/ },
      { module: /node_modules\/@tensorflow/ },
      { message: /Serializing big strings/ },
      { message: /Can't resolve 'encoding'/ },
      { message: /Can't resolve 'fs'/ },
      { message: /Critical dependency/ },
    ];
    
    // Add externals for server-side modules
    if (!isServer) {
      config.externals = {
        ...config.externals,
        canvas: 'canvas',
      };
    }
    
    return config;
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['face-api.js'],
  },
  
  // Transpile specific packages that might cause issues
  transpilePackages: ['face-api.js'],
};

export default nextConfig;