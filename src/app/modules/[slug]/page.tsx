import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Layers3,
  Trophy,
} from "lucide-react";
import { modules } from "@/data/modules";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const moduleInfo = modules.find(
    (module) => module.slug === slug
  );

  if (!moduleInfo) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">

        {/* Back */}
        <Link
          href="/modules"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] transition hover:text-[var(--primary)]"
        >
          <ArrowLeft size={16} />
          All modules
        </Link>

        {/* Module Header */}
        <div className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
            <Layers3 size={28} />
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Module {moduleInfo.id}
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            {moduleInfo.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
            {moduleInfo.description}
          </p>

          {/* Stats */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Lessons
              </p>

              <p className="mt-1 text-xl font-black">
                {moduleInfo.lessons.length}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Difficulty
              </p>

              <p className="mt-1 text-xl font-black">
                {moduleInfo.difficulty}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Estimated Time
              </p>

              <p className="mt-1 flex items-center gap-2 text-xl font-black">
                <Clock3 size={18} />
                {moduleInfo.estimatedTime}
              </p>
            </div>
          </div>
        </div>

        {/* Topics */}
        {moduleInfo.topics.length > 0 && (
          <section className="mt-10">
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
              What you will learn
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Module topics
            </h2>

            <div className="mt-5 flex flex-wrap gap-2">
              {moduleInfo.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Lessons */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                Curriculum
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Module lessons
              </h2>
            </div>

            <span className="text-sm font-medium text-[var(--muted-foreground)]">
              {moduleInfo.lessons.length} lesson
              {moduleInfo.lessons.length === 1 ? "" : "s"}
            </span>
          </div>

          {moduleInfo.lessons.length > 0 ? (
            <div className="mt-5 space-y-3">
              {moduleInfo.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/modules/${moduleInfo.slug}/learn/${lesson.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-[var(--muted)]"
                >
                  {/* Lesson Number */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--muted)] text-sm font-black text-[var(--primary)]">
                    {String(lesson.id).padStart(2, "0")}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">
                        {lesson.title}
                      </h3>

                      {lesson.completed && (
                        <CheckCircle2
                          size={17}
                          className="text-[var(--success)]"
                        />
                      )}
                    </div>

                    <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                      {lesson.description}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <BookOpen size={14} />
                      {lesson.duration}
                    </div>
                  </div>

                  <ArrowRight
                    size={20}
                    className="shrink-0 text-[var(--muted-foreground)] transition group-hover:translate-x-1 group-hover:text-[var(--primary)]"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center">
              <p className="font-semibold">
                Lessons coming soon
              </p>

              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                This module is currently being prepared.
              </p>
            </div>
          )}
        </section>

        {/* Final Assessment */}
        {moduleInfo.lessons.length > 0 && (
          <section className="mt-10 rounded-3xl border border-[var(--primary)] bg-[var(--card)] p-7 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
                  <Trophy size={24} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                    Assessment
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Module {moduleInfo.id} Final Test
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
                    Test everything you learned across all{" "}
                    {moduleInfo.lessons.length} lessons in this module.
                  </p>
                </div>
              </div>

              <Link
                href={`/modules/${moduleInfo.slug}/test`}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-bold text-[var(--primary-foreground)] transition hover:opacity-90"
              >
                Take Final Test
                <ArrowRight size={18} />
              </Link>
            </div>
          </section>
        )}

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Link
            href="/modules"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3.5 font-semibold transition hover:border-[var(--primary)] hover:bg-[var(--muted)]"
          >
            <ArrowLeft size={18} />
            Back to Modules
          </Link>

          {moduleInfo.lessons.length > 0 && (
            <Link
              href={`/modules/${moduleInfo.slug}/learn/${moduleInfo.lessons[0].slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3.5 font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
            >
              Begin Module
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}