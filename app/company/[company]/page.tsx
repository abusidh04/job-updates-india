import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Building2 } from "lucide-react";
import JobCard from "@/components/JobCard";
import GoogleAd from "@/components/GoogleAd";
import { getJobsByCompany } from "@/lib/jobService";

interface CompanyPageProps {
  params: Promise<{ company: string }>;
}

/**
 * Converts a URL slug like "tata-consultancy-services" back into a
 * readable label like "Tata Consultancy Services" for use as a fallback
 * before we know the company's actual casing from Firestore data.
 */
function slugToLabel(slug: string): string {
  return decodeURIComponent(slug)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generates SEO metadata for the company page, using the real company
 * name (correct casing) pulled from the first matching job, if available.
 */
export async function generateMetadata({
  params,
}: CompanyPageProps): Promise<Metadata> {
  const { company } = await params;
  const jobs = await getJobsByCompany(company);
  const companyName = jobs[0]?.company ?? slugToLabel(company);

  return {
    title: `${companyName} Careers & Job Openings`,
    description: `Explore current job openings at ${companyName}. Apply directly via LinkedIn, Naukri, Indeed, or the official ${companyName} careers page.`,
  };
}

/**
 * /company/[company] — lists all jobs posted by a specific company.
 *
 * The [company] URL segment is a slug (e.g. "infosys",
 * "tata-consultancy-services") derived from the company name. Matching
 * is handled in lib/jobService.ts's getJobsByCompany().
 */
export default async function CompanyPage({ params }: CompanyPageProps) {
  const { company } = await params;
  const jobs = await getJobsByCompany(company);
  const companyName = jobs[0]?.company ?? slugToLabel(company);
  const companyLogo = jobs[0]?.logo;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <ChevronRight size={14} />
        <span className="text-slate-700">{companyName}</span>
      </nav>

      {/* Company header */}
      <div className="card mb-8 flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-card border border-surface-border bg-surface-muted">
          {companyLogo ? (
            <Image
              src={companyLogo}
              alt={`${companyName} logo`}
              fill
              sizes="64px"
              className="object-contain p-2"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <Building2 size={26} />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{companyName}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {jobs.length} open position{jobs.length === 1 ? "" : "s"} at {companyName}
          </p>
        </div>
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
            No open positions at {companyName} right now
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