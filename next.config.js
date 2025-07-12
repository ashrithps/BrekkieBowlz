/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'unsplash.com'],
  },
  experimental: {
    allowedDevOrigins: ['100.98.204.74'],
  },
}

module.exports = nextConfig