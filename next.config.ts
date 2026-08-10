import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/wz-int-swe-best-practices",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
