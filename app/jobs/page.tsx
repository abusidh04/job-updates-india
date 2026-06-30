import type { Metadata } from "next";
import { Fragment } from "react";
import { Briefcase } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import JobCard from "@/components/JobCard";
import GoogleAd from "@/components/GoogleAd";
import { getAllJobs, filterJobs } from "@/lib/jobService";

interface JobsPageProps {
  searchParams: Promise<{
    search?: string;
    location?: string;
    jobType?: string;
  }>;
}

/**
 * Dynamic SEO metadata based on the active search/filter query params,
 * e.g. searching "react developer" in "Bangalore" produces a unique,
 * descriptive title instead of a generic "All Jobs" title every time.
 */
export async function generateMetadata({
  searchParams,
}: JobsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const parts: string[] = [];
  if (params.search) parts.push(params.search);
  if (params.jobType) parts.push(params.jobType);
  if (params.location) parts.push(`in ${params.location}`);

  const title = parts.length > 0 ? `${parts.join(" ")} Jobs` : "All Jobs";

  return {
    title,
    description:
      "Browse all current job openings in India. Filter by title, location, and job type — updated daily from LinkedIn, Naukri, Indeed, and top companies.",
  };
}

/**
 * /jobs — full job listing page with search and filters.
 * Server Component: reads filters from the URL query string, fetches all
 * jobs from Firestore, and filters them server-side before rendering —
 * keeping results fully crawlable and shareable via URL.
 */
export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const allJobs = await getAllJobs();

  const filteredJobs = filterJobs(allJobs, {
    search: params.search,
    location: params.location,
    jobType: params.jobType,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <Briefcase className="text-brand-700" size={26} />
          All Jobs
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {filteredJobs.length} job{filteredJobs.length === 1 ? "" : "s"} found
          {params.search ? ` for "${params.search}"` : ""}
        </p>
      </div>

      {/* Search/filter bar, pre-filled with current query params */}
      <SearchBar
        defaultSearch={params.search}
        defaultLocation={params.location}
        defaultJobType={params.jobType}
      />

      {/* Header ad */}
      <div className="mt-6">
        <GoogleAd slotType="header" />
      </div>

      {/* Main content: job grid + sidebar ad */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        {/* Job results */}
        <div>
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredJobs.map((job, index) => (
                <Fragment key={job.id}>
                  <JobCard job={job} />
                  {/* Insert an in-feed ad after every 6 job cards */}
                  {(index + 1) % 6 === 0 && (
                    <div className="sm:col-span-2 xl:col-span-3">
                      <GoogleAd slotType="in-feed" />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
              <p className="font-medium text-slate-700">No jobs match your search</p>
              <p className="mt-1 text-sm text-slate-500">
                Try adjusting your filters or search with different keywords.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar ad — sticky on large screens */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <GoogleAd slotType="sidebar" />
          </div>
        </aside>
      </div>

      {/* Footer ad */}
      <div className="mt-10">
        <GoogleAd slotType="footer" />
      </div>
    </div>
  );
}