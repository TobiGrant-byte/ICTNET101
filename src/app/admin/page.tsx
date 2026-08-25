import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FlaskConical,
  Settings,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { modules } from "@/data/modules";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const { count: studentCount } = await supabase
    .from("profiles")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("role", "student");

  const { count: adminCount } = await supabase
    .from("profiles")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("role", "admin");

  const firstName =
    profile.full_name?.trim().split(/\s+/)[0] ||
    user.email?.split("@")[0] ||
    "Admin";

  const totalLessons = modules.reduce(
    (total, module) =>
      total + module.lessons.length,
    0
  );

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">

        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
              Administration
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Welcome back, {firstName}
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
              Manage ICTNET101 students, courses, assessments, networking
              labs, and platform settings.
            </p>
          </div>

          {/* Admin identity */}
          <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)]">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Administrator
              </p>

              <p className="mt-1 font-bold">
                {profile.full_name || user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            icon={<Users size={23} />}
            label="Students"
            value={studentCount ?? 0}
            href="/admin/students"
          />

          <StatCard
            icon={<ShieldCheck size={23} />}
            label="Administrators"
            value={adminCount ?? 0}
            href="/admin/settings"
          />

          <StatCard
            icon={<BookOpen size={23} />}
            label="Modules"
            value={modules.length}
            href="/admin/courses"
          />

          <StatCard
            icon={<BookOpen size={23} />}
            label="Lessons"
            value={totalLessons}
            href="/admin/courses"
          />

          <StatCard
            icon={<FlaskConical size={23} />}
            label="Labs"
            value="Online"
            href="/admin/labs"
          />
        </div>

        {/* Quick Management */}
        <section className="mt-12">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Management
          </p>

          <h2 className="mt-1 text-2xl font-black">
            ICTNET101 Administration
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            <AdminCard
              icon={<Users size={24} />}
              title="Students"
              description="View registered students, account roles, and learning information."
              href="/admin/students"
              action="Manage Students"
            />

            <AdminCard
              icon={<BookOpen size={24} />}
              title="Courses"
              description="Review modules, lessons, topics, durations, and course structure."
              href="/admin/courses"
              action="Manage Courses"
            />

            <AdminCard
              icon={<Trophy size={24} />}
              title="Assessments"
              description="Review knowledge questions, practical tasks, and assessment structure."
              href="/admin/assessments"
              action="Manage Assessments"
            />

            <AdminCard
              icon={<FlaskConical size={24} />}
              title="Networking Labs"
              description="Monitor student lab access and the real Docker networking environment."
              href="/admin/labs"
              action="Manage Labs"
            />

            <AdminCard
              icon={<Settings size={24} />}
              title="Settings"
              description="Review your administrator account and platform configuration."
              href="/admin/settings"
              action="Open Settings"
            />

          </div>
        </section>

        {/* Platform Overview */}
        <section className="mt-12 grid gap-5 lg:grid-cols-2">

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7">
            <div className="flex items-center gap-3">
              <BookOpen
                size={22}
                className="text-[var(--primary)]"
              />

              <h2 className="text-xl font-black">
                Course Overview
              </h2>
            </div>

            <div className="mt-6 space-y-3">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border)] p-4"
                >
                  <div>
                    <p className="font-bold">
                      Module {module.id}
                    </p>

                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {module.title}
                    </p>
                  </div>

                  <span className="rounded-lg bg-[var(--muted)] px-3 py-2 text-xs font-bold">
                    {module.lessons.length}{" "}
                    {module.lessons.length === 1
                      ? "lesson"
                      : "lessons"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7">
            <div className="flex items-center gap-3">
              <FlaskConical
                size={22}
                className="text-[var(--primary)]"
              />

              <h2 className="text-xl font-black">
                Platform Status
              </h2>
            </div>

            <div className="mt-6 space-y-3">
              <StatusRow
                label="Supabase Authentication"
                status="Connected"
              />

              <StatusRow
                label="Course System"
                status="Active"
              />

              <StatusRow
                label="Assessment System"
                status="Active"
              />

              <StatusRow
                label="Docker Networking Lab"
                status="Online"
              />
            </div>
          </div>

        </section>

      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--primary)]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
        {icon}
      </div>

      <p className="mt-5 text-sm font-semibold text-[var(--muted-foreground)]">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black">
        {value}
      </p>
    </Link>
  );
}

function AdminCard({
  icon,
  title,
  description,
  href,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-black">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
        {description}
      </p>

      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] transition hover:opacity-80"
      >
        {action}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function StatusRow({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] p-4">
      <span className="text-sm font-semibold">
        {label}
      </span>

      <span className="rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-600 dark:text-green-400">
        {status}
      </span>
    </div>
  );
} 