import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background: "var(--primary)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28 lg:pt-36">

        <div className="mx-auto max-w-4xl text-center">

          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm font-medium">
            <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />

            Interactive Networking Education
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">

            Master Networking

            <span className="block text-[var(--primary)]">
              Through Practice.
            </span>

          </h1>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg sm:leading-8">
            Learn networking fundamentals through interactive lessons,
            practical labs, quizzes, challenges and a browser-based
            networking terminal.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/modules"
              className="rounded-xl bg-[var(--primary)] px-7 py-3.5 font-semibold text-[var(--primary-foreground)] shadow-lg transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Start Learning →
            </Link>

            <Link
              href="/labs"
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-7 py-3.5 font-semibold transition hover:-translate-y-0.5 hover:bg-[var(--muted)]"
            >
              Explore Labs
            </Link>

          </div>

        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] sm:grid-cols-3">

          <Stat
            value="16"
            label="Learning Modules"
          />

          <Stat
            value="∞"
            label="Practice Opportunities"
          />

          <Stat
            value="24/7"
            label="Learn Anywhere"
          />

        </div>

      </div>
    </section>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="border-b border-[var(--border)] p-6 text-center last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="text-2xl font-black text-[var(--primary)]">
        {value}
      </div>

      <div className="mt-1 text-sm text-[var(--muted-foreground)]">
        {label}
      </div>
    </div>
  );
}