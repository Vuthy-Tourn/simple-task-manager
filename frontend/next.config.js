/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig