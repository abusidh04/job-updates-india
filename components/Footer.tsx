import Link from "next/link";
import Image from "next/image";
import { Briefcase, Linkedin, Mail, Instagram } from "lucide-react";

/**
 * Site-wide footer.
 * Server Component (no interactivity needed) — keeps it fast and SEO-friendly,
 * since footer links also help search engines discover category/company pages.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-border bg-surface-muted">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + description */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Job Updates India"
                width={40}
                height={40}
                className="rounded-card"/>
                <span className="text-lg font-bold text-slate-900">
                    Job Updates <span className="text-brand-700">India</span>
                </span>
            </Link>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Daily job updates for freshers and professionals across India —
              curated from LinkedIn, Naukri, Indeed, and official company
              career pages.
            </p>

            {/* Social links */}
            <div className="mt-4 flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-card border border-surface-border bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
              >
                <Linkedin size={16} />
              </a>

              <a
                href="https://www.instagram.com/job_updates_in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-card border border-surface-border bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
              >
                <Instagram size={16} />
              </a>

              <a
                href="mailto:abusidh05@gmail.com"
                aria-label="Email us"
                className="flex h-9 w-9 items-center justify-center rounded-card border border-surface-border bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Quick Links
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:text-brand-700">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/jobs" className="hover:text-brand-700">
                  All Jobs
                </Link>
              </li>

              <li>
                <Link href="/admin/login" className="hover:text-brand-700">
                  Admin Login
                </Link>
              </li>

              <li>
                <Link href="/privacy" className="hover:text-brand-700">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/about" className="hover:text-brand-700">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-600">
                Contact Us
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Popular Categories
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/category/Full-time" className="hover:text-brand-700">
                  Full-time Jobs
                </Link>
              </li>

              <li>
                <Link href="/category/Remote" className="hover:text-brand-700">
                  Remote Jobs
                </Link>
              </li>

              <li>
                <Link href="/category/Internship" className="hover:text-brand-700">
                  Internships
                </Link>
              </li>

              <li>
                <Link href="/category/Walk-in" className="hover:text-brand-700">
                  Walk-in Drives
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">About</h3>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Job Updates India is an aggregator. All applications are
              processed externally on the original job platform or company
              website — we never charge candidates for job listings.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-surface-border pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {currentYear} Job Updates India. All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Made for job seekers across India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
