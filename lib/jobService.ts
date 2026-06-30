import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as fbLimit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Job, JobFormValues } from "@/types/job";

/** Name of the Firestore collection storing all job documents. */
const JOBS_COLLECTION = "jobs";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Converts a job title + company name into a URL-friendly slug.
 * e.g. "Frontend Developer" + "Infosys" -> "frontend-developer-infosys"
 *
 * A short random suffix is appended to avoid collisions when two jobs
 * share the same title and company (e.g. multiple openings).
 */
export function generateSlug(title: string, company: string): string {
  const base = `${title}-${company}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // strip special characters
    .replace(/\s+/g, "-") // spaces -> hyphens
    .replace(/-+/g, "-"); // collapse multiple hyphens

  const uniqueSuffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${uniqueSuffix}`;
}

/**
 * Normalizes a raw Firestore document (snapshot) into our typed `Job` shape.
 * Handles the Firestore Timestamp -> ISO string conversion for `postedAt`
 * so the object is safely serializable from Server to Client Components.
 */
function mapDocToJob(id: string, data: Record<string, unknown>): Job {
  const postedAtRaw = data.postedAt;
  const postedAt =
    postedAtRaw instanceof Timestamp
      ? postedAtRaw.toDate().toISOString()
      : (postedAtRaw as string) ?? new Date().toISOString();

  return {
    id,
    title: data.title as string,
    company: data.company as string,
    location: data.location as string,
    experience: data.experience as string,
    salary: (data.salary as string) || undefined,
    jobType: data.jobType as Job["jobType"],
    description: data.description as string,
    skills: (data.skills as string[]) ?? [],
    applyLink: data.applyLink as string,
    source: data.source as Job["source"],
    logo: data.logo as string,
    postedAt,
    slug: data.slug as string,
  };
}

/* -------------------------------------------------------------------------- */
/*  Read operations (used by public pages + admin dashboard)                  */
/* -------------------------------------------------------------------------- */

/**
 * Fetches all jobs, most recently posted first.
 * Used for the /jobs listing page and the admin job list.
 */
export async function getAllJobs(): Promise<Job[]> {
  const q = query(collection(db, JOBS_COLLECTION), orderBy("postedAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapDocToJob(d.id, d.data()));
}

/**
 * Fetches the N most recently posted jobs.
 * Used for the homepage "Latest Jobs" section.
 */
export async function getLatestJobs(count = 8): Promise<Job[]> {
  const q = query(
    collection(db, JOBS_COLLECTION),
    orderBy("postedAt", "desc"),
    fbLimit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapDocToJob(d.id, d.data()));
}

/**
 * Fetches jobs marked with the "Remote" or high-priority job types to
 * surface as "Featured Jobs" on the homepage.
 *
 * Note: this is a simple heuristic (Remote + Full-time roles first).
 * If you later add a dedicated `featured: boolean` field to the Job
 * document, swap this query to `where("featured", "==", true)`.
 */
export async function getFeaturedJobs(count = 6): Promise<Job[]> {
  const q = query(
    collection(db, JOBS_COLLECTION),
    where("jobType", "in", ["Remote", "Full-time"]),
    orderBy("postedAt", "desc"),
    fbLimit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapDocToJob(d.id, d.data()));
}

/**
 * Fetches a single job by its SEO-friendly slug.
 * Used for the /jobs/[slug] detail page. Returns null if not found.
 */
export async function getJobBySlug(slug: string): Promise<Job | null> {
  const q = query(collection(db, JOBS_COLLECTION), where("slug", "==", slug), fbLimit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return mapDocToJob(docSnap.id, docSnap.data());
}

/**
 * Fetches a single job by its Firestore document ID.
 * Used by the admin edit-job page to pre-fill the form.
 */
export async function getJobById(id: string): Promise<Job | null> {
  const docRef = doc(db, JOBS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return mapDocToJob(docSnap.id, docSnap.data());
}

/**
 * Fetches all jobs matching a given category (jobType).
 * Used for the /category/[category] page.
 */
export async function getJobsByCategory(category: string): Promise<Job[]> {
  const q = query(
    collection(db, JOBS_COLLECTION),
    where("jobType", "==", category),
    orderBy("postedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => mapDocToJob(d.id, d.data()));
}

/**
 * Fetches all jobs posted by a given company.
 * Used for the /company/[company] page.
 *
 * Company names are matched case-insensitively by comparing the
 * lowercased, hyphenated slug form passed in the URL.
 */
export async function getJobsByCompany(companySlug: string): Promise<Job[]> {
  const allJobs = await getAllJobs();
  return allJobs.filter(
    (job) => job.company.toLowerCase().replace(/\s+/g, "-") === companySlug.toLowerCase()
  );
}

/**
 * Client-side search/filter across already-fetched jobs.
 * Firestore doesn't support full-text search natively, so for a small-to-
 * medium job board we fetch all jobs once and filter in memory. For larger
 * scale, swap this for Algolia/Typesense.
 */
export function filterJobs(
  jobs: Job[],
  filters: { search?: string; location?: string; jobType?: string }
): Job[] {
  return jobs.filter((job) => {
    const matchesSearch =
      !filters.search ||
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(filters.search!.toLowerCase()));

    const matchesLocation =
      !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());

    const matchesJobType = !filters.jobType || job.jobType === filters.jobType;

    return matchesSearch && matchesLocation && matchesJobType;
  });
}

/* -------------------------------------------------------------------------- */
/*  Write operations (admin dashboard only — protected by Firestore rules)    */
/* -------------------------------------------------------------------------- */

/**
 * Creates a new job document in Firestore.
 * Auto-generates a slug from the title + company.
 * Returns the newly created job's Firestore document ID.
 */
export async function addJob(values: JobFormValues): Promise<string> {
  const slug = generateSlug(values.title, values.company);

  const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
    ...values,
    slug,
    postedAt: values.postedAt || new Date().toISOString(),
  });

  return docRef.id;
}

/**
 * Updates an existing job document by ID.
 * Slug is intentionally NOT regenerated on edit, to avoid breaking
 * previously shared/indexed URLs.
 */
export async function updateJob(id: string, values: Partial<JobFormValues>): Promise<void> {
  const docRef = doc(db, JOBS_COLLECTION, id);
  await updateDoc(docRef, { ...values });
}

/**
 * Permanently deletes a job document by ID.
 */
export async function deleteJob(id: string): Promise<void> {
  const docRef = doc(db, JOBS_COLLECTION, id);
  await deleteDoc(docRef);
}

/**
 * Returns the total number of job postings.
 * Used for the admin dashboard's "Total Jobs" stat card.
 */
export async function getTotalJobsCount(): Promise<number> {
  const snapshot = await getDocs(collection(db, JOBS_COLLECTION));
  return snapshot.size;
}