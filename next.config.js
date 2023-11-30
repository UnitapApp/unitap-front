/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig
