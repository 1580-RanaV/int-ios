"use client";

import { useState, useEffect, useRef } from "react";
import { useNav } from "../_context/nav-context";
import { useRouter } from "next/navigation";
import { FlaskConical, Search, ChevronDown, Monitor } from "lucide-react";
import {
  EXPERIENCES, GROUP_ORDER, FILTERS, STATUS_COLOR, STATUS_BG,
  type Status, type Filter,
} from "./_data";

export default function ExperiencesScreen() {
  const [query,       setQuery]       = useState("");
  const [filter,      setFilter]      = useState<Filter>("All");
  const [dropOpen,    setDropOpen]    = useState(false);
  const [dropClosing, setDropClosing] = useState(false);
  const { scrolled, setScrolled } = useNav();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const router = useRouter();

  useEffect(() => { setScrolled(false); }, []);

  const openDrop  = () => { setDropClosing(false); setDropOpen(true); };
  const closeDrop = (next?: Filter) => {
    if (next !== undefined) setFilter(next);
    setDropClosing(true);
    setTimeout(() => { setDropOpen(false); setDropClosing(false); }, 230);
  };

  const filtered = EXPERIENCES.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase()) &&
    (filter === "All" || e.status === filter)
  );

  const sections = GROUP_ORDER
    .map((s) => ({ label: s, items: filtered.filter((e) => e.status === s) }))
    .filter((s) => s.items.length > 0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
  }, [sections]);

  const totalExperiments    = EXPERIENCES.filter((e) => e.type === "Experiment").length;
  const totalPersonalizations = EXPERIENCES.filter((e) => e.type === "Personalization").length;
  const totalActive         = EXPERIENCES.filter((e) => e.status === "Active").length;

  return (
    <div
      className="flex flex-col flex-1 min-h-0 bg-page relative"
      style={{ animation: "slide-in-right 0.45s cubic-bezier(0.25,0.46,0.45,0.94)" }}
    >
      {/* Header */}
      <div className="shrink-0 bg-page px-5 pt-5 pb-4">

        {/* Title row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <FlaskConical size={22} className="text-foreground shrink-0" strokeWidth={1.75} />
            <p className="text-xl font-bold text-foreground leading-tight">Experiences</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full"
              style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
            >
              <span className="text-xs font-medium text-foreground">By Status</span>
              <ChevronDown size={12} strokeWidth={1.75} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Revenue card */}
        <div
          className="mt-4 rounded-2xl p-4"
          style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
        >
          {/* Top: Total Revenue + Attributed */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl font-bold text-foreground leading-none">$0.00</p>
                <span className="text-xs font-semibold" style={{ color: "#15803d" }}>+0.00%</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Attributed</p>
              <p className="text-lg font-bold text-foreground leading-none">$0.00</p>
              <p className="text-xs text-muted-foreground mt-0.5">0.0% of total</p>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-3 pt-3" style={{ position: "relative" }}>
            <div style={{
              position: "absolute", top: 0, left: "5%", right: "5%", height: 1,
              background: "linear-gradient(to right, transparent, var(--border) 20%, var(--border) 80%, transparent)",
            }} />
            {/* Stats row */}
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">Experiments</p>
                <p className="text-sm font-semibold text-foreground">$0.00 <span className="text-muted-foreground font-normal">({totalExperiments})</span></p>
              </div>
              <div style={{ width: 1, alignSelf: "stretch", background: "var(--border)", margin: "0 12px" }} />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">Personalizations</p>
                <p className="text-sm font-semibold text-foreground">$0.00 <span className="text-muted-foreground font-normal">({totalPersonalizations})</span></p>
              </div>
              <div style={{ width: 1, alignSelf: "stretch", background: "var(--border)", margin: "0 12px" }} />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Active</p>
                <p className="text-sm font-semibold text-foreground">{totalActive}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search + filter row */}
        <div className="mt-3 flex gap-2 items-center">
          <div
            className="flex-3 flex items-center gap-2.5 px-3.5 h-10 rounded-2xl"
            style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
          >
            <Search size={15} className="text-muted-foreground shrink-0" strokeWidth={1.75} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>

          <div className="flex-1 relative">
            <button
              onClick={dropOpen ? () => closeDrop() : openDrop}
              className="w-full h-10 flex items-center justify-center gap-1 rounded-2xl transition-colors duration-200"
              style={{
                background: filter !== "All" ? "var(--foreground)" : "var(--raised)",
                color:      filter !== "All" ? "var(--raised)"     : "var(--foreground)",
                border:     filter !== "All" ? "1px solid transparent" : "1px solid var(--border)",
              }}
            >
              <span className="text-sm font-semibold truncate">{filter}</span>
              <ChevronDown
                size={12} strokeWidth={1.75}
                style={{ flexShrink: 0, transition: "transform 0.25s ease", transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {dropOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => closeDrop()} />
                <div
                  className="absolute top-full right-0 mt-2 z-50 rounded-2xl overflow-hidden"
                  style={{
                    width: 150,
                    background: "var(--raised)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.13), 0 3px 10px rgba(0,0,0,0.07)",
                    transformOrigin: "top right",
                    animation: dropClosing
                      ? "dropdown-out 0.22s cubic-bezier(0.4,0,1,1) forwards"
                      : "dropdown-in 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  {FILTERS.map((f, i) => {
                    const sel = filter === f;
                    const color = f === "All" ? undefined : STATUS_COLOR[f as Status];
                    return (
                      <button
                        key={f}
                        onClick={() => closeDrop(f)}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left transition-colors duration-100"
                        style={{
                          background: sel ? "rgba(59,130,246,0.07)" : "transparent",
                          animation: "tab-in 0.2s ease-out both",
                          animationDelay: `${i * 28}ms`,
                        }}
                        onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = "var(--secondary)"; }}
                        onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}
                      >
                        {color
                          ? <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                          : <span className="w-2 h-2 shrink-0" />
                        }
                        <span className="text-sm font-medium" style={{ color: sel ? "#1d4ed8" : "var(--foreground)" }}>{f}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Scroll area */}
      <div className="flex-1 min-h-0 relative">
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto scrollbar-hide pb-28 px-4"
          onScroll={(e) => {
            const el = e.currentTarget;
            setScrolled(el.scrollTop > 50);
            setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
          }}
        >
          {sections.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-muted-foreground">No experiences found</p>
            </div>
          ) : sections.map(({ label, items }) => (
            <div key={label}>
              <div className="flex items-center justify-between pt-4 pb-2 px-0.5">
                <span className="text-sm font-semibold" style={{ color: STATUS_COLOR[label] }}>{label}</span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
                >{items.length}</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {items.map((exp, i) => (
                  <button
                    key={exp.name}
                    className="rounded-2xl p-4 w-full text-left"
                    style={{
                      background: "var(--raised)",
                      border: "1px solid var(--border)",
                      animation: "tab-in 0.25s ease-out both",
                      animationDelay: `${i * 40}ms`,
                    }}
                    onClick={() => router.push(`/experiences/${encodeURIComponent(exp.name)}`)}
                  >
                    <p className="text-base font-bold text-foreground leading-snug mb-2.5">{exp.name}</p>

                    {/* Tags row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Type badge */}
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
                      >{exp.type}</span>

                      {/* Platform icon */}
                      <Monitor size={14} strokeWidth={1.75} className="text-muted-foreground" />

                      {/* Status badge */}
                      <span
                        className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: STATUS_BG[exp.status], color: STATUS_COLOR[exp.status] }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: STATUS_COLOR[exp.status] }} />
                        {exp.status}
                      </span>
                    </div>

                    {/* Progress bar */}
                    {exp.progress !== undefined && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-muted-foreground">Progress</span>
                          <span className="text-xs font-semibold text-muted-foreground">{exp.progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--secondary)" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${exp.progress}%`,
                              background: exp.progress === 0 ? "var(--border)" : STATUS_COLOR[exp.status],
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 h-10 pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: scrolled ? 1 : 0, background: "linear-gradient(to bottom, var(--page) 0%, transparent 100%)" }}
        />

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            opacity: scrolled ? 0 : atBottom ? 0 : 1,
            background: "linear-gradient(to top, var(--page) 0%, var(--page) 15%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}
