import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.GO_API_ORIGIN}/api/:path*`, // e.g. http://localhost:8080
      },
    ];
  },
};
export default nextConfig;
