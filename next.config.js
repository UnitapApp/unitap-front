const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
})



/** @type {import('next').NextConfig} */
const nextConfig =withBundleAnalyzer({
  compiler: {
    styledComponents: true,
  },
  redirects() {
    return [
      {
        source: "/gas-tap",
        destination: "/gastap",
        permanent: true,
      },
      {
        source: "/token-tap",
        destination: "/tokentap",
        permanent: true,
      },
      {
        source: "/prize-tap",
        destination: "/prizetap",
        permanent: true,
      },
    ];
  },
});

module.exports = nextConfig;
