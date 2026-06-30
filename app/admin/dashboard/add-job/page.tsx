"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { onAuthStateChanged } from "firebase/auth";
import { PlusCircle, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { addJob } from "@/lib/jobService";

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract", "Remote", "Walk-in"];
const JOB_SOURCES = ["LinkedIn", "Naukri", "Indeed", "Company Website", "Other"];

interface JobFormValues {
  title: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  jobType: string;
  description: string;
  skills: string;
  applyLink: string;
  source: string;
  logo: string;
  postedAt: string;
}

export default function AddJobPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/admin/login");
      else setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  const { register, handleSubmit, reset } = useForm<JobFormValues>({
    defaultValues: {
      postedAt: new Date().toISOString().split("T")[0],
      jobType: "Full-time",
      source: "LinkedIn",
    },
  });

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function onSubmit(values: JobFormValues) {
    setIsSubmitting(true);
    try {
      const skillsArray = values.skills
        ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      await addJob({
        title: values.title || "",
        company: values.company || "",
        location: values.location || "",
        experience: values.experience || "",
        salary: values.salary || undefined,
        jobType: (values.jobType as any) || "Full-time",
        description: values.description || "",
        skills: skillsArray,
        applyLink: values.applyLink || "",
        source: (values.source as any) || "Other",
        logo: values.logo || "",
        postedAt: values.postedAt
          ? new Date(values.postedAt).toISOString()
          : new Date().toISOString(),
      });

      showToast("Job added successfully!", "success");
      reset();
      setTimeout(() => router.push("/admin/dashboard"), 1500);
    } catch (error) {
      console.error(error);
      showToast("Failed to add job. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted">
        <p className="text-sm text-slate-500">Checking authentication…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-card px-4 py-3 text-sm font-medium text-white shadow-lg ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-surface-border bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-700"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <PlusCircle size={18} className="text-brand-700" />
            Add New Job
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6 p-6">

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="form-label">Job Title</label>
              <input type="text" placeholder="e.g. Frontend Developer" className="form-input" {...register("title")} />
            </div>
            <div>
              <label className="form-label">Company</label>
              <input type="text" placeholder="e.g. Infosys" className="form-input" {...register("company")} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="form-label">Location</label>
              <input type="text" placeholder="e.g. Bangalore / Remote" className="form-input" {...register("location")} />
            </div>
            <div>
              <label className="form-label">Experience</label>
              <input type="text" placeholder="e.g. 0-1 years / Fresher" className="form-input" {...register("experience")} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="form-label">Salary</label>
              <input type="text" placeholder="e.g. ₹4,00,000 - ₹6,00,000 / year" className="form-input" {...register("salary")} />
            </div>
            <div>
              <label className="form-label">Job Type</label>
              <select className="form-input" {...register("jobType")}>
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Job Description</label>
            <textarea
              rows={5}
              placeholder="Describe the role, responsibilities, and requirements…"
              className="form-input resize-none"
              {...register("description")}
            />
          </div>

          <div>
            <label className="form-label">Skills (comma-separated)</label>
            <input type="text" placeholder="e.g. React, TypeScript, Node.js" className="form-input" {...register("skills")} />
            <p className="mt-1 text-xs text-slate-500">Separate multiple skills with commas.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="form-label">Apply Link</label>
              <input type="text" placeholder="https://linkedin.com/jobs/..." className="form-input" {...register("applyLink")} />
            </div>
            <div>
              <label className="form-label">Source</label>
              <select className="form-input" {...register("source")}>
                {JOB_SOURCES.map((src) => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="form-label">Company Logo URL</label>
              <input type="text" placeholder="https://company.com/logo.png" className="form-input" {...register("logo")} />
            </div>
            <div>
              <label className="form-label">Posted Date</label>
              <input type="date" className="form-input" {...register("postedAt")} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-surface-border pt-5">
            <Link href="/admin/dashboard" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              <PlusCircle size={16} />
              {isSubmitting ? "Adding Job…" : "Add Job"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}