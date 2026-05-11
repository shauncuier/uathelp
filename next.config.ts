import type { NextConfig } from "next";
import { siteConfig } from "@/config/site";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(siteConfig.url).hostname,
      },
    ],
  },
};

export default nextConfig;
