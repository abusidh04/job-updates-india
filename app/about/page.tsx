import Link from "next/link";
import { Briefcase, ShieldCheck, Globe, Users } from "lucide-react";

export const metadata = {
  title: "About Us | Job Updates India",
  description:
    "Learn more about Job Updates India, our mission, and how we help job seekers find the latest opportunities across India.",
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="border-b border-surface-border bg-surface-muted">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-slate-900">
            About Job Updates India
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Job Updates India is a platform dedicated to helping freshers,
            students, and experienced professionals discover the latest job
            opportunities from trusted companies across India.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-surface-border p-6">
            <Briefcase className="h-10 w-10 text-brand-700" />

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              Our Mission
            </h2>

            <p className="mt-3 text-slate-600">
              Our mission is to make job searching simple by collecting genuine
              job opportunities from trusted sources and presenting them in one
              place.
            </p>
          </div>

          <div className="rounded-xl border border-surface-border p-6">
            <ShieldCheck className="h-10 w-10 text-brand-700" />

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              Trusted Sources
            </h2>

            <p className="mt-3 text-slate-600">
              We share jobs from official company career pages, LinkedIn,
              Naukri, Indeed, and other trusted recruitment platforms.
            </p>
          </div>

          <div className="rounded-xl border border-surface-border p-6">
            <Users className="h-10 w-10 text-brand-700" />

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              Free for Everyone
            </h2>

            <p className="mt-3 text-slate-600">
              Job Updates India never charges candidates for viewing job
              postings. All applications are submitted through the original
              employer or recruitment platform.
            </p>
          </div>
        </div>

        <div className="mt-16 rounded-2xl bg-surface-muted p-8">
          <div className="flex items-center gap-3">
            <Globe className="h-8 w-8 text-brand-700" />

            <h2 className="text-2xl font-bold text-slate-900">
              Why Choose Job Updates India?
            </h2>
          </div>

          <ul className="mt-6 list-disc space-y-3 pl-6 text-slate-600">
            <li>Latest fresher and experienced job updates.</li>
            <li>Remote, Internship, Full-time and Walk-in opportunities.</li>
            <li>Clean and easy-to-use job portal.</li>
            <li>Daily updates from trusted companies.</li>
            <li>No registration required to browse jobs.</li>
            <li>Completely free to use.</li>
          </ul>

          <div className="mt-8">
            <Link
              href="/jobs"
              className="inline-flex rounded-lg bg-brand-700 px-6 py-3 font-medium text-white transition hover:bg-brand-800"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
