import Link from "next/link";
import { Mail, Instagram } from "lucide-react";

export const metadata = {
  title: "Contact Us | Job Updates India",
  description:
    "Get in touch with Job Updates India for questions, feedback, or to report issues with job listings.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="card p-8">
        <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>

        <p className="mt-4 text-slate-600 leading-7">
          We'd love to hear from you! If you have any questions, feedback, or
          would like to report an issue with a job listing, feel free to contact
          us using the details below.
        </p>

        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-brand-50 p-3">
              <Mail className="h-6 w-6 text-brand-700" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Email</h2>
              <a
                href="mailto:abusidh05@gmail.com"
                className="text-brand-700 hover:underline"
              >
                abusidh05@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-full bg-brand-50 p-3">
              <Instagram className="h-6 w-6 text-brand-700" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Instagram</h2>
              <Link
                href="https://www.instagram.com/job_updates_in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 hover:underline"
              >
                @job_updates_in
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-5">
          <h3 className="font-semibold text-slate-900">Support</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            We aim to respond to all genuine inquiries as soon as possible.
            Please note that Job Updates India only shares job opportunities and
            does not process applications or recruitment on behalf of employers.
          </p>
        </div>
      </div>
    </main>
  );
}
