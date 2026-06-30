import type { MetadataRoute } from "next";
import { getAllJobs } from "@/lib/jobService";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jobupdatesindia.com";

/**
 * Auto-generates sitemap.xml at /sitemap.xml
 * Next.js serves this automatically — no manual file needed.
 * Google uses this to discover and index all your job pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all jobs for dynamic job detail URLs
  const jobs = await getAllJobs();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/category/Full-time`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/category/Remote`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/category/Internship`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/category/Part-time`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/category/Contract`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/category/Walk-in`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  // Dynamic job detail pages
  const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${siteUrl}/jobs/${job.slug}`,
    lastModified: new Date(job.postedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Get unique companies for company pages
  const uniqueCompanies = [...new Set(jobs.map((job) => job.company))];
  const companyPages: MetadataRoute.Sitemap = uniqueCompanies.map((company) => ({
    url: `${siteUrl}/company/${company.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...jobPages, ...companyPages];
}