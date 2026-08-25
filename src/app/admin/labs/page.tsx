"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CircleCheck,
  CircleX,
  Container,
  FlaskConical,
  RefreshCw,
  Server,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Lab = {
  id: string;
  name: string;
  status: string;
  running: boolean;
  ip: string | null;
  created: number;
};

export default function AdminLabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadLabs() {
    try {
      setError("");

      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError(
          "Your administrator session has expired."
        );
        return;
      }

      const response = await fetch(
        `http://localhost:3001/admin/labs?access_token=${encodeURIComponent(
          session.access_token
        )}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to load networking labs."
        );
      }

      setLabs(data.labs ?? []);
    } catch (err) {
      console.error("Admin labs error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load networking labs."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadLabs();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  function refreshLabs() {
    setRefreshing(true);
    void loadLabs();
  }

  const runningCount = labs.filter(
    (lab) => lab.running
  ).length;

  const stoppedCount =
    labs.length - runningCount;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">

        {/* Back */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition hover:underline"
        >
          <ArrowLeft size={17} />
          Back to Admin Dashboard
        </Link>

        {/* Header */}
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
              Networking Lab Management
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Networking Labs
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
              Monitor the real Docker networking environments created for
              ICTNET101 students.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshLabs}
            disabled={refreshing}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-3 text-sm font-bold transition hover:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Container size={22} />}
            label="Lab Containers"
            value={labs.length}
          />

          <StatCard
            icon={<CircleCheck size={22} />}
            label="Running"
            value={runningCount}
          />

          <StatCard
            icon={<CircleX size={22} />}
            label="Stopped"
            value={stoppedCount}
          />

          <StatCard
            icon={<Server size={22} />}
            label="Environment"
            value="Docker"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="font-bold text-red-500">
              Unable to load labs
            </p>

            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              {error}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && !error && (
          <div className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-[var(--primary)]"
            />

            <p className="mt-4 font-semibold">
              Loading lab environments...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          labs.length === 0 && (
            <div className="mt-10 rounded-3xl border border-dashed border-[var(--border)] bg-[var(--card)] p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
                <FlaskConical size={30} />
              </div>

              <h2 className="mt-5 text-2xl font-black">
                No Lab Environments
              </h2>

              <p className="mt-3 text-[var(--muted-foreground)]">
                Student Docker environments will appear here once they
                connect to the networking lab.
              </p>
            </div>
          )}

        {/* Labs */}
        {!loading &&
          !error &&
          labs.length > 0 && (
            <section className="mt-10">
              <div className="mb-5 flex items-center gap-3">
                <Users
                  size={21}
                  className="text-[var(--primary)]"
                />

                <h2 className="text-2xl font-black">
                  Student Lab Environments
                </h2>
              </div>

              <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]">

                <div className="hidden grid-cols-[1.3fr_1fr_1fr_160px] gap-4 border-b border-[var(--border)] bg-[var(--muted)] px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] lg:grid">
                  <span>Container</span>
                  <span>IP Address</span>
                  <span>Status</span>
                  <span>Container ID</span>
                </div>

                {labs.map((lab, index) => (
                  <div
                    key={lab.id}
                    className={`grid gap-4 px-6 py-5 lg:grid-cols-[1.3fr_1fr_1fr_160px] lg:items-center ${
                      index < labs.length - 1
                        ? "border-b border-[var(--border)]"
                        : ""
                    }`}
                  >
                    {/* Container */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)]">
                        <Container size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold">
                          {lab.name}
                        </p>

                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          Student lab environment
                        </p>
                      </div>
                    </div>

                    {/* IP */}
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] lg:hidden">
                        IP Address
                      </p>

                      <code className="text-sm text-[var(--primary)]">
                        {lab.ip || "Unavailable"}
                      </code>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] lg:hidden">
                        Status
                      </p>

                      {lab.running ? (
                        <span className="inline-flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-xs font-bold text-green-600 dark:text-green-400">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          Running
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          Stopped
                        </span>
                      )}
                    </div>

                    {/* Container ID */}
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] lg:hidden">
                        Container ID
                      </p>

                      <code className="text-xs text-[var(--muted-foreground)]">
                        {lab.id.slice(0, 12)}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)]">
        {icon}
      </div>

      <p className="mt-5 text-sm font-semibold text-[var(--muted-foreground)]">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black">
        {value}
      </p>
    </div>
  );
}