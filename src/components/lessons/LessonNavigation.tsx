"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Trophy,
} from "lucide-react";

import { modules } from "@/data/modules";

type LessonNavigationProps = {
  currentLesson?: number;
};

export default function LessonNavigation({
  currentLesson,
}: LessonNavigationProps) {
  const pathname = usePathname();

  const parts = pathname
    .split("/")
    .filter(Boolean);

  const moduleSlug = parts[1] ?? "";
  const lessonSlug = parts[3] ?? "";

  const moduleInfo = modules.find(
    (module) =>
      module.slug === moduleSlug
  );

  if (!moduleInfo) {
    return null;
  }

  const lessons = moduleInfo.lessons;

  const detectedIndex =
    lessons.findIndex(
      (lesson) =>
        lesson.slug === lessonSlug
    );

  const currentIndex =
    detectedIndex >= 0
      ? detectedIndex
      : typeof currentLesson === "number"
        ? currentLesson - 1
        : 0;

  const currentLessonInfo =
    lessons[currentIndex];

  if (!currentLessonInfo) {
    return null;
  }

  const previousLesson =
    currentIndex > 0
      ? lessons[currentIndex - 1]
      : null;

  const nextLesson =
    currentIndex <
    lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  return (
    <nav className="mt-10 border-t border-[var(--border)] pt-8">
      <div className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
        Module {moduleInfo.id} • Lesson{" "}
        {currentIndex + 1} of {lessons.length}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {previousLesson ? (
          <Link
            href={`/modules/${moduleInfo.slug}/learn/${previousLesson.slug}`}
            className="group flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 transition hover:border-[var(--primary)] hover:bg-[var(--muted)]"
          >
            <ArrowLeft
              size={19}
              className="shrink-0 text-[var(--primary)] transition-transform group-hover:-translate-x-1"
            />

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Previous Lesson
              </p>

              <p className="mt-1 truncate text-sm font-bold">
                {previousLesson.title}
              </p>
            </div>
          </Link>
        ) : (
          <Link
            href={`/modules/${moduleInfo.slug}`}
            className="group flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 transition hover:border-[var(--primary)] hover:bg-[var(--muted)]"
          >
            <ArrowLeft
              size={19}
              className="shrink-0 text-[var(--primary)] transition-transform group-hover:-translate-x-1"
            />

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Back
              </p>

              <p className="mt-1 text-sm font-bold">
                Module Overview
              </p>
            </div>
          </Link>
        )}

        {nextLesson ? (
          <Link
            href={`/modules/${moduleInfo.slug}/learn/${nextLesson.slug}`}
            className="group flex items-center justify-end gap-3 rounded-2xl bg-[var(--primary)] px-5 py-4 text-right text-[var(--primary-foreground)] transition hover:opacity-90"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Next Lesson
              </p>

              <p className="mt-1 truncate text-sm font-bold">
                {nextLesson.title}
              </p>
            </div>

            <ArrowRight
              size={19}
              className="shrink-0 transition-transform group-hover:translate-x-1"
            />
          </Link>
        ) : (
          <Link
            href={`/modules/${moduleInfo.slug}/test`}
            className="group flex items-center justify-end gap-3 rounded-2xl bg-[var(--primary)] px-5 py-4 text-right text-[var(--primary-foreground)] transition hover:opacity-90"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Module Complete
              </p>

              <p className="mt-1 text-sm font-bold">
                Take Final Test
              </p>
            </div>

            <Trophy
              size={19}
              className="shrink-0 transition-transform group-hover:scale-110"
            />
          </Link>
        )}
      </div>
    </nav>
  );
}