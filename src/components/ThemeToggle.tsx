"use client";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-black dark:text-white transition"
    >
      <div className="h-5 w-5">{theme === "dark" ? "🌑" : "🌕"}</div>
    </button>
  );
}
