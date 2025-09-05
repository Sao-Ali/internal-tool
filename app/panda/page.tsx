"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Panda.module.css";

type TeamSide = {
  name?: string;
  abbr?: string;
  score?: number;
  wins?: number;
  losses?: number;
  home: boolean;
  winner?: boolean;
};

type Game = {
  date?: string;
  venue?: string;
  status?: string;
  home: TeamSide;
  away: TeamSide;
};

type PandaResp = {
  dateChecked?: string;
  live: boolean;
  error?: string;
  game?: Game | null;
};

function StatusPill({ live }: { live: boolean }) {
  return (
    <span
      className={`${styles.statusBadge} ${live ? styles.statusYes : styles.statusNo}`}
      aria-live="polite"
    >
      {live ? "YES" : "NO"}
    </span>
  );
}

function LogoCircle({ abbr }: { abbr?: string }) {
  const text = (abbr || "NA").slice(0, 3).toUpperCase();
  return <div className={styles.logoCircle}>{text}</div>;
}

function Record({ w = 0, l = 0 }: { w?: number; l?: number }) {
  return (
    <span className={styles.record}>
      {w}-{l}
    </span>
  );
}

export default function PandaPage() {
  const [data, setData] = useState<PandaResp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/panda", { cache: "no-store" });
        if (!res.ok) {
          setData({ live: false, error: "bad_status" });
        } else {
          const json = (await res.json()) as PandaResp;
          setData(json);
        }
      } catch {
        setData({ live: false, error: "unreachable" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const g = data?.game ?? undefined;
  const isFinal = (g?.status || "").toUpperCase().includes("FINAL");

  const infoLine = g
    ? `Source: ${g.date ?? data?.dateChecked ?? ""} • ${g.venue ?? ""} • ${g.status ?? ""}`
    : data?.dateChecked
      ? `Source: ${data?.dateChecked}`
      : "Source: Yesterday’s Dodgers home result (PT)";

  return (
    <main className={styles.root}>
      {/* Top bar */}
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link href="/" className={styles.homeLink}>
            ← Home
          </Link>
          <div className={styles.brand}>Panda Monitor</div>
        </div>
      </header>

      {/* Content */}
      <section className={styles.section}>
        <h1 className={styles.title}>Panda Express discount status</h1>

        <div className={styles.card}>
          {/* Status strip */}
          <div className={styles.row}>
            <div className={styles.label}>Status</div>
            {loading ? (
              <span className={styles.label}>Checking…</span>
            ) : (
              <StatusPill live={!!data?.live} />
            )}
          </div>

          {/* Matchup row: Away | center | Home */}
          <div className={styles.matchup}>
            {/* Away (left) */}
            <div className={`${styles.teamCol} ${styles.teamColLeft}`}>
              <LogoCircle abbr={g?.away?.abbr} />
              <div className={styles.teamMeta}>
                <div className={styles.teamName}>
                  {g?.away?.name ?? (loading ? "…" : "Away")}
                </div>
                <Record w={g?.away?.wins} l={g?.away?.losses} />
              </div>
            </div>

            {/* Center (score or VS + status) */}
            <div className={styles.centerCol}>
              {isFinal ? (
                <div className={styles.score}>
                  <span className={styles.scoreNum}>{g?.away?.score ?? 0}</span>
                  <span className={styles.scoreDash}>–</span>
                  <span className={styles.scoreNum}>{g?.home?.score ?? 0}</span>
                </div>
              ) : (
                <div className={styles.vs}>{loading ? "…" : "VS"}</div>
              )}
              <div className={styles.subStatus}>
                {g?.status ?? (loading ? "" : "")}
              </div>
            </div>

            {/* Home (right) */}
            <div className={`${styles.teamCol} ${styles.teamColRight}`}>
              <LogoCircle abbr={g?.home?.abbr} />
              <div className={styles.teamMeta}>
                <div className={styles.teamName}>
                  {g?.home?.name ?? (loading ? "…" : "Home")}
                </div>
                <Record w={g?.home?.wins} l={g?.home?.losses} />
              </div>
            </div>
          </div>

          {/* Details / notes */}
          <div className={styles.details}>
            <div className={styles.source}>
              {loading ? "Querying status…" : infoLine}
            </div>
            {!loading && data?.error && (
              <div className={styles.note}>
                Note:{" "}
                {data.error === "unreachable"
                  ? "Could not reach status API."
                  : `API error: ${data.error}`}
              </div>
            )}
            <p className={styles.footnote}>
              Discount shows “YES” on the day after a Dodgers{" "}
              <span className={styles.em}>home win</span> (Pacific Time).
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        Built for speed. Monochrome by choice.
      </footer>
    </main>
  );
}
