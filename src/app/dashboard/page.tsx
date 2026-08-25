import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  FlaskConical,
  Trophy,
} from "lucide-react";

import UserName from "@/components/auth/UserName";
import { createClient } from "@/lib/supabase/server";
import { modules } from "@/data/modules";

export const dynamic = "force-dynamic";

type LessonProgress = {
  module_slug: string;
  lesson_slug: string;
  completed: boolean;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error(
      "Dashboard authentication error:",
      userError
    );
  }

  if (!user) {
    redirect("/login");
  }

  /*
   * Load the student's actual lesson progress.
   */
  const {
    data: progressData,
    error: progressError,
  } = await supabase
    .from("lesson_progress")
    .select(
      "module_slug, lesson_slug, completed"
    )
    .eq("user_id", user.id);

  if (progressError) {
    console.error(
      "Dashboard progress error:",
      progressError
    );
  }

  const progressRows =
    (progressData as LessonProgress[]) ?? [];

  /*
   * Calculate progress for every module.
   */
  const moduleProgress = modules.map(
    (moduleInfo) => {
      const totalLessons =
        moduleInfo.lessons.length;

      const completedLessons =
        moduleInfo.lessons.filter(
          (lesson) =>
            progressRows.some(
              (progress) =>
                progress.module_slug ===
                  moduleInfo.slug &&
                progress.lesson_slug ===
                  lesson.slug &&
                progress.completed === true
            )
        ).length;

      const percentage =
        totalLessons === 0
          ? 0
          : Math.round(
              (completedLessons /
                totalLessons) *
                100
            );

      return {
        module: moduleInfo,
        totalLessons,
        completedLessons,
        percentage,
      };
    }
  );

  /*
   * Overall progress.
   */
  const totalLessons =
    moduleProgress.reduce(
      (sum, item) =>
        sum + item.totalLessons,
      0
    );

  const totalCompletedLessons =
    moduleProgress.reduce(
      (sum, item) =>
        sum + item.completedLessons,
      0
    );

  const overallProgress =
    totalLessons === 0
      ? 0
      : Math.round(
          (totalCompletedLessons /
            totalLessons) *
            100
        );

  /*
   * Find the first incomplete module.
   * If all modules are complete, use the last module.
   */
  const currentModule =
    moduleProgress.find(
      (item) =>
        item.percentage < 100 &&
        item.totalLessons > 0
    ) ??
    moduleProgress
      .slice()
      .reverse()
      .find(
        (item) =>
          item.totalLessons > 0
      ) ??
    null;

  const currentModuleProgress =
    currentModule?.percentage ?? 0;

  const currentModuleNumber =
    currentModule?.module.id ?? 1;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">

        {/* Header */}
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Student Dashboard
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Welcome back, <UserName />
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Your networking learning environment. Continue your lessons,
            practice in the lab, and complete your assessments.
          </p>
        </div>

        {/* Overall Progress */}
        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                Learning Progress
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Overall Course Progress
              </h2>

              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {totalCompletedLessons} of{" "}
                {totalLessons} lessons completed
              </p>
            </div>

            <p className="text-4xl font-black text-[var(--primary)]">
              {overallProgress}%
            </p>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all"
              style={{
                width: `${overallProgress}%`,
              }}
            />
          </div>
        </section>

        {/* Dashboard Cards */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">

          <DashboardCard
            icon={<BookOpen size={24} />}
            title="Learning"
            value={`Module ${currentModuleNumber}`}
            description={
              currentModule
                ? `${currentModule.completedLessons}/${currentModule.totalLessons} lessons completed`
                : "Continue your networking lessons."
            }
            href={
              currentModule
                ? `/modules/${currentModule.module.slug}`
                : "/modules"
            }
            action="Continue Learning"
            progress={currentModuleProgress}
          />

          <DashboardCard
            icon={<FlaskConical size={24} />}
            title="Networking Lab"
            value="Available"
            description="Practice real networking commands."
            href="/labs"
            action="Open Lab"
          />

          <DashboardCard
            icon={<Trophy size={24} />}
            title="Assessment"
            value={
              currentModule
                ? `Module ${currentModuleNumber}`
                : "Assessment"
            }
            description={
              currentModule
                ? "Complete your lessons and take the final assessment."
                : "View your available assessments."
            }
            href={
              currentModule
                ? `/modules/${currentModule.module.slug}/test`
                : "/modules"
            }
            action={
              currentModule?.percentage === 100
                ? "Take Test"
                : "View Module"
            }
          />
        </div>

        {/* Module Progress */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-9">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
              Your Modules
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Module Progress
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              Track your progress through every module and lesson.
            </p>
          </div>

          <div className="mt-7 space-y-5">
            {moduleProgress.map(
              ({
                module,
                totalLessons,
                completedLessons,
                percentage,
              }) => (
                <Link
                  key={module.slug}
                  href={`/modules/${module.slug}`}
                  className="group block rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--primary)] hover:bg-[var(--muted)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)]">
                        <BookOpen size={21} />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                          Module {module.id}
                        </p>

                        <h3 className="mt-1 font-bold">
                          {module.title}
                        </h3>

                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          {completedLessons}/
                          {totalLessons} lessons completed
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-black text-[var(--primary)]">
                          {percentage}%
                        </p>

                        <p className="text-[11px] text-[var(--muted-foreground)]">
                          Progress
                        </p>
                      </div>

                      <ArrowRight
                        size={19}
                        className="text-[var(--muted-foreground)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--primary)]"
                      />
                    </div>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--primary)] transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </Link>
              )
            )}
          </div>
        </section>

        {/* Account */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-9">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Account
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Welcome, <UserName />
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
            Your account system is connected to Supabase. Your learning
            progress, assessment results, and lab information are saved to
            your account.
          </p>
        </section>
      </section>
    </main>
  );
}

function DashboardCard({
  icon,
  title,
  value,
  description,
  href,
  action,
  progress,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  href: string;
  action: string;
  progress?: number;
}) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
        {icon}
      </div>

      <p className="mt-5 text-sm font-semibold text-[var(--muted-foreground)]">
        {title}
      </p>

      <h2 className="mt-1 text-2xl font-black">
        {value}
      </h2>

      <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
        {description}
      </p>

      {typeof progress === "number" && (
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold">
              Progress
            </span>

            <span className="text-[var(--muted-foreground)]">
              {progress}%
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}

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