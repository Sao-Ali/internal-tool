"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ThemeGlyph({ size = 20 }: { size?: number }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // while SSR -> client hydrates, render a placeholder box (prevents mismatch/shift)
  if (!mounted)
    return (
      <span style={{ width: size, height: size, display: "inline-block" }} />
    );

  const isDark = (resolvedTheme ?? theme) === "dark";
  return isDark ? <IconSun size={size} /> : <IconMoon size={size} />;
}
