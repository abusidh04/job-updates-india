"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Briefcase, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { auth } from "@/lib/firebase";

/**
 * Validation schema for the login form.
 * Kept intentionally simple — Firebase Authentication itself is the real
 * source of truth for whether credentials are valid.
 */
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * /admin/login — admin authentication page.
 * Client Component: uses Firebase Authentication (signInWithEmailAndPassword)
 * to verify admin credentials, then redirects to the dashboard on success.
 *
 * Route protection for /admin/dashboard/* itself is enforced separately
 * by checking auth state in app/admin/layout.tsx.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setFirebaseError(null);
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push("/admin/dashboard");
    } catch (error) {
      // Map common Firebase Auth error codes to friendly messages
      const code = (error as { code?: string })?.code;
      const message =
        code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found"
          ? "Incorrect email or password. Please try again."
          : code === "auth/too-many-requests"
          ? "Too many failed attempts. Please wait a moment and try again."
          : "Something went wrong while signing in. Please try again.";
      setFirebaseError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-card bg-brand-700 text-white">
            <Briefcase size={22} strokeWidth={2.25} />
          </span>
          <h1 className="mt-3 text-xl font-bold text-slate-900">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-600">
            Sign in to manage Job Updates India listings
          </p>
        </div>

        {/* Login form card */}
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
          {firebaseError && (
            <div className="flex items-start gap-2 rounded-card bg-red-50 px-3.5 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{firebaseError}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@jobupdatesindia.com"
                className="form-input !pl-10"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="form-input !pl-10 !pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((show) => !show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            <LogIn size={16} />
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          This area is restricted to authorized administrators only.
        </p>
      </div>
    </div>
  );
}