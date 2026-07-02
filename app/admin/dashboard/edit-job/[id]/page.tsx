"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { onAuthStateChanged } from "firebase/auth";
import { Pencil, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { getJobById, updateJob } from "@/lib/jobService";
import type { JobType, JobSource } from "@/types/job";

/* -------------------------------------------------------------------------- */
/* Zod schema — identical to Add Job so both forms stay in sync               */
/* -------------------------------------------------------------------------- */
const jobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  experience: z.string().min(1, "Experience is required"),
  salary: z.string().optional(),
  jobType: z.enum(["Full-time", "Part-time", "Internship", "Contract", "Remote", "Walk-in"]),
  description: z.string().min(50, "Description must be at least 50 characters"),
  skills: z.string().min(1, "Enter at least one skill"),
  applyLink: z.string().url("Enter a valid URL (include https://)"),
  source: z.enum(["LinkedIn", "Naukri", "Indeed", "Company Website", "Other"]),
  logo: z.string().url("Enter a valid logo URL (include https://)").or(z.literal("")),
  postedAt: z.string().min(1, "Posted date is required"),
});

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

const JOB_TYPES: JobType[] = [
  "Full-time", "Part-time", "Internship", "Contract", "Remote", "Walk-in",
];

const JOB_SOURCES: JobSource[] = [
  "LinkedIn", "Naukri", "Indeed", "Company Website", "Other",
];

/**
 * /admin/dashboard/edit-job/[id] — pre-filled form to edit an existing job.
 * Fetches the job by Firestore document ID, populates the form, and calls
 * updateJob() on submit. Slug is intentionally preserved to avoid breaking
 * existing indexed/shared URLs.
 */
export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* Auth guard */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/admin/login");
      else setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [router]);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<JobFormValues>();

  /* Fetch job and pre-fill form */
  useEffect(() => {
    if (!authChecked || !jobId) return;

    async function fetchJob() {
      try {
        const job = await getJobById(jobId);
        if (!job) {
          setNotFound(true);
          return;
        }

        // Pre-fill all form fields with existing job data
        reset({
          title: job.title,
          company: job.company,
          location: job.location,
          experience: job.experience,
          salary: job.salary ?? "",
          jobType: job.jobType,
          description: job.description,
          // Convert skills array back to comma-separated string for the form
          skills: job.skills.join(", "),
          applyLink: job.applyLink,
          source: job.source,
          logo: job.logo ?? "",
          // Convert ISO string to YYYY-MM-DD for the date input
          postedAt: job.postedAt.split("T")[0],
        });
      } catch {
        showToast("Failed to load job details. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [authChecked, jobId, reset]);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function onSubmit(values: JobFormValues) {
    setIsSubmitting(true);
    try {
      const skillsArray = values.skills
        ? values.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      await updateJob(jobId, {
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

      showToast("Job updated successfully!", "success");
      setTimeout(() => router.push("/admin/dashboard"), 1500);
    } catch {
      showToast("Failed to update job. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ---------- Loading / error states ---------- */
  if (!authChecked || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted">
        <p className="text-sm text-slate-500">
          {!authChecked ? "Checking authentication…" : "Loading job details…"}
        </p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-muted">
        <p className="font-medium text-slate-700">Job not found.</p>
        <Link href="/admin/dashboard" className="btn-primary">
          <ArrowLeft size={15} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  /* ---------- Edit form ---------- */
  return (
    <div className="min-h-screen bg-surface-muted">
      {/* Toast */}
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

      {/* Header */}
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
            <Pencil size={18} className="text-brand-700" />
            Edit Job
          </h1>
        </div>
      </header>

      {/* Form */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6 p-6">

          {/* Row 1: Title + Company */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="form-label">Job Title</label>
              <input
                type="text"
                placeholder="e.g. Frontend Developer"
                className="form-input"
                {...register("title")}
              />
              {errors.title && <p className="form-error">{errors.title.message}</p>}
            </div>
            <div>
              <label className="form-label">Company</label>
              <input
                type="text"
                placeholder="e.g. Infosys"
                className="form-input"
                {...register("company")}
              />
              {errors.company && <p className="form-error">{errors.company.message}</p>}
            </div>
          </div>

          {/* Row 2: Location + Experience */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                placeholder="e.g. Bangalore / Remote"
                className="form-input"
                {...register("location")}
              />
              {errors.location && <p className="form-error">{errors.location.message}</p>}
            </div>
            <div>
              <label className="form-label">Experience</label>
              <input
                type="text"
                placeholder="e.g. 0-1 years / Fresher"
                className="form-input"
                {...register("experience")}
              />
              {errors.experience && <p className="form-error">{errors.experience.message}</p>}
            </div>
          </div>

          {/* Row 3: Salary + Job Type */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="form-label">Salary (optional)</label>
              <input
                type="text"
                placeholder="e.g. ₹4,00,000 - ₹6,00,000 / year"
                className="form-input"
                {...register("salary")}
              />
              {errors.salary && <p className="form-error">{errors.salary.message}</p>}
            </div>
            <div>
              <label className="form-label">Job Type</label>
              <select className="form-input" {...register("jobType")}>
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.jobType && <p className="form-error">{errors.jobType.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Job Description</label>
            <textarea
              rows={5}
              placeholder="Describe the role, responsibilities, and requirements…"
              className="form-input resize-none"
              {...register("description")}
            />
            {errors.description && <p className="form-error">{errors.description.message}</p>}
          </div>

          {/* Skills */}
          <div>
            <label className="form-label">Skills * (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. React, TypeScript, Node.js"
              className="form-input"
              {...register("skills")}
            />
            {errors.skills && <p className="form-error">{errors.skills.message}</p>}
            <p className="mt-1 text-xs text-slate-500">Separate multiple skills with commas.</p>
          </div>

          {/* Row 4: Apply Link + Source */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="form-label">Apply Link</label>
              <input
                type="url"
                placeholder="https://linkedin.com/jobs/..."
                className="form-input"
                {...register("applyLink")}
              />
              {errors.applyLink && <p className="form-error">{errors.applyLink.message}</p>}
            </div>
            <div>
              <label className="form-label">Source</label>
              <select className="form-input" {...register("source")}>
                {JOB_SOURCES.map((src) => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
              {errors.source && <p className="form-error">{errors.source.message}</p>}
            </div>
          </div>

          {/* Row 5: Logo URL + Posted Date */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="form-label">Company Logo URL (optional)</label>
              <input
                type="url"
                placeholder="https://company.com/logo.png"
                className="form-input"
                {...register("logo")}
              />
              {errors.logo && <p className="form-error">{errors.logo.message}</p>}
            </div>
            <div>
              <label className="form-label">Posted Date</label>
              <input
                type="date"
                className="form-input"
                {...register("postedAt")}
              />
              {errors.postedAt && <p className="form-error">{errors.postedAt.message}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-surface-border pt-5">
            <Link href="/admin/dashboard" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              <Pencil size={15} />
              {isSubmitting ? "Saving…" : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
