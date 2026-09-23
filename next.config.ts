import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // GameDistribution's CDN doesn't reliably answer Next's image-optimizer
    // proxy fast enough at catalog scale (thousands of distinct thumbnails,
    // one grid page can request 60-100 at once) — it times out even though
    // the images themselves load fine directly in a browser. Skip the
    // optimization proxy and let the browser fetch them straight from the
    // source CDN instead.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.gamedistribution.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "img.gamepix.com",
      },
    ],
  },
};

export default nextConfig;
