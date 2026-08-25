"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleCheck,
  Loader2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type LessonCompletionButtonProps = {
  moduleSlug: string;
  lessonSlug: string;
};

export default function LessonCompletionButton({
  moduleSlug,
  lessonSlug,
}: LessonCompletionButtonProps) {
  const [completed, setCompleted] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      try {
        const supabase = createClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          if (active) {
            setLoading(false);
          }

          return;
        }

        const {
          data,
          error: progressError,
        } = await supabase
          .from("lesson_progress")
          .select("completed")
          .eq("user_id", user.id)
          .eq("module_slug", moduleSlug)
          .eq("lesson_slug", lessonSlug)
          .maybeSingle();

        if (progressError) {
          throw progressError;
        }

        if (active) {
          setCompleted(
            data?.completed === true
          );
        }
      } catch (loadError) {
        console.error(
          "Lesson progress load error:",
          loadError
        );

        if (active) {
          setError(
            "Unable to load lesson progress."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProgress();

    return () => {
      active = false;
    };
  }, [moduleSlug, lessonSlug]);

  async function markComplete() {
    if (completed || saving) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setError(
          "Please sign in to save your progress."
        );
        return;
      }

      const {
        error: saveError,
      } = await supabase
        .from("lesson_progress")
        .upsert(
          {
            user_id: user.id,
            module_slug: moduleSlug,
            lesson_slug: lessonSlug,
            completed: true,
            completed_at: new Date().toISOString(),
          },
          {
            onConflict:
              "user_id,module_slug,lesson_slug",
          }
        );

      if (saveError) {
        throw saveError;
      }

      setCompleted(true);
    } catch (saveError) {
      console.error(
        "Lesson progress save error:",
        saveError
      );

      setError(
        "Your progress could not be saved. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mt-8 flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 text-sm text-[var(--muted-foreground)]">
        <Loader2
          size={17}
          className="mr-2 animate-spin"
        />
        Loading lesson progress...
      </div>
    );
  }

  return (
    <div className="mt-8">
      {completed ? (
        <div className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4">
          <CircleCheck
            size={21}
            className="shrink-0 text-green-500"
          />

          <div>
            <p className="font-bold text-green-600 dark:text-green-400">
              Lesson completed
            </p>

            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Your progress has been saved to your account.
            </p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={markComplete}
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-4 font-bold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <Loader2
              size={19}
              className="animate-spin"
            />
          ) : (
            <CheckCircle2 size={19} />
          )}

          {saving
            ? "Saving progress..."
            : "Mark Lesson Complete"}
        </button>
      )}

      {error && (
        <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}