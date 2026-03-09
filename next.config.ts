import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'react-code-test.s3.ap-southeast-2.amazonaws.com',
        pathname: '/logos/**',
      },
    ],
  },
};

export default nextConfig;
