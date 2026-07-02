export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>

      <div className="prose prose-slate max-w-none space-y-6 text-sm text-slate-700 leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Introduction</h2>
          <p>Job Updates India ("we", "us", or "our") operates the website https://jobsin.vercel.app. This Privacy Policy explains how we collect, use, and protect your information when you visit our website.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">2. Information We Collect</h2>
          <p>We do not collect any personal information from visitors. We use Google Analytics and Google AdSense which may collect anonymized usage data such as pages visited, time spent, and general location (country/city level).</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">3. Google AdSense & Cookies</h2>
          <p>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-brand-700 hover:underline">Google Ads Settings</a>.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Job Listings</h2>
          <p>All job listings on Job Updates India are aggregated from public sources including LinkedIn, Naukri, Indeed, and official company career pages. We do not process any job applications — all applications are handled externally on the original platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">5. Third Party Links</h2>
          <p>Our website contains links to external job platforms. We are not responsible for the privacy practices or content of those websites.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">6. Children's Privacy</h2>
          <p>Our website is not directed at children under 13. We do not knowingly collect information from children.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, contact us at: <a href="mailto:contact@jobsin.vercel.app" className="text-brand-700 hover:underline">contact@jobsin.vercel.app</a></p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">8. Updates</h2>
          <p>This Privacy Policy was last updated on {new Date().getFullYear()}. We may update it from time to time.</p>
        </section>

      </div>
    </div>
  );
}