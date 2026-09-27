/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // /contractors was an invented directory (removed); send old links to the contact page
  async redirects() {
    return [{ source: '/contractors', destination: '/contact', permanent: true }]
  },
}

export default nextConfig
