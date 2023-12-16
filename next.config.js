/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
