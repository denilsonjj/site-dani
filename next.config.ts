import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "aquijofpgzzvniavvfmq.supabase.co",
        pathname: "/storage/v1/object/public/**",
        protocol: "https",
      },
      {
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
