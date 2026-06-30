import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * React Strict Mode helps catch potential problems during development.
   */
  reactStrictMode: true,

  /**
   * Image optimization settings.
   * Company logos are often hosted externally (LinkedIn, Naukri, Indeed,
   * company CDNs, Firebase Storage, etc.), so we allow remote patterns
   * broadly here. Tighten this list to your actual logo sources in
   * production for better security.
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Modern formats for smaller, faster-loading logo images
    formats: ["image/avif", "image/webp"],
  },

  /**
   * Adds recommended security headers site-wide.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;