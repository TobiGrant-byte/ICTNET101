"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("mode");
    const mode = saved === "dark" ? "dark" : "light";

    document.documentElement.dataset.mode = mode;
  }, []);

  function toggleMode() {
    const next =
      document.documentElement.dataset.mode === "dark"
        ? "light"
        : "dark";

    document.documentElement.dataset.mode = next;

    window.localStorage.setItem("mode", next);

    setDark(next === "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleMode}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
      aria-label="Toggle light and dark mode"
      title="Toggle light and dark mode"
    >
      {dark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}