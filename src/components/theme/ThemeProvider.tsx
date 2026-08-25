"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeColor =
  | "neon-blue"
  | "blue"
  | "green"
  | "neon-green"
  | "neon-yellow"
  | "red"
  | "purple";

export type ThemeMode = "light" | "dark";

interface ThemeContextType {
  color: ThemeColor;
  mode: ThemeMode;
  setColor: (color: ThemeColor) => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

function getSavedColor(): ThemeColor {
  if (typeof window === "undefined") {
    return "blue";
  }

  const saved = localStorage.getItem("ictnet101-color");

  const validColors: ThemeColor[] = [
    "neon-blue",
    "blue",
    "green",
    "neon-green",
    "neon-yellow",
    "red",
    "purple",
  ];

  if (saved && validColors.includes(saved as ThemeColor)) {
    return saved as ThemeColor;
  }

  return "blue";
}

function getSavedMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const saved = localStorage.getItem("ictnet101-mode");

  if (saved === "dark" || saved === "light") {
    return saved;
  }

  return "light";
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [color, setColor] = useState<ThemeColor>(getSavedColor);
  const [mode, setMode] = useState<ThemeMode>(getSavedMode);

  useEffect(() => {
    document.documentElement.dataset.theme = color;
    document.documentElement.dataset.mode = mode;

    localStorage.setItem("ictnet101-color", color);
    localStorage.setItem("ictnet101-mode", mode);
  }, [color, mode]);

  return (
    <ThemeContext.Provider
      value={{
        color,
        mode,
        setColor,
        setMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}