"use client";

import { ReactNode } from "react";

import LessonCompletionButton from "@/components/learning/LessonCompletionButton";
import LessonNavigation from "@/components/lessons/LessonNavigation";

type Module3LessonLayoutProps = {
  lessonSlug: string;
  lessonNumber: number;
  title: string;
  description: string;
  children: ReactNode;
};

export default function Module3LessonLayout({
  lessonSlug,
  lessonNumber,
  title,
  description,
  children,
}: Module3LessonLayoutProps) {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Module 3 • Lesson {lessonNumber}
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            {title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
            {description}
          </p>

          <div className="mt-10 space-y-8">
            {children}
          </div>
        </div>

        <LessonCompletionButton
          moduleSlug="network-services-security-troubleshooting"
          lessonSlug={lessonSlug}
        />

        <LessonNavigation
          currentLesson={lessonNumber}
        />
      </section>
    </main>
  );
}