"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase } from "lucide-react";
import type { JobType } from "@/types/job";

const JOB_TYPES: JobType[] = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Remote",
  "Walk-in",
];

interface SearchBarProps {
  /** Pre-fills the form, e.g. when arriving on /jobs?search=react */
  defaultSearch?: string;
  defaultLocation?: string;
  defaultJobType?: string;
}

/**
 * Search + filter bar used on the homepage hero and the /jobs listing page.
 *
 * On submit, it navigates to /jobs with the chosen filters encoded as query
 * params (e.g. /jobs?search=developer&location=Bangalore&jobType=Remote).
 * The /jobs page reads these via `searchParams` and applies them with
 * `filterJobs()` from lib/jobService.ts.
 *
 * Client Component — needs interactive form state and client-side navigation.
 */
export default function SearchBar({
  defaultSearch = "",
  defaultLocation = "",
  defaultJobType = "",
}: SearchBarProps) {
  const router = useRouter();

  const [search, setSearch] = useState(defaultSearch);
  const [location, setLocation] = useState(defaultLocation);
  const [jobType, setJobType] = useState(defaultJobType);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (location.trim()) params.set("location", location.trim());
    if (jobType) params.set("jobType", jobType);

    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-3"
      role="search"
      aria-label="Search jobs"
    >
      {/* Job title / keyword search */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Job title, company, or skill"
          className="form-input !pl-10 !border-0 sm:!border"
          aria-label="Job title, company, or skill"
        />
      </div>

      {/* Location */}
      <div className="relative flex-1">
        <MapPin
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (e.g. Bangalore)"
          className="form-input !pl-10 !border-0 sm:!border"
          aria-label="Location"
        />
      </div>

      {/* Job type */}
      <div className="relative flex-1 sm:max-w-[180px]">
        <Briefcase
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="form-input !pl-10 !border-0 appearance-none sm:!border"
          aria-label="Job type"
        >
          <option value="">All Job Types</option>
          {JOB_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto">
        <Search size={16} />
        Search Jobs
      </button>
    </form>
  );
}