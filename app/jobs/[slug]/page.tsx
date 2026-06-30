import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Calendar,
  ExternalLink,
  Building2,
  ChevronRight,
} from "lucide-react";
import JobCard from "@/components/JobCard";
import GoogleAd from "@/components/GoogleAd";
import { getJobBySlug, getAllJobs } from "@/lib/jobService";

interface Props {
  params: Promise<{ slug: string }>;
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://jobupdatesindia.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Job Not Found" };
  return {
    title: `${job.title} at ${job.company} — ${job.location}`,
    description: job.description.slice(0, 155),
    alternates: { canonical: `${siteUrl}/jobs/${job.slug}` },
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: job.description.slice(0, 155),
      type: "article",
      url: `${siteUrl}/jobs/${job.slug}`,
      images: job.logo ? [{ url: job.logo }] : undefined,
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const allJobs = await getAllJobs();
  const relatedJobs = allJobs
    .filter((j) => j.id !== job.id && j.jobType === job.jobType)
    .slice(0, 3);

  const postedLabel = formatDistanceToNow(new Date(job.postedAt), {
    addSuffix: true,
  });
  const postedDateFormatted = format(new Date(job.postedAt), "dd MMM yyyy");

  const jsonLdString = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAt,
    employmentType: job.jobType.toUpperCase().replace("-", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      logo: job.logo || undefined,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "IN",
      },
    },
  });

  const applyLink = job.applyLink;
  const source = job.source;
  const logo = job.logo;
  const title = job.title;
  const company = job.company;
  const location = job.location;
  const experience = job.experience;
  const salary = job.salary;
  const jobType = job.jobType;
  const description = job.description;
  const skills = job.skills;
  const companySlug = job.company.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      <nav
        className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-brand-700">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link href="/jobs" className="hover:text-brand-700">
          Jobs
        </Link>
        <ChevronRight size={14} />
        <span className="truncate text-slate-700">{title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-card border border-surface-border bg-surface-muted">
                {logo ? (
                  <Image
                    src={logo}
                    alt={`${company} logo`}
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

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {title}
                </h1>
                <Link
                  href={`/company/${companySlug}`}
                  className="mt-1 inline-block text-base font-medium text-brand-700 hover:underline"
                >
                  {company}
                </Link>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} className="text-brand-700" />
                    {location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase size={15} className="text-brand-700" />
                    {experience}
                  </span>
                  {salary && (
                    <span className="inline-flex items-center gap-1.5">
                      <IndianRupee size={15} className="text-brand-700" />
                      {salary}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={15} className="text-brand-700" />
                    Posted {postedLabel} ({postedDateFormatted})
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="badge">{jobType}</span>
                  <span className="badge bg-slate-100 text-slate-600">
                    via {source}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-surface-border pt-5">
  <a
    href={applyLink}
    target="_blank"
    rel="noopener noreferrer nofollow sponsored"
    className="btn-primary inline-flex w-full items-center justify-center gap-2 sm:w-auto"
  >
    Apply Now on {source}
    <ExternalLink size={16} />
  </a>

  <p className="mt-2 text-xs text-slate-500">
    You&apos;ll be redirected to {source} to complete your application.
  </p>
</div>
          </div>

          <div className="my-6">
            <GoogleAd slotType="in-feed" />
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Job Description
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {description}
            </p>

            {skills.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-900">
                  Required Skills
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card mt-6 flex flex-col items-center gap-3 p-6 text-center">
  <p className="text-sm font-medium text-slate-700">
    Interested in this role at {company}?
  </p>

  <a
    href={applyLink}
    target="_blank"
    rel="noopener noreferrer nofollow sponsored"
    className="btn-primary inline-flex items-center gap-2"
  >
    Apply Now on {source}
    <ExternalLink size={16} />
  </a>
</div>
        </div>

        <aside className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <GoogleAd slotType="sidebar" />
            {relatedJobs.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Similar {jobType} Jobs
                </h3>
                <div className="space-y-4">
                  {relatedJobs.map((relatedJob) => (
                    <JobCard key={relatedJob.id} job={relatedJob} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}