import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Circle,
  FlaskConical,
  ShieldCheck,
  Trophy,
  UserRound,
  XCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { modules } from "@/data/modules";

export const dynamic = "force-dynamic";

type StudentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type AssessmentResult = {
  id: string;
  assessment_name: string;
  module_slug: string;
  knowledge_score: number;
  knowledge_total: number;
  practical_score: number;
  practical_total: number;
  total_score: number;
  total_possible: number;
  percentage: number;
  passed: boolean;
  completed_at: string;
};

type LessonProgress = {
  module_slug: string;
  lesson_slug: string;
  completed: boolean;
  completed_at: string | null;
};

export default async function AdminStudentDetailsPage({
  params,
}: StudentPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  /*
   * Authenticate current admin.
   */
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error(
      "Admin authentication error:",
      userError
    );
  }

  if (!user) {
    redirect("/login");
  }

  /*
   * Verify admin role.
   */
  const {
    data: adminProfile,
    error: adminError,
  } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (adminError) {
    console.error(
      "Admin profile lookup error:",
      adminError
    );
  }

  if (adminProfile?.role !== "admin") {
    redirect("/dashboard");
  }

  /*
   * Load selected student.
   */
  const {
    data: student,
    error: studentError,
  } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", id)
    .maybeSingle();

  if (studentError) {
    console.error(
      "Student lookup error:",
      studentError
    );
  }

  if (
    !student ||
    student.role !== "student"
  ) {
    notFound();
  }

  /*
   * Load all lesson progress for this student.
   */
  const {
    data: progressData,
    error: progressError,
  } = await supabase
    .from("lesson_progress")
    .select(
      "module_slug, lesson_slug, completed, completed_at"
    )
    .eq("user_id", student.id);

  if (progressError) {
    console.error(
      "Student lesson progress error:",
      progressError
    );
  }

  const lessonProgress =
    (progressData as LessonProgress[]) ?? [];

  /*
   * Load ALL assessment attempts for this student.
   */
  const {
    data: assessmentData,
    error: assessmentError,
  } = await supabase
    .from("assessment_results")
    .select(
      `
        id,
        assessment_name,
        module_slug,
        knowledge_score,
        knowledge_total,
        practical_score,
        practical_total,
        total_score,
        total_possible,
        percentage,
        passed,
        completed_at
      `
    )
    .eq("user_id", student.id)
    .order("completed_at", {
      ascending: false,
    });

  if (assessmentError) {
    console.error(
      "Student assessment history error:",
      assessmentError
    );
  }

  const results =
    (assessmentData as AssessmentResult[]) ?? [];

  const latestResult =
    results[0] ?? null;

  /*
   * Calculate progress for every module.
   *
   * IMPORTANT:
   * Progress is calculated using the lesson slugs
   * defined in modules.ts and matched against the
   * lesson_progress table.
   */
  const moduleProgress = modules.map(
    (moduleInfo) => {
      const totalLessons =
        moduleInfo.lessons.length;

      const completedLessons =
        moduleInfo.lessons.filter(
          (lesson) =>
            lessonProgress.some(
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
   * Overall progress across all modules.
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
   * Current module =
   * first module that isn't complete.
   *
   * If everything is complete, use the last module.
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

  const firstName =
    student.full_name
      ?.trim()
      .split(/\s+/)[0] ||
    "Student";

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">

        {/* Back */}
        <Link
          href="/admin/students"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition hover:underline"
        >
          <ArrowLeft size={17} />
          Back to Students
        </Link>

        {/* Student Header */}
        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
              <UserRound size={30} />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                Student Profile
              </p>

              <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                {student.full_name ||
                  "Unnamed Student"}
              </h1>

              <p className="mt-1 break-all text-sm text-[var(--muted-foreground)]">
                {student.id}
              </p>
            </div>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--muted)] px-4 py-3 text-sm font-bold text-[var(--primary)]">
            <ShieldCheck size={17} />
            {student.role}
          </span>
        </div>

        {/* Overview Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<BookOpen size={22} />}
            label="Current Module"
            value={
              currentModule
                ? `Module ${currentModule.module.id}`
                : "Complete"
            }
          />

          <SummaryCard
            icon={<CheckCircle2 size={22} />}
            label="Overall Progress"
            value={`${overallProgress}%`}
          />

          <SummaryCard
            icon={<Trophy size={22} />}
            label="Assessment Attempts"
            value={results.length}
          />

          <SummaryCard
            icon={<Trophy size={22} />}
            label="Latest Score"
            value={
              latestResult
                ? `${Number(
                    latestResult.percentage
                  )}%`
                : "Not recorded"
            }
          />
        </div>

        {/* Learning Progress */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-9">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
              Learning Progress
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Modules & Lessons
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              Track each module and the individual lessons completed by this
              student.
            </p>
          </div>

          <div className="mt-8 space-y-8">
            {moduleProgress.map(
              ({
                module,
                totalLessons,
                completedLessons,
                percentage,
              }) => (
                <div
                  key={module.slug}
                  className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)]"
                >
                  {/* Module Header */}
                  <div className="p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)]">
                          <BookOpen size={22} />
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                            Module {module.id}
                          </p>

                          <h3 className="mt-1 text-xl font-black">
                            {module.title}
                          </h3>

                          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            {completedLessons} of{" "}
                            {totalLessons} lessons completed
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-3xl font-black text-[var(--primary)]">
                          {percentage}%
                        </p>

                        <p className="text-xs text-[var(--muted-foreground)]">
                          Module progress
                        </p>
                      </div>
                    </div>

                    {/* Module progress bar */}
                    <div className="mt-6">
                      <div className="h-3 overflow-hidden rounded-full bg-[var(--muted)]">
                        <div
                          className="h-full rounded-full bg-[var(--primary)] transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="border-t border-[var(--border)]">
                    {module.lessons.length === 0 ? (
                      <div className="p-6 text-sm text-[var(--muted-foreground)]">
                        Lessons coming soon.
                      </div>
                    ) : (
                      module.lessons.map(
                        (lesson, index) => {
                          const completed =
                            lessonProgress.some(
                              (progress) =>
                                progress.module_slug ===
                                  module.slug &&
                                progress.lesson_slug ===
                                  lesson.slug &&
                                progress.completed ===
                                  true
                            );

                          const completionRecord =
                            lessonProgress.find(
                              (progress) =>
                                progress.module_slug ===
                                  module.slug &&
                                progress.lesson_slug ===
                                  lesson.slug &&
                                progress.completed ===
                                  true
                            );

                          return (
                            <Link
                              key={lesson.id}
                              href={`/modules/${module.slug}/learn/${lesson.slug}`}
                              className={`group flex items-center gap-4 p-5 transition hover:bg-[var(--muted)] ${
                                index <
                                module.lessons.length -
                                  1
                                  ? "border-b border-[var(--border)]"
                                  : ""
                              }`}
                            >
                              {/* Lesson number/status */}
                              <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                  completed
                                    ? "bg-green-500/10 text-green-500"
                                    : "bg-[var(--muted)] text-[var(--primary)]"
                                }`}
                              >
                                {completed ? (
                                  <CheckCircle2
                                    size={21}
                                  />
                                ) : (
                                  <Circle
                                    size={21}
                                  />
                                )}
                              </div>

                              {/* Lesson content */}
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-bold">
                                    {lesson.title}
                                  </p>

                                  {completed && (
                                    <span className="rounded-full bg-green-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                                      Completed
                                    </span>
                                  )}
                                </div>

                                <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                                  {lesson.description}
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)]">
                                  <span className="inline-flex items-center gap-1">
                                    <BookOpen size={13} />
                                    Lesson {lesson.id}
                                  </span>

                                  <span>
                                    {lesson.duration}
                                  </span>

                                  {completionRecord?.completed_at && (
                                    <span>
                                      Completed{" "}
                                      {formatDate(
                                        completionRecord.completed_at
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <ArrowRight
                                size={19}
                                className="shrink-0 text-[var(--muted-foreground)] transition group-hover:translate-x-1 group-hover:text-[var(--primary)]"
                              />
                            </Link>
                          );
                        }
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* Assessment History */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-9">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
              Assessment History
            </p>

            <h2 className="mt-1 text-2xl font-black">
              All Assessment Attempts
            </h2>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Every saved assessment completed by this student.
            </p>
          </div>

          {results.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted)] p-8 text-center">
              <Trophy
                size={30}
                className="mx-auto text-[var(--primary)]"
              />

              <h3 className="mt-4 text-xl font-black">
                No Assessment Attempts
              </h3>

              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {firstName} has not completed a saved assessment yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
              <div className="hidden grid-cols-[1.5fr_150px_140px_140px_150px] gap-4 border-b border-[var(--border)] bg-[var(--muted)] px-5 py-4 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] lg:grid">
                <span>Assessment</span>
                <span>Module</span>
                <span>Score</span>
                <span>Date</span>
                <span>Status</span>
              </div>

              {results.map(
                (result, index) => {
                  const moduleInfo =
                    modules.find(
                      (module) =>
                        module.slug ===
                        result.module_slug
                    );

                  return (
                    <div
                      key={result.id}
                      className={`grid gap-4 px-5 py-5 lg:grid-cols-[1.5fr_150px_140px_140px_150px] lg:items-center ${
                        index <
                        results.length - 1
                          ? "border-b border-[var(--border)]"
                          : ""
                      }`}
                    >
                      <div>
                        <p className="font-bold">
                          {result.assessment_name}
                        </p>

                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          {result.total_score}/
                          {result.total_possible} points
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] lg:hidden">
                          Module
                        </p>

                        <p className="mt-1 text-sm font-semibold lg:mt-0">
                          {moduleInfo
                            ? `Module ${moduleInfo.id}`
                            : result.module_slug}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] lg:hidden">
                          Score
                        </p>

                        <p className="mt-1 font-black text-[var(--primary)] lg:mt-0">
                          {Number(
                            result.percentage
                          )}
                          %
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] lg:hidden">
                          Date
                        </p>

                        <p className="mt-1 text-sm lg:mt-0">
                          {formatDate(
                            result.completed_at
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] lg:hidden">
                          Status
                        </p>

                        <span
                          className={`mt-1 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold lg:mt-0 ${
                            result.passed
                              ? "bg-green-500/10 text-green-600 dark:text-green-400"
                              : "bg-red-500/10 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {result.passed ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}

                          {result.passed
                            ? "Passed"
                            : "Not Passed"}
                        </span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* Latest Assessment */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                Latest Assessment
              </p>

              <h2 className="mt-1 text-2xl font-black">
                {latestResult?.assessment_name ??
                  "No Assessment"}
              </h2>
            </div>

            {latestResult && (
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
                  latestResult.passed
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {latestResult.passed ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <XCircle size={17} />
                )}

                {latestResult.passed
                  ? "Passed"
                  : "Not Passed"}
              </span>
            )}
          </div>

          {latestResult ? (
            <>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ResultCard
                  label="Overall"
                  value={`${Number(
                    latestResult.percentage
                  )}%`}
                />

                <ResultCard
                  label="Knowledge"
                  value={`${latestResult.knowledge_score}/${latestResult.knowledge_total}`}
                />

                <ResultCard
                  label="Practical"
                  value={`${latestResult.practical_score}/${latestResult.practical_total}`}
                />

                <ResultCard
                  label="Points"
                  value={`${latestResult.total_score}/${latestResult.total_possible}`}
                />
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <CalendarDays size={16} />
                Completed{" "}
                {formatDate(
                  latestResult.completed_at
                )}
              </div>
            </>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted)] p-8 text-center">
              <Trophy
                size={30}
                className="mx-auto text-[var(--primary)]"
              />

              <p className="mt-4 font-bold">
                No assessment has been recorded.
              </p>
            </div>
          )}
        </section>

        {/* Networking Lab */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)]">
              <FlaskConical size={21} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                Networking Lab
              </p>

              <h2 className="text-xl font-black">
                Student Lab Environment
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
            This student&apos;s Docker lab is associated with their
            authenticated account. Live container IP and status are monitored
            from the Networking Labs administration page.
          </p>

          <Link
            href="/admin/labs"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] hover:underline"
          >
            Open Networking Labs
            <ArrowRight size={16} />
          </Link>
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
  value: string | number;
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

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
      <p className="text-sm font-semibold text-[var(--muted-foreground)]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[var(--primary)]">
        {value}
      </p>
    </div>
  );
}

function formatDate(
  value: string | null
) {
  if (!value) {
    return "Not recorded";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}