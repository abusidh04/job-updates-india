"use client";

import { useEffect, useRef } from "react";

/**
 * Extend the global Window interface so TypeScript knows about the
 * `adsbygoogle` array that the AdSense script pushes ad requests into.
 */
declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

type AdSlotType = "header" | "sidebar" | "in-feed" | "footer";

interface GoogleAdProps {
  /** Which placement this ad occupies — controls default sizing. */
  slotType: AdSlotType;
  /**
   * The AdSense ad unit slot ID from your AdSense dashboard.
   * Leave undefined to render a visual placeholder only (useful before
   * your AdSense account is approved/configured).
   */
  adSlot?: string;
  className?: string;
}

/**
 * Default min-heights per placement so the layout doesn't shift once real
 * ads load (avoids Cumulative Layout Shift, which hurts SEO/Core Web Vitals).
 */
const SLOT_DIMENSIONS: Record<AdSlotType, string> = {
  header: "min-h-[90px]",
  sidebar: "min-h-[250px]",
  "in-feed": "min-h-[120px]",
  footer: "min-h-[90px]",
};

const SLOT_LABELS: Record<AdSlotType, string> = {
  header: "Header Ad",
  sidebar: "Sidebar Ad",
  "in-feed": "Advertisement",
  footer: "Footer Ad",
};

/**
 * Reusable Google AdSense placeholder/unit.
 *
 * Usage:
 *   <GoogleAd slotType="header" adSlot="1234567890" />
 *
 * Until NEXT_PUBLIC_ADSENSE_CLIENT_ID and a real `adSlot` are provided,
 * this renders a clearly labeled placeholder box that reserves the correct
 * amount of space — so the layout looks finished now and "just works" once
 * your AdSense account is approved and slot IDs are added.
 *
 * The actual AdSense script (`adsbygoogle.js`) is loaded once, site-wide,
 * in app/layout.tsx.
 */
export default function GoogleAd({ slotType, adSlot, className = "" }: GoogleAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isConfigured = Boolean(clientId && adSlot);

  useEffect(() => {
    if (!isConfigured) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      // Fails silently in dev / when ad blockers are active — never break the page.
      console.error("AdSense push failed:", error);
    }
  }, [isConfigured]);

  if (!isConfigured) {
    // Placeholder shown when AdSense isn't configured yet.
    return (
      <div
        className={`flex w-full items-center justify-center rounded-card border border-dashed border-surface-border bg-surface-muted ${SLOT_DIMENSIONS[slotType]} ${className}`}
        aria-hidden="true"
      >
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {SLOT_LABELS[slotType]} Placeholder
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <ins
        ref={adRef}
        className={`adsbygoogle block ${SLOT_DIMENSIONS[slotType]}`}
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}