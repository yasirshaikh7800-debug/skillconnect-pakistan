import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // allowedDevOrigins requires Next.js 15.3+; 15.0.3 ignores it with a warning.
  // The preview renders fine without it. Uncomment after upgrading Next.js:
  // allowedDevOrigins: process.env.BASE44_PUBLIC_HOST_SUFFIX
  //   ? ['3000-' + process.env.BASE44_PUBLIC_HOST_SUFFIX]
  //   : [],
};

export default nextConfig;
