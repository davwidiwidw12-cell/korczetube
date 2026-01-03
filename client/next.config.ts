import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:4000/uploads/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/:path*', // Proxy API requests as well if needed, but axios usually handles it via baseURL
      },
    ];
  },
};

export default nextConfig;
