import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Tag } from "lucide-react";
import JobCard from "@/components/JobCard";
import GoogleAd from "@/components/GoogleAd";
import { getJobsByCategory } from "@/lib/jobService";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

/**
 * Generates SEO metadata specific to the category being viewed,
 * e.g. "Remote Jobs in India | Job Updates India".
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryLabel = decodeURIComponent(category);

  return {
    title: `${categoryLabel} Jobs in India`,
    description: `Browse the latest ${categoryLabel} job openings across India. Updated daily from LinkedIn, Naukri, Indeed, and top companies.`,
  };
}

/**
 * /category/[category] — lists all jobs matching a given jobType
 * (e.g. "Full-time", "Remote", "Internship", "Walk-in").
 *
 * Server Component, statically crawlable, with its own SEO metadata —
 * each category page can independently rank in search results for
 * queries like "remote jobs india" or "walk-in interviews bangalore".
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryLabel = decodeURIComponent(category);

  const jobs = await getJobsByCategory(categoryLabel);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <ChevronRight size={14} />
        <span className="text-slate-700">{categoryLabel} Jobs</span>
      </nav>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <Tag className="text-brand-700" size={24} />
          {categoryLabel} Jobs
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {jobs.length} {categoryLabel.toLowerCase()} job{jobs.length === 1 ? "" : "s"} currently
          open across India
        </p>
      </div>

      <GoogleAd slotType="header" className="mb-8" />

      {/* Job grid */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
          <p className="font-medium text-slate-700">
            No {categoryLabel.toLowerCase()} jobs available right now
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Check back soon, or{" "}
            <Link href="/jobs" className="text-brand-700 hover:underline">
              browse all jobs
            </Link>{" "}
            instead.
          </p>
        </div>
      )}

      <GoogleAd slotType="footer" className="mt-10" />
    </div>
  );
}