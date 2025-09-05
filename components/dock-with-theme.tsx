"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  IconHome,
  IconNotes,
  IconFileCv,
  IconTools,
} from "@tabler/icons-react";

export default function DockWithTheme() {
  // Items with only data (no functions) are fine
  const navItems = [
    { title: "Home", icon: <IconHome />, href: "/" },
    { title: "Resume", icon: <IconFileCv />, href: "/resume" },
    { title: "Docs", icon: <IconNotes />, href: "/docs" },
    { title: "Tools", icon: <IconTools />, href: "/tools" },
  ];

  // Add the Theme toggle as an "action" item by giving it an onClick.
  // Since we're in a CLIENT component, passing the handler is allowed.
  const items = [
    ...navItems,
    { title: "Theme", icon: <ThemeToggle size={20} />, onClick: () => {} },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center md:justify-center">
      <FloatingDock
        items={items}
        desktopClassName="pointer-events-auto"
        mobileClassName="pointer-events-auto fixed bottom-6 right-6"
      />
    </div>
  );
}
