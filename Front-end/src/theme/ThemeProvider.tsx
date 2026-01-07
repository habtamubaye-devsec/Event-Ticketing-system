import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { ThemeContext, type ThemeMode } from "./theme-context";

const THEME_STORAGE_KEY = "qetero.theme";

function getInitialTheme(): ThemeMode {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeMode>(() => getInitialTheme());
  const isDark = theme === "dark";
  const transitionTimeoutRef = useRef<number | null>(null);

  const runThemeTransition = useCallback(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.add("q-theme-transition");

    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = window.setTimeout(() => {
      root.classList.remove("q-theme-transition");
      transitionTimeoutRef.current = null;
    }, 360);
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    runThemeTransition();
    setThemeState(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
  }, [runThemeTransition]);

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const antdConfig = useMemo(() => {
    return {
      algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: "#6366F1", // Indigo
        colorInfo: "#6366F1",
        colorSuccess: "#10B981",
        colorWarning: "#F59E0B",
        colorError: "#EF4444",
        borderRadius: 12,
        fontFamily:
          "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      },
    } as const;
  }, [isDark]);

  const value = useMemo(
    () => ({ theme, isDark, setTheme, toggleTheme }),
    [theme, isDark, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={antdConfig}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}
