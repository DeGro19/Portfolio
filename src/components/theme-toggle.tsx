"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useMounted } from "@/lib/hooks";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  // The server has no idea which theme the browser will resolve to, so both
  // the icon and the label can only be decided after hydration. Everything
  // theme-dependent stays neutral until then, otherwise the server and client
  // markup disagree. A same-sized placeholder keeps the layout from shifting.
  const isDark = mounted && resolvedTheme === "dark";
  const label = mounted
    ? isDark
      ? "Switch to light theme"
      : "Switch to dark theme"
    : "Toggle theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      className="border-border bg-card text-foreground hover:border-accent hover:text-accent grid size-10 place-items-center rounded-full border transition-colors"
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-5" aria-hidden />
        ) : (
          <Moon className="size-5" aria-hidden />
        )
      ) : (
        <span className="size-5" />
      )}
    </button>
  );
}
