import Link from "next/link";

import {
  ArrowLeft,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } =
    await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();

  if (
    !profile ||
    profile.role !== "admin"
  ) {
    redirect("/dashboard");
  }

  const {
    data: students,
    error,
  } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("role", "student")
    .order("full_name", {
      ascending: true,
    });

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition hover:underline"
        >
          <ArrowLeft size={17} />
          Back to Admin Dashboard
        </Link>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
              <Users size={18} />
              Student Management
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Students
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
              View registered ICTNET101 student accounts and their assigned roles.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Total Students
            </p>

            <p className="mt-1 text-3xl font-black text-[var(--primary)]">
              {students?.length ?? 0}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="font-bold text-red-500">
              Unable to load students
            </p>

            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              {error.message}
            </p>
          </div>
        )}

        <section className="mt-10">
          {!error &&
          (!students ||
            students.length === 0) ? (
            <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--card)] p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
                <UserRound size={30} />
              </div>

              <h2 className="mt-5 text-2xl font-black">
                No Students Yet
              </h2>

              <p className="mt-3 text-[var(--muted-foreground)]">
                Registered student accounts will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]">

              <div className="hidden grid-cols-[1fr_220px_180px] border-b border-[var(--border)] bg-[var(--muted)] px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] md:grid">
                <span>Student</span>
                <span>User ID</span>
                <span>Role</span>
              </div>

              <div>
                {students?.map(
                  (student) => (
                    <div
                      key={student.id}
                      className="grid gap-4 border-b border-[var(--border)] px-6 py-5 last:border-b-0 md:grid-cols-[1fr_220px_180px] md:items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)]">
                          <UserRound size={20} />
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/admin/students/${student.id}`}
                            className="font-bold transition hover:text-[var(--primary)]"
                          >
                            {student.full_name ||
                              "Unnamed Student"}
                          </Link>

                          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            Student account
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] md:hidden">
                          User ID
                        </p>

                        <code className="break-all text-xs text-[var(--primary)]">
                          {student.id}
                        </code>
                      </div>

                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] md:hidden">
                          Role
                        </p>

                        <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--muted)] px-3 py-2 text-xs font-bold text-[var(--primary)]">
                          <ShieldCheck size={14} />
                          {student.role}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}