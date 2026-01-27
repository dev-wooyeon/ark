import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {},
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

// Bundle analyzer is optional - only use if ANALYZE=true
export default withMDX(nextConfig);
