/** @type {import('next').NextConfig} */
// GitHub Pages: if you publish to https://<user>.github.io/<repo>/,
// set NEXT_PUBLIC_BASE_PATH to "/<repo>" when building, e.g.:
//   NEXT_PUBLIC_BASE_PATH=/strategy-dashboard npm run build
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

module.exports = nextConfig;
