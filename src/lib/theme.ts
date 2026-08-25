export type ThemeColor =
  | "neon-blue"
  | "blue"
  | "green"
  | "neon-green"
  | "neon-yellow"
  | "red"
  | "purple";

export type ThemeMode = "light" | "dark";

export type Theme = {
  color: ThemeColor;
  mode: ThemeMode;
};

export const themeColors: Record<ThemeColor, string> = {
  "neon-blue": "#00e5ff",
  blue: "#2563eb",
  green: "#16a34a",
  "neon-green": "#39ff14",
  "neon-yellow": "#eaff00",
  red: "#ef4444",
  purple: "#9333ea",
};

export const themeNames: Record<ThemeColor, string> = {
  "neon-blue": "Neon Blue",
  blue: "Blue",
  green: "Green",
  "neon-green": "Neon Green",
  "neon-yellow": "Neon Yellow",
  red: "Red",
  purple: "Purple",
};