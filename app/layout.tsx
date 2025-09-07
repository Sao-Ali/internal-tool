import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Ali's Tool",
  description: "Utilitarian internal tools and notes — by Ali.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 antialiased">
        {/* Top bar (straight lines, minimal) */}
        <header className="border-b border-black">
          <div className="container-narrow flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div
                aria-hidden
                className="w-6 h-6 border border-black grid place-items-center"
                title="Unit Patch"
              >
                {/* tiny patch glyph */}
                <span className="block w-3 h-3 border border-black" />
              </div>
              <span className="font-semibold">Ali&apos;s Tool</span>
            </div>
            <nav className="hidden sm:flex items-center gap-4 text-sm">
              <a className="hyperlink" href="#intro">
                Intro
              </a>
              <a className="hyperlink" href="#tools">
                Internal Tool
              </a>
              <a className="hyperlink" href="#blog">
                Blog
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-16 border-t border-black">
          <div className="container-narrow py-6 text-sm flex items-center justify-between">
            <p>© {new Date().getFullYear()} Ali.</p>
            <p className="ops-label">Build: mono · v0</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
