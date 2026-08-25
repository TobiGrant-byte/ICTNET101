"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { error: signUpError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setMessage(
        "Account created. Check your email to confirm your account if email confirmation is enabled."
      );

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError(
        "Unable to create your account right now."
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
            <UserPlus size={24} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Get Started
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Create your account
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <label className="block">
              <span className="text-sm font-semibold">
                Full name
              </span>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">
                Email
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                required
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
                  setPassword(event.target.value)
                }
                className="mt-2 h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                minLength={8}
                required
              />
            </label>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3.5 font-bold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? "Creating account..."
                : "Create account"}

              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[var(--primary)]"
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}