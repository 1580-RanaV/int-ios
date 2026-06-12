"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNav } from "../_context/nav-context";
import {
  Route, Search, ChevronDown, ChevronLeft,
} from "lucide-react";
import {
  JOURNEYS, STATUS_COLOR, GROUP_ORDER, FILTER_OPTIONS,
  type Filter, type Status,
} from "./_data";

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function JourneysScreen() {
  const [query,       setQuery]       = useState("");
  const [filter,      setFilter]      = useState<Filter>("All");
  const [dropOpen,    setDropOpen]    = useState(false);
  const [dropClosing, setDropClosing] = useState(false);
  const { scrolled, setScrolled } = useNav();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => { setScrolled(false); }, []);

  const openDrop  = () => { setDropClosing(false); setDropOpen(true); };
  const closeDrop = (next?: Filter) => {
    if (next !== undefined) setFilter(next);
    setDropClosing(true);
    setTimeout(() => { setDropOpen(false); setDropClosing(false); }, 230);
  };

  const filtered = JOURNEYS.filter((j) =>
    j.name.toLowerCase().includes(query.toLowerCase()) &&
    (filter === "All" || j.status === filter)
  );

  const sections =
    filter === "All"
      ? GROUP_ORDER
          .map((s) => ({ label: s, items: filtered.filter((j) => j.status === s) }))
          .filter((s) => s.items.length > 0)
      : [{ label: filter as Status, items: filtered }];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
  }, [sections]);

  const filterActive = filter !== "All";

  const [animate] = useState<"tab-in" | "reveal-in">(() => {
    if (typeof window === "undefined") return "tab-in";
    const ret = sessionStorage.getItem("journeysNav");
    if (ret) { sessionStorage.removeItem("journeysNav"); return "reveal-in"; }
    return "tab-in";
  });

  const goTo = (slug: string) => { sessionStorage.setItem("journeysNav", "1"); router.push(`/journeys/${slug}`); };

  return (
    <div
      className="flex flex-col flex-1 min-h-0 bg-page relative"
      style={{ animation: animate === "reveal-in" ? "reveal-in 0.28s ease-out" : "tab-in 0.25s ease-out" }}
    >
      {/* ── List view ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-h-0">

        {/* Header */}
        <div className="shrink-0 bg-page px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <Route size={22} className="text-foreground shrink-0" strokeWidth={1.75} />
              <p className="text-xl font-bold text-foreground leading-tight">Journeys</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full"
                style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
              >
                <span className="text-xs font-medium text-foreground">By Status</span>
                <ChevronDown size={12} className="text-muted-foreground" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {/* Revenue card */}
          <div
            className="mt-4 rounded-2xl p-4"
            style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground leading-none">$41.25K</p>
              </div>
              <span
                className="text-xs font-semibold px-2 py-1 rounded-full"
                style={{ color: "#15803d", background: "rgba(16,185,129,0.1)" }}
              >
                +2326.25%
              </span>
            </div>
            <div className="mt-3 pt-3" style={{ position: "relative" }}>
              <div style={{
                position: "absolute", top: 0, left: "5%", right: "5%", height: 1,
                background: "linear-gradient(to right, transparent, var(--border) 20%, var(--border) 80%, transparent)",
              }} />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Attributed</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-foreground">$4.65K</span>
                    <span
                      className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ color: "var(--muted-foreground)", background: "var(--secondary)" }}
                    >11.3%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Per send <span className="text-foreground font-medium">$0.00</span>
                  </p>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ color: "#15803d", background: "rgba(16,185,129,0.1)" }}
                >
                  +569.66%
                </span>
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
                  background: filterActive ? "var(--foreground)" : "var(--raised)",
                  color:      filterActive ? "var(--raised)"     : "var(--foreground)",
                  border:     filterActive ? "1px solid transparent" : "1px solid var(--border)",
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
                      width: 140,
                      background: "var(--raised)",
                      border: "1px solid var(--border)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.13), 0 3px 10px rgba(0,0,0,0.07)",
                      transformOrigin: "top right",
                      animation: dropClosing
                        ? "dropdown-out 0.22s cubic-bezier(0.4,0,1,1) forwards"
                        : "dropdown-in 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                  >
                    {FILTER_OPTIONS.map(({ value, color }, i) => {
                      const sel = filter === value;
                      return (
                        <button
                          key={value}
                          onClick={() => closeDrop(value)}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left transition-colors duration-100"
                          style={{
                            background: sel ? "#0080FF" : "transparent",
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
                          <span className="text-sm font-medium" style={{ color: sel ? "#fff" : "var(--foreground)" }}>
                            {value}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable list */}
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
                <p className="text-sm text-muted-foreground">No journeys found</p>
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
                  {items.map((journey, i) => (
                    <div
                      key={journey.name}
                      onClick={() => goTo(encodeURIComponent(journey.name))}
                      className="rounded-2xl p-4"
                      style={{
                        background: "var(--raised)",
                        border: "1px solid var(--border)",
                        animation: "tab-in 0.25s ease-out both",
                        animationDelay: `${i * 40}ms`,
                        cursor: "pointer",
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: STATUS_COLOR[journey.status] }}
                        />
                        <p className="flex-1 text-base font-semibold text-foreground leading-snug">
                          {journey.name}
                        </p>
                        <ChevronLeft
                          size={15} strokeWidth={1.75}
                          className="text-muted-foreground opacity-40 shrink-0"
                          style={{ transform: "rotate(180deg)" }}
                        />
                      </div>
                    </div>
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
    </div>
  );
}
