import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  },
};

export default nextConfig;
