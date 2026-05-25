/** @type {import('next').NextConfig} **/

const nextConfig = {
  // Performance - Strict mode do React
  reactStrictMode: true,

  // Output otimizado para Vercel
  output: 'standalone',

  // Otimização de build
  compress: true, // Performance - PoweredByHeader desabilitado
  poweredByHeader: false,

  // Otimização de imagens
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // 60 segundos = 1 minuto
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Rewrites para URLs mais limpas (compatibilidade reversa mantida)
  async rewrites() {
    return [
      {
        source: '/api/visitors/:id/badge.svg',
        destination: '/api/visitors/:id/badge',
      },
      {
        source: '/api/clones/:id/badge.svg',
        destination: '/api/clones/:id/badge',
      },
      {
        source: '/api/clones/:id/unic/badge.svg',
        destination: '/api/unic-clones/:id/badge',
      },
      {
        source: '/api/clones/:id/unic',
        destination: '/api/unic-clones/:id',
      },
    ];
  },

  // Cabeçalhos de segurança e performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Segurança
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Performance
        ],
      },
      {
        source: '/svg/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
