/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

// If your app is in a subfolder, e.g. https://example.com/myapp,
// set BASE_PATH to '/myapp' during build. If deployed at domain root, leave ''.
const base = process.env.NEXT_BASEPATH || '';

module.exports = {
  output: 'export',          // 👈 generate static HTML (no SSR)
  trailingSlash: true,       // so /about -> /about/index.html
  images: { unoptimized: true }, // next/image works in static export
  basePath: base,            // e.g. '/myapp' on cPanel subfolder deploys
  assetPrefix: base ? `${base}/` : undefined,
};
