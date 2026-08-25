import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  Layers3,
} from "lucide-react";

import { modules } from "@/data/modules";

export default function AdminCoursesPage() {
  const totalLessons = modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

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
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
              Course Management
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Courses
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
              Review the ICTNET101 curriculum, modules, lessons, topics,
              difficulty levels, and estimated learning time.
            </p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard
              icon={<Layers3 size={20} />}
              label="Modules"
              value={modules.length}
            />

            <SummaryCard
              icon={<BookOpen size={20} />}
              label="Lessons"
              value={totalLessons}
            />
          </div>
        </div>

        {/* Course List */}
        <section className="mt-10">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => (
              <article
                key={module.id}
                className="group flex flex-col rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--primary)]"
              >
                {/* Icon + Module Number */}
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
                    <BookOpen size={23} />
                  </div>

                  <span className="rounded-lg bg-[var(--muted)] px-3 py-2 text-xs font-black text-[var(--primary)]">
                    Module {module.id}
                  </span>
                </div>

                {/* Content */}
                <h2 className="mt-6 text-xl font-black">
                  {module.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                  {module.description}
                </p>

                {/* Metadata */}
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-[var(--muted)] px-3 py-1.5 text-xs font-bold">
                    {module.difficulty}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--muted)] px-3 py-1.5 text-xs font-bold">
                    <Clock3 size={14} />
                    {module.estimatedTime}
                  </span>
                </div>

                {/* Topics */}
                <div className="mt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Topics
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {module.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Lessons */}
                <div className="mt-6 border-t border-[var(--border)] pt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">
                      Lessons
                    </p>

                    <span className="text-xs font-bold text-[var(--muted-foreground)]">
                      {module.lessons.length}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {module.lessons.map((lesson, index) => (
                      <div
                        key={`${module.id}-${index}`}
                        className="rounded-xl bg-[var(--muted)] px-3 py-2.5 text-sm"
                      >
                        <span className="mr-2 font-bold text-[var(--primary)]">
                          {index + 1}.
                        </span>

                        {typeof lesson === "string"
                          ? lesson
                          : lesson.title}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-6">
                  <Link
                    href={`/modules/${module.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] transition hover:gap-3"
                  >
                    View Module
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Admin Note */}
        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-7">
          <p className="text-sm font-bold text-[var(--primary)]">
            Course Content
          </p>

          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
            This page currently reads directly from the ICTNET101 course
            configuration in <code className="font-semibold">modules.ts</code>,
            so the administrator always sees the same modules and lessons
            that students see.
          </p>
        </section>

      </section>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4">
      <div className="flex items-center gap-2 text-[var(--primary)]">
        {icon}

        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 text-2xl font-black">
        {value}
      </p>
    </div>
  );
}