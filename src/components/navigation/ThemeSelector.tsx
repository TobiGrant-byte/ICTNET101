"use client";

import { Palette } from "lucide-react";
import { useEffect, useRef } from "react";

const themes = [
  { value: "blue", label: "Blue" },
  { value: "neon-blue", label: "Neon Blue" },
  { value: "green", label: "Green" },
  { value: "neon-green", label: "Neon Green" },
  { value: "neon-yellow", label: "Neon Yellow" },
  { value: "red", label: "Red" },
  { value: "purple", label: "Purple" },
];

export default function ThemeSelector() {
  const selectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    const savedTheme =
      window.localStorage.getItem("theme");

    const isValidTheme = themes.some(
      (theme) => theme.value === savedTheme
    );

    const selectedTheme =
      isValidTheme && savedTheme
        ? savedTheme
        : "blue";

    document.documentElement.setAttribute(
      "data-theme",
      selectedTheme
    );

    if (selectRef.current) {
      selectRef.current.value = selectedTheme;
    }
  }, []);

  function changeTheme(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const selectedTheme = event.target.value;

    document.documentElement.setAttribute(
      "data-theme",
      selectedTheme
    );

    window.localStorage.setItem(
      "theme",
      selectedTheme
    );
  }

  return (
    <div className="relative flex items-center">
      <Palette
        size={17}
        className="pointer-events-none absolute left-3 z-10 text-[var(--muted-foreground)]"
      />

      <select
        ref={selectRef}
        defaultValue="blue"
        onChange={changeTheme}
        aria-label="Choose color theme"
        className="h-10 appearance-none rounded-xl border border-[var(--border)] bg-[var(--card)] pl-9 pr-8 text-sm font-medium text-[var(--foreground)] outline-none transition hover:border-[var(--primary)] focus:border-[var(--primary)]"
      >
        {themes.map((theme) => (
          <option
            key={theme.value}
            value={theme.value}
          >
            {theme.label}
          </option>
        ))}
      </select>
    </div>
  );
}