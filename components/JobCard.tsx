import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  MapPin,
  Briefcase,
  IndianRupee,
  ExternalLink,
  Building2,
} from "lucide-react";
import type { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
}

/**
 * Displays a single job posting as a card.
 * Used on the homepage, /jobs listing, /category/[category], and
 * /company/[company] pages.
 *
 * Server Component — no client-side interactivity needed, which keeps
 * job listing pages fast and fully crawlable by search engines.
 */
export default function JobCard({ job }: JobCardProps) {
  const shortDescription = truncateWords(job.description, 100);
  const postedLabel = safeFormatDistanceToNow(job.postedAt);

  return (
    <article className="card flex h-full flex-col p-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-card border border-surface-border bg-surface-muted">
          {job.logo ? (
            <Image
              src={job.logo}
              alt={`${job.company} logo`}
              fill
              sizes="48px"
              className="object-contain p-1.5"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <Building2 size={20} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900">
            <Link href={`/jobs/${job.slug}`} className="hover:text-brand-700">
              {job.title}
            </Link>
          </h3>

          <p className="truncate text-sm text-slate-600">{job.company}</p>
        </div>

        <span className="badge shrink-0">{job.jobType}</span>
      </div>

      {/* Meta */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={15} className="text-brand-700" />
          {job.location}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Briefcase size={15} className="text-brand-700" />
          {job.experience}
        </span>

        {job.salary && (
          <span className="inline-flex items-center gap-1.5">
            <IndianRupee size={15} className="text-brand-700" />
            {job.salary}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
        {shortDescription}
      </p>

      {/* Skills */}
      {job.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-5 flex flex-1 items-end justify-between gap-3 border-t border-surface-border pt-4">
        <span className="text-xs text-slate-500">
          Posted {postedLabel}
        </span>

        <div className="flex items-center gap-2">
          <Link
            href={`/jobs/${job.slug}`}
            className="btn-secondary !px-3 !py-2 text-xs"
          >
            View Details
          </Link>

          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="btn-primary !px-3 !py-2 text-xs inline-flex items-center gap-1"
          >
            Apply Now
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </article>
  );
}

/**
 * Truncates text to a maximum number of words.
 */
function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) return text;

  return `${words.slice(0, maxWords).join(" ")}…`;
}

/**
 * Formats the posted date.
 */
function safeFormatDistanceToNow(isoDate: string): string {
  try {
    return formatDistanceToNow(new Date(isoDate), {
      addSuffix: true,
    });
  } catch {
    return "recently";
  }
}