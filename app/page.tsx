"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import { ThemeGlyph } from "@/components/theme-glyph";
import { useTheme } from "next-themes";
import {
  IconHome,
  IconNotes,
  IconFileCv,
  IconTools,
} from "@tabler/icons-react";

const projects = [
  {
    title: "Avionics: BITE Fault Export",
    blurb: "Production tool for technicians — reliability-first.",
    href: "/tools/bite-export",
  },
  {
    title: "Edge AI on FPGA",
    blurb: "On-device inference for constrained hardware.",
    href: "/docs/edge-ai-notes",
  },
  {
    title: "Room Booking Platform",
    blurb: "Custom calendar + auth; serving 3k+ students.",
    href: "/docs/room-booking",
  },
];

export default function Home() {
  const { setTheme, resolvedTheme, theme } = useTheme();
  const isDark = (resolvedTheme ?? theme) === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const dockItems = [
    { title: "Home", icon: <IconHome />, href: "/" },
    { title: "Resume", icon: <IconFileCv />, href: "/resume" },
    { title: "Docs", icon: <IconNotes />, href: "/docs" },
    { title: "Tools", icon: <IconTools />, href: "/tools" },
    // Theme toggle: icon only, click handled by the dock's outer button (no nested buttons)
    { title: "Theme", icon: <ThemeGlyph size={20} />, onClick: toggleTheme },
  ];

  return (
    <main className="min-h-[100dvh] text-neutral-900 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 md:py-24">
        {/* hero */}
        <section className="grid items-center gap-8 md:grid-cols-[280px_1fr]">
          <div className="relative">
            <img
              src="/ali.jpg"
              alt="Portrait of Ali"
              className="aspect-[4/5] w-full rounded-2xl object-cover ring-1"
              style={{ boxShadow: `0 1px 0 var(--ring)` }}
            />
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Ali Sao
            </h1>
            <p className="mt-4 text-neutral-700 dark:text-zinc-400 max-w-prose">
              I build reliable systems that ship: embedded, FPGA, and production
              web. One-stop place for my work — clean, fast, defense-grade.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/resume"
                className="px-4 py-2 rounded-lg ring-1 hover:bg-black/[.03] dark:hover:bg-white/[.05]"
                style={{ boxShadow: `0 1px 0 var(--ring)` }}
              >
                Resume
              </a>
              <a
                href="/docs"
                className="px-4 py-2 rounded-lg ring-1 hover:bg-black/[.03] dark:hover:bg-white/[.05]"
                style={{ boxShadow: `0 1px 0 var(--ring)` }}
              >
                Docs / Blog
              </a>
              <a
                href="/tools"
                className="px-4 py-2 rounded-lg ring-1"
                style={{
                  background: "var(--bubble)",
                  boxShadow: `0 1px 0 var(--ring)`,
                }}
              >
                Tools
              </a>
            </div>
          </div>
        </section>

        {/* Now / projects */}
        <section className="mt-16">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg text-neutral-800 dark:text-zinc-300">Now</h2>
            <a
              href="/projects"
              className="text-sm text-blue-700 dark:text-emerald-300 hover:underline"
            >
              All projects →
            </a>
          </div>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {projects.map((p) => (
              <li key={p.title}>
                <a
                  href={p.href}
                  className="block rounded-xl p-4 ring-1 card-surface hover:opacity-95"
                >
                  <div className="font-medium">{p.title}</div>
                  <div className="mt-1 text-sm text-neutral-700 dark:text-zinc-400">
                    {p.blurb}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Dock */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
        <FloatingDock
          items={dockItems}
          desktopClassName="pointer-events-auto"
          mobileClassName="pointer-events-auto fixed bottom-6 right-6"
        />
      </div>
    </main>
  );
}
