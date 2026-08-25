"use client";

import { useTheme, type ThemeColor } from "./ThemeProvider";

const themes: {
  id: ThemeColor;
  name: string;
  color: string;
}[] = [
  {
    id: "neon-blue",
    name: "Neon Blue",
    color: "#00e5ff",
  },
  {
    id: "blue",
    name: "Blue",
    color: "#2563eb",
  },
  {
    id: "green",
    name: "Green",
    color: "#16a34a",
  },
  {
    id: "neon-green",
    name: "Neon Green",
    color: "#39ff14",
  },
  {
    id: "neon-yellow",
    name: "Neon Yellow",
    color: "#eaff00",
  },
  {
    id: "red",
    name: "Red",
    color: "#ef4444",
  },
  {
    id: "purple",
    name: "Purple",
    color: "#9333ea",
  },
];

export default function ThemeSwitcher() {
  const { color, mode, setColor, setMode } = useTheme();

  return (
    <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--card-foreground)] shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Appearance</h2>

        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Customize your ICTNET101 experience.
        </p>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold">Color theme</p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setColor(theme.id)}
              className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition ${
                color === theme.id
                  ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
                  : "border-[var(--border)] hover:bg-[var(--muted)]"
              }`}
            >
              <span
                className="h-4 w-4 shrink-0 rounded-full"
                style={{ backgroundColor: theme.color }}
              />

              <span>{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold">Mode</p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode("light")}
            className={`rounded-xl border p-3 text-sm transition ${
              mode === "light"
                ? "border-[var(--primary)] bg-[var(--muted)]"
                : "border-[var(--border)]"
            }`}
          >
            ☀️ Light
          </button>

          <button
            onClick={() => setMode("dark")}
            className={`rounded-xl border p-3 text-sm transition ${
              mode === "dark"
                ? "border-[var(--primary)] bg-[var(--muted)]"
                : "border-[var(--border)]"
            }`}
          >
            🌙 Dark
          </button>
        </div>
      </div>
    </div>
  );
}