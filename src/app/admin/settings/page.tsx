import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
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

  const firstName =
    profile.full_name?.trim().split(/\s+/)[0] ||
    user.email?.split("@")[0] ||
    "Admin";

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">

        {/* Back */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition hover:underline"
        >
          <ArrowLeft size={17} />
          Back to Admin Dashboard
        </Link>

        {/* Header */}
        <div className="mt-8">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            <Settings size={18} />
            Platform Administration
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Settings
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Manage your administrator account and review the current
            ICTNET101 platform status.
          </p>
        </div>

        {/* Administrator Account */}
        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-9">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
              <UserRound size={27} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                Administrator Account
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Welcome, {firstName}
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <AccountInfo
              icon={<UserRound size={18} />}
              label="Full Name"
              value={
                profile.full_name ||
                "Not provided"
              }
            />

            <AccountInfo
              icon={<Mail size={18} />}
              label="Email"
              value={
                user.email ||
                "Unavailable"
              }
            />

            <AccountInfo
              icon={<ShieldCheck size={18} />}
              label="Role"
              value={profile.role}
            />

            <AccountInfo
              icon={<ShieldCheck size={18} />}
              label="Account ID"
              value={user.id}
              mono
            />
          </div>
        </section>

        {/* Platform Status */}
        <section className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)]">
              <CheckCircle2 size={22} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                System Status
              </p>

              <h2 className="mt-1 text-xl font-black">
                ICTNET101 Platform
              </h2>
            </div>
          </div>

          <div className="mt-7 space-y-3">
            <StatusRow
              label="Supabase Authentication"
              description="User authentication and sessions"
              status="Connected"
            />

            <StatusRow
              label="Student Accounts"
              description="Profiles and role management"
              status="Active"
            />

            <StatusRow
              label="Course System"
              description="Modules and lessons"
              status="Active"
            />

            <StatusRow
              label="Assessment System"
              description="Knowledge and practical assessments"
              status="Active"
            />

            <StatusRow
              label="Networking Lab"
              description="Docker-based Linux networking environments"
              status="Online"
            />
          </div>
        </section>

        {/* Current Scope */}
        <section className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Configuration
          </p>

          <h2 className="mt-2 text-xl font-black">
            Administrative Controls
          </h2>

          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            Advanced platform configuration will be added here as ICTNET101
            grows. The current dashboard keeps authentication, course data,
            assessments, and networking infrastructure managed by their
            respective systems.
          </p>
        </section>

      </section>
    </main>
  );
}

function AccountInfo({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] p-5">
      <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
        {icon}

        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p
        className={`mt-3 break-all font-semibold ${
          mono
            ? "font-mono text-xs text-[var(--primary)]"
            : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  description,
  status,
}: {
  label: string;
  description: string;
  status: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-bold">
          {label}
        </p>

        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>

      <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-xs font-bold text-green-600 dark:text-green-400">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        {status}
      </span>
    </div>
  );
}