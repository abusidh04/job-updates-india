import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jobupdatesindia.com";

/**
 * Auto-generates robots.txt at /robots.txt
 * Tells search engine crawlers which pages to index and which to skip.
 * Admin pages are blocked from crawling for security.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all search engines to crawl public pages
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",        // Block admin dashboard from indexing
          "/api/",          // Block any API routes
        ],
      },
    ],
    // Tell Google where to find your sitemap
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}