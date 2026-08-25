"use client";

import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  Clock3,
  Globe,
  Network,
  Router,
  Loader2,
} from "lucide-react";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type Lesson = {
  id: number;
  title: string;
  description: string;
  slug: string;
  duration: string;
  completed?: boolean;
};

type ModuleCardProps = {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficulty:
    | "Beginner"
    | "Intermediate"
    | "Advanced";
  estimatedTime: string;
  topics: string[];
  lessons: Lesson[];
};

export default function ModuleCard({
  id,
  slug,
  title,
  description,
  icon,
  difficulty,
  estimatedTime,
  topics,
  lessons,
}: ModuleCardProps) {
  const [completedLessons, setCompletedLessons] =
    useState(0);

  const [loadingProgress, setLoadingProgress] =
    useState(true);

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        /*
         * If there is no authenticated user,
         * fall back to the static lesson data.
         */
        if (!user) {
          if (active) {
            setCompletedLessons(
              lessons.filter(
                (lesson) => lesson.completed
              ).length
            );
          }

          return;
        }

        const {
          data,
          error,
        } = await supabase
          .from("lesson_progress")
          .select(
            "lesson_slug, completed"
          )
          .eq("user_id", user.id)
          .eq("module_slug", slug)
          .eq("completed", true);

        if (error) {
          throw error;
        }

        if (active) {
          setCompletedLessons(
            data?.length ?? 0
          );
        }
      } catch (error) {
        console.error(
          `Module ${id} progress load error:`,
          error
        );

        /*
         * Fall back to the local/static values
         * if Supabase cannot be reached.
         */
        if (active) {
          setCompletedLessons(
            lessons.filter(
              (lesson) => lesson.completed
            ).length
          );
        }
      } finally {
        if (active) {
          setLoadingProgress(false);
        }
      }
    }

    void loadProgress();

    return () => {
      active = false;
    };
  }, [id, lessons, slug]);

  const lessonCount =
    lessons.length;

  const progress =
    lessonCount === 0
      ? 0
      : Math.round(
          (completedLessons /
            lessonCount) *
            100
        );

  return (
    <Link
      href={`/modules/${slug}`}
      className="group block h-full"
    >
      <article className="flex h-full flex-col rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 transition duration-200 hover:-translate-y-1 hover:border-[var(--primary)] hover:bg-[var(--muted)]">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
            {icon === "Router" ? (
              <Router size={24} />
            ) : icon === "Globe" ? (
              <Globe size={24} />
            ) : (
              <Network size={24} />
            )}
          </div>

          <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-bold text-[var(--primary)]">
            Module {id}
          </span>
        </div>

        {/* Title */}
        <h2 className="mt-6 text-2xl font-black tracking-tight">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
          {description}
        </p>

        {/* Metadata */}
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--muted)] px-3 py-1.5 text-xs font-semibold">
            <BookOpen size={14} />

            {lessonCount}{" "}
            {lessonCount === 1
              ? "lesson"
              : "lessons"}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--muted)] px-3 py-1.5 text-xs font-semibold">
            <Clock3 size={14} />

            {estimatedTime}
          </span>

          <span className="rounded-lg bg-[var(--muted)] px-3 py-1.5 text-xs font-semibold">
            {difficulty}
          </span>
        </div>

        {/* Topics */}
        {topics.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              Topics
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {topics
                .slice(0, 5)
                .map((topic) => (
                  <span
                    key={topic}
                    className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs font-medium"
                  >
                    {topic}
                  </span>
                ))}

              {topics.length > 5 && (
                <span className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                  +{topics.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mt-auto pt-7">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold">
              Progress
            </span>

            <span className="flex items-center gap-2 text-[var(--muted-foreground)]">
              {loadingProgress && (
                <Loader2
                  size={13}
                  className="animate-spin"
                />
              )}

              {completedLessons}/
              {lessonCount}
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            {progress}% complete
          </p>
        </div>

        {/* Action */}
        <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-5">
          <span className="text-sm font-bold text-[var(--primary)]">
            Open module
          </span>

          <ArrowRight
            size={19}
            className="text-[var(--muted-foreground)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--primary)]"
          />
        </div>
      </article>
    </Link>
  );
}