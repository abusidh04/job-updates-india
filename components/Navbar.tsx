"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Menu, X } from "lucide-react";
import Image from "next/image";

/**
 * Primary navigation links shown across the public site.
 * Centralized here so the desktop and mobile menus always stay in sync.
 */
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "All Jobs" },
  { href: "/category/Full-time", label: "Full-time" },
  { href: "/category/Remote", label: "Remote" },
  { href: "/category/Internship", label: "Internships" },
];

/**
 * Site-wide header/navigation bar.
 * Client Component because it manages mobile menu open/close state.
 */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / brand */}
        <Link href="/" className="flex items-center gap-2" aria-label="Job Updates India home">
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

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-card px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-surface-muted hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link href="/jobs" className="btn-primary">
            Browse Jobs
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex items-center justify-center rounded-card p-2 text-slate-700 hover:bg-surface-muted md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav panel */}
      {isMenuOpen && (
        <nav
          className="border-t border-surface-border bg-white px-4 py-3 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-card px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-surface-muted hover:text-brand-700"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/jobs"
              onClick={() => setIsMenuOpen(false)}
              className="btn-primary mt-2 justify-center"
            >
              Browse Jobs
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
