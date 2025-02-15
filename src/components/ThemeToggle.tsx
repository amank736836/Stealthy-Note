"use client";

import { useEffect, useState } from "react";
import { Moon, MoonIcon, Sun, SunIcon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined"
      ? (localStorage.getItem("theme") ?? "light")
      : "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-black dark:text-white transition"
    >
      {theme === "dark" ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  );
}
