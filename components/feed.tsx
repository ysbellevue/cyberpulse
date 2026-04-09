"use client";

import { useState, useMemo } from "react";
import type { Article } from "@/lib/fetch-feeds";

const BLUE = "#2B6FFB";
const NAVY = "#0B0D10";
const S700 = "#374151";
const S500 = "#71717A";
const S400 = "#A1A1AA";
const S300 = "#D1D5DB";
const S200 = "#E5E7EB";
const S100 = "#F3F4F6";
const S50 = "#F9FAFB";
const WHITE = "#FFFFFF";
const PAYWALL_BG = "#FEF9C3";
const PAYWALL_TEXT = "#A16207";
const PAYWALL_BORDER = "#FDE68A";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "executive", label: "Executive" },
  { key: "threat-intel", label: "Threat Intel" },
  { key: "vulnerabilities", label: "Vulnerabilities" },
  { key: "ransomware", label: "Ransomware" },
  { key: "cloud-security", label: "Cloud Security" },
  { key: "privacy-policy", label: "Privacy & Policy" },
  { key: "ai-security", label: "AI Security" },
  { key: "devsecops", label: "DevSecOps" },
  { key: "ics-ot", label: "ICS / OT" },
  { key: "appsec", label: "AppSec" },
];

function relativeTime(h: number): string {
  if (h < 1) return `${Math.round(h * 60)}m ago`;
  if (h < 24) return `${Math.round(h)}h ago`;
  if (h < 48) return "yesterday";
  return `${Math.round(h / 24)}d ago`;
}

export default function Feed({
  articles,
  sourceCount,
  lastUpdated,
}: {
  articles: Article[];
  sourceCount: number;
  lastUpdated: string;
}) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");
  const [show, setShow] = useState(25);

  const filtered = useMemo(() => {
    let r = articles;
    if (cat === "executive") {
      r = r.filter((a) => a.audience === "executive" || a.audience === "both");
    } else if (cat !== "all") {
      r = r.filter((a) => a.tags.includes(cat));
    }
    if (q.trim()) {
      const lq = q.toLowerCase();
      r = r.filter(
        (a) =>
          a.title.toLowerCase().includes(lq) ||
          a.source.toLowerCase().includes(lq)
      );
    }
    if (sort === "source")
      r = [...r].sort((a, b) => a.source.localeCompare(b.source));
    return r;
  }, [articles, cat, q, sort]);

  const visible = filtered.slice(0, show);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Count for executive chip
  const execCount = articles.filter(
    (a) => a.audience === "executive" || a.audience === "both"
  ).length;

  function chipCount(key: string): number {
    if (key === "all") return articles.length;
    if (key === "executive") return execCount;
    return articles.filter((a) => a.tags.includes(key)).length;
  }

  return (
    <>
      {/* HEADER */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${S200}`,
          padding: "0 32px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1152,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{ width: 8, height: 8, borderRadius: 2, background: BLUE }}
          />
          <span
            style={{
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: "-0.02em",
              color: NAVY,
            }}
          >
            CyberPulse
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: S500 }}>
            {sourceCount} sources
          </span>
          <span style={{ fontSize: 12, color: S400 }}>·</span>
          <span style={{ fontSize: 12, color: S500 }}>
            Updated{" "}
            {new Date(lastUpdated).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </header>

      <div style={{ borderBottom: `1px solid ${S200}` }} />

      {/* HERO */}
      <div
        style={{
          padding: "56px 32px 40px",
          maxWidth: 780,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: BLUE,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Daily Intelligence Brief
        </p>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
            marginBottom: 16,
            color: NAVY,
          }}
        >
          Today&#39;s Cybersecurity Intelligence
        </h1>
        <p style={{ fontSize: 15, color: S500, lineHeight: 1.6 }}>
          {today}. Aggregated from {sourceCount} trusted sources, updated every
          15 minutes.
        </p>
      </div>

      {/* CONTROLS */}
      <div
        style={{ maxWidth: 780, margin: "0 auto", padding: "0 32px 28px" }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 20,
          }}
        >
          {CATEGORIES.map((c) => {
            const active = cat === c.key;
            const count = chipCount(c.key);
            const isExec = c.key === "executive";
            return (
              <button
                key={c.key}
                onClick={() => {
                  setCat(c.key);
                  setShow(25);
                }}
                style={{
                  background: active
                    ? isExec
                      ? NAVY
                      : BLUE
                    : WHITE,
                  border: `1px solid ${
                    active ? (isExec ? NAVY : BLUE) : S200
                  }`,
                  borderRadius: 6,
                  padding: "7px 14px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? WHITE : isExec ? NAVY : S700,
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.15s ease",
                }}
              >
                {c.label}
                <span
                  style={{
                    marginLeft: 6,
                    fontSize: 11,
                    opacity: active ? 0.7 : 0.4,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Search headlines or sources…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setShow(25);
            }}
            style={{
              flex: 1,
              padding: "10px 14px",
              background: WHITE,
              border: `1px solid ${S200}`,
              borderRadius: 8,
              color: NAVY,
              fontSize: 14,
              fontFamily: "'Inter', sans-serif",
              outline: "none",
            }}
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              background: WHITE,
              border: `1px solid ${S200}`,
              borderRadius: 8,
              color: S700,
              fontSize: 13,
              padding: "10px 14px",
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              outline: "none",
              minWidth: 140,
            }}
          >
            <option value="newest">Newest First</option>
            <option value="source">Source A → Z</option>
          </select>
        </div>

        <div
          style={{
            fontSize: 12,
            color: S400,
            textAlign: "right",
            marginTop: 10,
          }}
        >
          {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          {cat !== "all" &&
            ` in ${CATEGORIES.find((c) => c.key === cat)?.label}`}
          {q && ` matching "${q}"`}
        </div>
      </div>

      {/* DIVIDER */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ height: 1, background: S200 }} />
      </div>

      {/* FEED */}
      <div
        style={{ maxWidth: 780, margin: "0 auto", padding: "4px 32px 80px" }}
      >
        {visible.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px 24px",
              color: S400,
            }}
          >
            <div style={{ fontSize: 14, marginBottom: 16 }}>
              No articles match your filters.
            </div>
            <button
              onClick={() => {
                setCat("all");
                setQ("");
              }}
              style={{
                background: WHITE,
                border: `1px solid ${S200}`,
                borderRadius: 6,
                padding: "8px 18px",
                color: BLUE,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          visible.map((a, i) => (
            <a
              key={`${a.url}-${i}`}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                gap: 16,
                padding: "16px 8px",
                textDecoration: "none",
                color: "inherit",
                borderBottom: `1px solid ${S100}`,
                borderRadius: 6,
              }}
            >
              <div
                style={{
                  minWidth: 24,
                  fontSize: 13,
                  fontWeight: 600,
                  color: S300,
                  paddingTop: 1,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: 1.55,
                    color: NAVY,
                    marginBottom: 8,
                  }}
                >
                  {a.title}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: BLUE }}
                  >
                    {a.source}
                  </span>
                  <span style={{ color: S300, fontSize: 10 }}>·</span>
                  <span style={{ fontSize: 12, color: S500 }}>
                    {relativeTime(a.hoursAgo)}
                  </span>

                  {/* Paywall tag */}
                  {a.paywalled && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: PAYWALL_TEXT,
                        background: PAYWALL_BG,
                        border: `1px solid ${PAYWALL_BORDER}`,
                        borderRadius: 4,
                        padding: "2px 7px",
                        letterSpacing: "0.02em",
                      }}
                    >
                      paywall
                    </span>
                  )}

                  {/* Topic tags */}
                  {a.tags
                    .filter((t) => t !== "general")
                    .map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: S500,
                          background: S100,
                          borderRadius: 4,
                          padding: "2px 8px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </div>

              <div
                style={{
                  color: S300,
                  fontSize: 14,
                  flexShrink: 0,
                  paddingTop: 1,
                }}
              >
                ↗
              </div>
            </a>
          ))
        )}

        {filtered.length > show && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button
              onClick={() => setShow((s) => s + 25)}
              style={{
                background: WHITE,
                border: `1px solid ${S200}`,
                borderRadius: 8,
                padding: "12px 32px",
                cursor: "pointer",
                color: S700,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Load more · {filtered.length - show} remaining
            </button>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: `1px solid ${S200}`,
          padding: "36px 32px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          {["About", "Sources", "Methodology", "Contact", "Privacy"].map(
            (l) => (
              <span
                key={l}
                style={{
                  fontSize: 13,
                  color: S500,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {l}
              </span>
            )
          )}
        </div>
        <p style={{ fontSize: 12, color: S400, lineHeight: 1.7 }}>
          CyberPulse aggregates headlines from {sourceCount} sources. All
          content links to original publishers.
        </p>
        <p style={{ fontSize: 11, color: S300, marginTop: 8 }}>
          © {new Date().getFullYear()} CyberPulse
        </p>
      </footer>
    </>
  );
}
