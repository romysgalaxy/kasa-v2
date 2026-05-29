/** @type {import('next').NextConfig} */

// URL de l'API Express. Cote serveur (Server Components) on l'appelle en direct ;
// cote navigateur, on passe par les rewrites ci-dessous (meme origine, pas de CORS).
const API_URL = process.env.API_URL || 'http://localhost:3000';

const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${API_URL}/api/:path*` },
      { source: '/auth/:path*', destination: `${API_URL}/auth/:path*` },
      { source: '/uploads/:path*', destination: `${API_URL}/uploads/:path*` },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 's3-eu-west-1.amazonaws.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
