import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // The admin inbox is never linked from the public site and must not be
        // indexed. The real protection is the session check; these headers keep
        // the URL and its referrer out of crawlers and outbound requests.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
