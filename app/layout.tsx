import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

/**
 * Self-hosted Google Font via next/font — avoids an extra network request
 * to Google Fonts at runtime, improving load speed and avoiding layout
 * shift from late-loading fonts (both good for SEO/Core Web Vitals).
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://jobupdatesindia.com";

/**
 * Site-wide default metadata. Individual pages (job detail, category,
 * company) override `title` and `description` via their own
 * `generateMetadata()` for richer, page-specific SEO.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Job Updates India | Latest Jobs, Walk-ins & Internships",
    template: "%s | Job Updates India",
  },
  description:
    "Find the latest job openings across India — full-time, remote, internships, and walk-in drives. Updated daily from LinkedIn, Naukri, Indeed, and top companies.",
  keywords: [
    "jobs in india",
    "latest jobs",
    "job updates india",
    "freshers jobs",
    "walk-in interviews",
    "remote jobs india",
    "it jobs india",
  ],
  authors: [{ name: "Job Updates India" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Job Updates India",
    title: "Job Updates India | Latest Jobs, Walk-ins & Internships",
    description:
      "Find the latest job openings across India — full-time, remote, internships, and walk-in drives, updated daily.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Updates India | Latest Jobs, Walk-ins & Internships",
    description:
      "Find the latest job openings across India — full-time, remote, internships, and walk-in drives, updated daily.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d4ed8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en-IN" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        {/* Skip link for keyboard/screen-reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-card focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <Footer />

        {/* Google AdSense */}
        {adsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

      </body>
    </html>
  );
}
