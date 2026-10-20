import type { NextConfig } from 'next';

const isDevelopment = process.env.NODE_ENV === 'development';

const config: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  cacheMaxMemorySize: 0,
  // Assets are prepared as WebP by scripts/prepare-assets.mjs. Runtime image
  // conversion exhausts the 256 MiB container when several screenshots load.
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'${isDevelopment ? ' ws: wss:' : ''}; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`,
          },
          { key: 'X-Accel-Buffering', value: 'no' },
        ],
      },
    ];
  },
};
export default config;
