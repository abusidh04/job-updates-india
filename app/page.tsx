import Link from "next/link";
import { TrendingUp, Sparkles, Clock, ArrowRight, Laptop, GraduationCap, Building2, MapPinned } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import JobCard from "@/components/JobCard";
import GoogleAd from "@/components/GoogleAd";
import { getFeaturedJobs, getLatestJobs, getTotalJobsCount } from "@/lib/jobService";

/**
 * Quick category shortcuts shown below the hero.
 * Icons chosen to visually distinguish each job category at a glance.
 */
const CATEGORY_SHORTCUTS = [
  { label: "Remote Jobs", href: "/category/Remote", icon: Laptop },
  { label: "Internships", href: "/category/Internship", icon: GraduationCap },
  { label: "Full-time", href: "/category/Full-time", icon: Building2 },
  { label: "Walk-in Drives", href: "/category/Walk-in", icon: MapPinned },
];

/**
 * Homepage — Server Component.
 * Fetches featured + latest jobs directly from Firestore at request time
 * (Next.js will cache/revalidate this per the route's caching config),
 * so the page is fast and fully server-rendered for SEO.
 */
export default async function HomePage() {
  // Fetch in parallel for faster page load
  const [featuredJobs, latestJobs, totalJobs] = await Promise.all([
    getFeaturedJobs(6),
    getLatestJobs(8),
    getTotalJobsCount(),
  ]);

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero section                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-surface-border bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge mb-4 gap-1.5">
              <Sparkles size={13} />
              {totalJobs}+ jobs live right now
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Find Your Next Job, <span className="text-brand-700">Faster</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
              Daily updated job openings across India — full-time, remote,
              internships, and walk-in drives, all in one place.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-4xl">
            <SearchBar />
          </div>

          {/* Category shortcuts */}
          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORY_SHORTCUTS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="card flex flex-col items-center gap-2 px-3 py-4 text-center hover:border-brand-300"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-card bg-brand-50 text-brand-700">
                  <Icon size={18} />
                </span>
                <span className="text-sm font-medium text-slate-700">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Header ad slot                                                   */}
      {/* ---------------------------------------------------------------- */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <GoogleAd slotType="header" />
      </div>

      <script>(function(s){s.dataset.zone='11268792',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>

      {/* ---------------------------------------------------------------- */}
      {/* Featured jobs                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-brand-700" size={22} />
            <h2 className="text-xl font-semibold sm:text-2xl">Featured Jobs</h2>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            View all <ArrowRight size={15} />
          </Link>
        </div>

        {featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState message="No featured jobs available right now. Check back soon!" />
        )}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* In-feed ad slot                                                  */}
      {/* ---------------------------------------------------------------- */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GoogleAd slotType="in-feed" />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Latest jobs                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="text-brand-700" size={22} />
            <h2 className="text-xl font-semibold sm:text-2xl">Latest Jobs</h2>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            View all <ArrowRight size={15} />
          </Link>
        </div>

        {latestJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState message="No jobs posted yet. Visit the admin dashboard to add the first listing." />
        )}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Footer ad slot                                                   */}
      {/* ---------------------------------------------------------------- */}
      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <GoogleAd slotType="footer" />
      </div>
    </div>
  );
}

/** Simple empty-state message shown when a job section has no results. */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-12 text-center">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
