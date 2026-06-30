"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { formatDistanceToNow } from "date-fns";
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Search,
  Building2,
  LayoutDashboard,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { getAllJobs, deleteJob } from "@/lib/jobService";
import type { Job } from "@/types/job";

/**
 * /admin/dashboard — main admin control panel.
 *
 * Client Component because it:
 * 1. Guards the route by checking Firebase Auth state on mount,
 *    redirecting to /admin/login if no user is signed in.
 * 2. Fetches and displays all jobs with live search/filter.
 * 3. Handles job deletion with an inline confirmation step.
 */
export default function AdminDashboardPage() {
  const router = useRouter();

  // Auth state
  const [authChecked, setAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // UI feedback
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* ------------------------------------------------------------------ */
  /* Auth guard: redirect to login if not authenticated                  */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        setAuthChecked(true);
      } else {
        router.replace("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  /* ------------------------------------------------------------------ */
  /* Fetch all jobs once auth is confirmed                               */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!authChecked) return;

    async function fetchJobs() {
      try {
        const data = await getAllJobs();
        setJobs(data);
        setFilteredJobs(data);
      } catch {
        showToast("Failed to load jobs. Please refresh.", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [authChecked]);

  /* ------------------------------------------------------------------ */
  /* Live search filter                                                  */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setFilteredJobs(jobs);
      return;
    }
    setFilteredJobs(
      jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, jobs]);

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteJob(id);
      const updated = jobs.filter((j) => j.id !== id);
      setJobs(updated);
      setConfirmDeleteId(null);
      showToast("Job deleted successfully.", "success");
    } catch {
      showToast("Failed to delete job. Please try again.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSignOut() {
    await signOut(auth);
    router.replace("/admin/login");
  }

  /* ------------------------------------------------------------------ */
  /* Render: auth pending state                                          */
  /* ------------------------------------------------------------------ */
  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted">
        <p className="text-sm text-slate-500">Checking authentication…</p>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Main dashboard UI                                                   */
  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-surface-muted">
      {/* Toast notification */}
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

      {/* Admin navbar */}
      <header className="sticky top-0 z-40 border-b border-surface-border bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-card bg-brand-700 text-white">
              <Briefcase size={18} strokeWidth={2.25} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Job Updates India</p>
              <p className="text-xs text-slate-500">Admin Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="hidden text-xs text-slate-500 sm:block">{userEmail}</span>
            )}
            <button onClick={handleSignOut} className="btn-secondary !px-3 !py-2 text-xs">
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page title + Add Job button */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-brand-700" size={22} />
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          </div>
          <Link href="/admin/dashboard/add-job" className="btn-primary">
            <Plus size={16} />
            Add New Job
          </Link>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Jobs"
            value={jobs.length}
            icon={<Briefcase size={20} className="text-brand-700" />}
          />
          <StatCard
            label="Full-time"
            value={jobs.filter((j) => j.jobType === "Full-time").length}
            icon={<Building2 size={20} className="text-brand-700" />}
          />
          <StatCard
            label="Remote"
            value={jobs.filter((j) => j.jobType === "Remote").length}
            icon={<Briefcase size={20} className="text-brand-700" />}
          />
        </div>

        {/* Search bar */}
        <div className="relative mb-5">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, company, or location…"
            className="form-input !pl-10"
          />
        </div>

        {/* Jobs table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-slate-500">Loading jobs…</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-medium text-slate-700">
                {searchQuery ? "No jobs match your search" : "No jobs yet"}
              </p>
              {!searchQuery && (
                <Link href="/admin/dashboard/add-job" className="btn-primary mt-4">
                  <Plus size={15} />
                  Add your first job
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-surface-border bg-surface-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Job</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Location</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Posted</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-surface-muted">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-card border border-surface-border bg-surface-muted">
                            {job.logo ? (
                              <Image
                                src={job.logo}
                                alt={job.company}
                                fill
                                sizes="36px"
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <Building2 size={16} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-[200px] truncate font-medium text-slate-900">
                              {job.title}
                            </p>
                            <p className="truncate text-xs text-slate-500">{job.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{job.location}</td>
                      <td className="px-4 py-3">
                        <span className="badge">{job.jobType}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/dashboard/edit-job/${job.id}`}
                            className="btn-secondary !px-2.5 !py-1.5"
                            aria-label={`Edit ${job.title}`}
                          >
                            <Pencil size={14} />
                            Edit
                          </Link>

                          {confirmDeleteId === job.id ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleDelete(job.id)}
                                disabled={deletingId === job.id}
                                className="rounded-card bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
                              >
                                {deletingId === job.id ? "Deleting…" : "Confirm"}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="btn-secondary !px-2.5 !py-1.5 text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(job.id)}
                              className="inline-flex items-center gap-1.5 rounded-card border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                              aria-label={`Delete ${job.title}`}
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Showing {filteredJobs.length} of {jobs.length} job{jobs.length === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat card sub-component                                                     */
/* -------------------------------------------------------------------------- */
function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-card bg-brand-50">
        {icon}
      </span>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-600">{label}</p>
      </div>
    </div>
  );
}