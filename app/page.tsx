import Image from "next/image";

function OpsIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12 L20 6" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/** Minimal PostCard stand-in */
function PostCard({
  title,
  description,
  href = "#",
  latest = false,
}: {
  title: string;
  description: string;
  href?: string;
  latest?: boolean;
}) {
  return (
    <a
      href={href}
      className="block ops-card p-4 hover:bg-neutral-50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="ops-label">{latest ? "Latest" : "Article"}</span>
        <OpsIcon />
      </div>
      <h3 className="mt-2">{title}</h3>
      <p className="mt-1 text-sm text-neutral-700">{description}</p>
    </a>
  );
}

/** Divider */
function Divider() {
  return <hr className="ops-divider my-8" />;
}

export default function Page() {
  // Hard-coded blog list for now
  const RECOMMENDED = [
    {
      title: "Export Flow v2 — Notes from the Trenches",
      description:
        "Designing a predictable log export pipeline without surprises.",
    },
    {
      title: "Edge Reliability > Fancy Dashboards",
      description: "Operational heuristics that actually move MTTR down.",
    },
    {
      title: "What I Learned Building a Room Booking System",
      description: "Roles, conflicts, calendars, and the joy of constraints.",
    },
  ];

  const ALL_POSTS = [
    "How I Structure Internal Tools",
    "Unit Testing UI Logic Without a UI",
    "Notes on FPGA + Tiny Models",
    "Checklist: Shipping Small, Shipping Often",
  ];

  return (
    <div className="container-narrow">
      {/* INTRO */}
      <section id="intro" className="m-auto flex flex-col">
        <div className="flex flex-col gap-3 mt-6">
          <h1>
            Welcome To{" "}
            <strong className="text-green leading-4">
              Ali&apos;s Internal-Tool
            </strong>
          </h1>
          <p>
            hi! i’m ali, a software engineer in irvine, ca. i’m most alive
            working at the intersection of software and hardware—turning ideas
            into systems that run in the real world. i’m especially drawn to
            defense tech, where reliability isn’t optional.
          </p>
          <p>
            This page is a staging ground—intro first, then the internal tool
            area, and finally a blog list (hard-coded for now).
          </p>
        </div>

        <div className="px-2 py-6">
          {/* subtle instruction label */}
          <span className="ops-label">Scroll for tools</span>
        </div>

        <Divider />
      </section>

      {/* INTERNAL TOOL */}
      <section id="tools" className="m-auto">
        <h2>internal tool (alpha)</h2>
        <p className="text-neutral-700">
          Hard-coded tiles for projects I&apos;m about to build. Zero magic—just
          boxes and intent.
        </p>

        <div className="grid grid-cols-1 gap-4 pt-4">
          {/* Panda Express Monitor */}
          <div className="ops-card p-4">
            <div className="flex items-center justify-between">
              <span className="ops-label">Module</span>
              <OpsIcon />
            </div>
            <h3 className="mt-2">Panda Express Monitor</h3>
            <p className="mt-1 text-sm text-neutral-700">
              Polls nearby Panda locations for status &amp; specials. Aggregates
              hours, line estimates, and a simple “open/closed” signal.
            </p>
            <div className="mt-3 flex gap-2">
              <button className="btn">Open Console</button>
              <button className="btn-ghost">View Logs</button>
            </div>
          </div>

          {/* Spotify Randomizer of the Week */}
          <div className="ops-card p-4">
            <div className="flex items-center justify-between">
              <span className="ops-label">Module</span>
              <OpsIcon />
            </div>
            <h3 className="mt-2">Spotify Randomizer of the Week</h3>
            <p className="mt-1 text-sm text-neutral-700">
              Generates one randomized weekly playlist from seed artists/genres.
              Stores selection, exposes a simple share link.
            </p>
            <div className="mt-3 flex gap-2">
              <button className="btn">Generate</button>
              <button className="btn-ghost">History</button>
            </div>
          </div>

          {/* Log Export Center (BITE-like) */}
          <div className="ops-card p-4">
            <div className="flex items-center justify-between">
              <span className="ops-label">Module</span>
              <OpsIcon />
            </div>
            <h3 className="mt-2">Log Export Center</h3>
            <p className="mt-1 text-sm text-neutral-700">
              Deterministic exports for diagnostics. Pick timeframe &amp;
              source, then produce a signed artifact.
            </p>
            <div className="mt-3 flex gap-2">
              <button className="btn">Generate Export</button>
              <button className="btn-ghost">Configure</button>
            </div>
          </div>
        </div>

        <Divider />
      </section>

      {/* BLOG (hard-coded) */}
      <section id="blog" className="m-auto">
        <h2>i recommend reading...</h2>
        <div className="grid grid-cols-1 gap-4 pt-4">
          {RECOMMENDED.map((post, i) => (
            <PostCard
              key={post.title}
              title={post.title}
              description={post.description}
              latest={i === 0}
            />
          ))}
        </div>

        <Divider />

        <h2>everything else i&apos;ve written so far</h2>
        <div className="pt-4 space-y-2">
          {ALL_POSTS.map((t) => (
            <a key={t} href="#" className="block underline hover:no-underline">
              {t}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
