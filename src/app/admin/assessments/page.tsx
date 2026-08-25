import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Network,
  Terminal,
  Trophy,
} from "lucide-react";

export const dynamic = "force-dynamic";

const practicalTasks = [
  {
    id: "ip-config",
    title: "Inspect Your Network Configuration",
    command: "ip a / ip addr / ifconfig",
    description:
      "Display the network interfaces and addressing information for the lab machine.",
  },
  {
    id: "ping-gateway",
    title: "Test Connectivity",
    command: "ping",
    description:
      "Use ping to test whether a destination can be reached from the lab machine.",
  },
  {
    id: "trace-route",
    title: "Trace a Network Path",
    command: "traceroute / tracert",
    description:
      "Investigate the path taken toward a destination.",
  },
  {
    id: "dns-lookup",
    title: "Resolve a Hostname",
    command: "nslookup / dig",
    description:
      "Use a DNS utility to investigate hostname resolution.",
  },
  {
    id: "arp-table",
    title: "Inspect the Local ARP Table",
    command: "arp -a / ip neigh",
    description:
      "Display IP-to-MAC address information available on the local network.",
  },
  {
    id: "connections",
    title: "Inspect Network Connections",
    command: "ss / netstat",
    description:
      "Display active connections and listening sockets.",
  },
];

export default function AdminAssessmentsPage() {
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
              Assessment Management
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Assessments
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
              Review the knowledge and practical assessment structure currently
              used by ICTNET101 students.
            </p>
          </div>

          <Link
            href="/modules/introduction-to-networking/test"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
          >
            Preview Student Test
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Overview */}
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AssessmentStat
            icon={<Trophy size={22} />}
            label="Assessment"
            value="Module 1"
          />

          <AssessmentStat
            icon={<CheckCircle2 size={22} />}
            label="Knowledge Questions"
            value="20"
          />

          <AssessmentStat
            icon={<Terminal size={22} />}
            label="Practical Tasks"
            value="6"
          />

          <AssessmentStat
            icon={<Clock3 size={22} />}
            label="Passing Score"
            value="70%"
          />
        </section>

        {/* Assessment Structure */}
        <section className="mt-10 grid gap-6 lg:grid-cols-2">

          {/* Knowledge */}
          <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
                <Trophy size={23} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                  Part A
                </p>

                <h2 className="text-2xl font-black">
                  Knowledge Test
                </h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-[var(--muted-foreground)]">
              The first section contains 20 randomized multiple-choice
              questions covering the Module 1 lessons.
            </p>

            <div className="mt-6 space-y-3">
              <LessonCoverage
                title="Introduction to Networking"
                description="Networking fundamentals, devices, and the purpose of networks."
              />

              <LessonCoverage
                title="The OSI Model"
                description="Seven layers, responsibilities, and TCP/IP comparison."
              />

              <LessonCoverage
                title="Basic Networking Connectivity"
                description="IP addressing, private ranges, subnet masks, gateways, and connectivity commands."
              />

              <LessonCoverage
                title="Network Ports & TCP/UDP"
                description="Ports, port ranges, common services, TCP, UDP, and the three-way handshake."
              />
            </div>

            <div className="mt-6 rounded-2xl bg-[var(--muted)] p-5">
              <p className="text-sm font-bold">
                Question behavior
              </p>

              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Questions and answer options are shuffled for each new
                assessment attempt.
              </p>
            </div>
          </article>

          {/* Practical */}
          <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
                <Terminal size={23} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                  Part B
                </p>

                <h2 className="text-2xl font-black">
                  Practical Assessment
                </h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-[var(--muted-foreground)]">
              Students complete six tasks inside their real, authenticated
              Linux networking lab. The lab server checks the commands they
              actually execute.
            </p>

            <div className="mt-6 space-y-3">
              {practicalTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-[var(--border)] p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)] text-xs font-black text-[var(--primary)]">
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <p className="font-bold">
                        {task.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                        {task.description}
                      </p>

                      <code className="mt-3 block rounded-lg bg-[var(--muted)] px-3 py-2 text-xs text-[var(--primary)]">
                        {task.command}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

        </section>

        {/* Scoring */}
        <section className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7">
          <div className="flex items-center gap-3">
            <Network
              size={22}
              className="text-[var(--primary)]"
            />

            <h2 className="text-xl font-black">
              Scoring Structure
            </h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <ScoreItem
              label="Knowledge"
              value="20 points"
            />

            <ScoreItem
              label="Practical"
              value="6 points"
            />

            <ScoreItem
              label="Total"
              value="26 points"
            />
          </div>

          <div className="mt-6 rounded-2xl bg-[var(--muted)] p-5">
            <p className="font-bold">
              Passing requirement: 70%
            </p>

            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
              The student&apos;s final percentage combines the knowledge and
              practical sections into one Module 1 assessment result.
            </p>
          </div>
        </section>

      </section>
    </main>
  );
}

function AssessmentStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)]">
        {icon}
      </div>

      <p className="mt-5 text-sm font-semibold text-[var(--muted-foreground)]">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black">
        {value}
      </p>
    </div>
  );
}

function LessonCoverage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] p-4">
      <CheckCircle2
        size={18}
        className="mt-0.5 shrink-0 text-green-500"
      />

      <div>
        <p className="font-bold">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
    </div>
  );
}

function ScoreItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] p-5">
      <p className="text-sm font-semibold text-[var(--muted-foreground)]">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black text-[var(--primary)]">
        {value}
      </p>
    </div>
  );
}
