import { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: { styledComponents: true },
  basePath: "/quest",
  assetPrefix: "/quest",
  // trailingSlash: true,
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination: "https://api.unitap.app/api/:path*/",
      },
    ];
  },
  async redirects() {
    return [
      { source: "/gas-tap", destination: "/gastap", permanent: true },
      { source: "/token-tap", destination: "/tokentap", permanent: true },
      { source: "/prize-tap", destination: "/prizetap", permanent: true },
      {
        source: "/contribution-hub",
        destination: "/incentive-center",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
