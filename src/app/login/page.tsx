"use client";

import {
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  LogIn,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const {
        data,
        error: signInError,
      } =
        await supabase.auth.signInWithPassword(
          {
            email: email.trim(),
            password,
          }
        );

      if (
        signInError ||
        !data.user
      ) {
        setError(
          signInError?.message ??
            "Unable to sign in."
        );

        return;
      }

      const {
        data: profile,
        error: profileError,
      } =
        await supabase
          .from("profiles")
          .select("role")
          .eq(
            "id",
            data.user.id
          )
          .maybeSingle();

      if (profileError) {
        console.error(
          "Profile lookup error:",
          profileError
        );

        setError(
          "Your account was authenticated, but your profile could not be loaded."
        );

        return;
      }

      if (
        profile?.role !==
          "admin" &&
        profile?.role !==
          "student"
      ) {
        setError(
          "Your account does not have a valid ICTNET101 role."
        );

        return;
      }

      const destination =
        profile.role === "admin"
          ? "/admin"
          : "/dashboard";

      /*
       * Do a complete browser navigation.
       *
       * Supabase has already established the
       * browser session before this happens.
       */
      window.location.assign(
        destination
      );
    } catch (loginError) {
      console.error(
        "Login error:",
        loginError
      );

      setError(
        "Unable to sign in right now."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-5 py-12">
        <section className="w-full rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-9">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
            <LogIn size={24} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Welcome Back
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Sign in to ICTNET101
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <label className="block">
              <span className="text-sm font-semibold">
                Email
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                required
                autoComplete="email"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">
                Password
              </span>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                required
                autoComplete="current-password"
              />
            </label>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3.5 font-bold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Signing in..."
                : "Sign in"}

              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
            Don&lsquo;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-[var(--primary)]"
            >
              Create one
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}