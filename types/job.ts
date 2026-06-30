/**
 * Job types supported by the portal.
 * Used for the jobType field, filter dropdowns, and badge labels.
 */
export type JobType =
  | "Full-time"
  | "Part-time"
  | "Internship"
  | "Contract"
  | "Remote"
  | "Walk-in";

/**
 * Where the job listing originates from / where the Apply Now button
 * should redirect the user to.
 */
export type JobSource = "LinkedIn" | "Naukri" | "Indeed" | "Company Website" | "Other";

/**
 * Core Job entity — mirrors the structure of a document in the
 * Firestore "jobs" collection.
 *
 * `id` and `slug` are generated/assigned at creation time:
 * - `id`   -> the Firestore document ID (used for edit/delete operations)
 * - `slug` -> a URL-friendly string (e.g. "frontend-developer-infosys-bangalore")
 *             used for the public SEO route /jobs/[slug]
 */
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string; // e.g. "0-1 years", "3-5 years", "Fresher"
  salary?: string; // optional, e.g. "₹4,00,000 - ₹6,00,000 / year"
  jobType: JobType;
  description: string; // short description, ~100 words, shown on card + detail page
  skills: string[]; // e.g. ["React", "TypeScript", "Node.js"]
  applyLink: string; // external URL: LinkedIn / Naukri / Indeed / company careers page
  source: JobSource;
  logo: string; // URL to the company logo image
  postedAt: string; // ISO date string, e.g. "2026-06-15T00:00:00.000Z"
  slug: string;
}

/**
 * Shape used when creating or editing a job via the admin dashboard form.
 * Omits `id` (assigned by Firestore) and `slug` (auto-generated from
 * title + company at submit time).
 */
export type JobFormValues = Omit<Job, "id" | "slug">;

/**
 * Optional filters used by the public /jobs listing page and Firestore
 * queries in lib/jobService.ts.
 */
export interface JobFilters {
  search?: string;
  category?: string; // matches against jobType or a skill/category tag
  company?: string;
  location?: string;
}