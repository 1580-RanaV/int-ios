"use client";

import { useState, useEffect, useRef } from "react";
import { useNav } from "../_context/nav-context";
import { useRouter } from "next/navigation";
import { LayoutGrid, Search, ChevronRight } from "lucide-react";

const DASHBOARDS = [
  { slug: "orderpage",                  name: "OrderPage",                reports: 6, updated: "11 hours ago"  },
  { slug: "untitled-dashboard-rwmu",    name: "Untitled Dashboard-rwmu",  reports: 0, updated: "5 days ago"    },
  { slug: "untitled-dashboard-dq0u",    name: "Untitled Dashboard-dq0u",  reports: 0, updated: "8 days ago"    },
  { slug: "untitled-dashboard-mivb",    name: "Untitled Dashboard-mivb",  reports: 3, updated: "11 days ago"   },
  { slug: "untitled-dashboard-3p6o",    name: "Untitled Dashboard-3p6o",  reports: 7, updated: "15 days ago"   },
  { slug: "untitled-dashboard-gsgv",    name: "Untitled Dashboard-gsgv",  reports: 6, updated: "21 days ago"   },
  { slug: "action-trackings",           name: "Action Trackings",         reports: 6, updated: "1 month ago"   },
  { slug: "revenue-overview",           name: "Revenue Overview",         reports: 4, updated: "1 month ago"   },
  { slug: "user-funnel",                name: "User Funnel",              reports: 2, updated: "2 months ago"  },
];

export default function DashboardsScreen() {
  const [query, setQuery] = useState("");
  const { scrolled, setScrolled } = useNav();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => { setScrolled(false); }, []);

  const filtered = DASHBOARDS.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
  }, [filtered]);

  const [animate] = useState<"tab-in" | "reveal-in">(() => {
    if (typeof window === "undefined") return "tab-in";
    const ret = sessionStorage.getItem("dashboardsNav");
    if (ret) { sessionStorage.removeItem("dashboardsNav"); return "reveal-in"; }
    return "tab-in";
  });

  const goTo = (slug: string) => { sessionStorage.setItem("dashboardsNav", "1"); router.push(`/dashboards/${slug}`); };

  return (
    <div
      className="flex flex-col flex-1 min-h-0 bg-page relative"
      style={{ animation: animate === "reveal-in" ? "reveal-in 0.28s ease-out" : "tab-in 0.25s ease-out" }}
    >
      {/* Header */}
      <div className="shrink-0 bg-page px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <LayoutGrid size={22} className="text-foreground shrink-0" strokeWidth={1.75} />
          <p className="text-xl font-bold text-foreground leading-tight flex-1">Dashboards</p>
        </div>

        {/* Search */}
        <div
          className="mt-3 flex items-center gap-2.5 px-3.5 h-10 rounded-2xl"
          style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
        >
          <Search size={15} className="text-muted-foreground shrink-0" strokeWidth={1.75} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dashboards..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
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
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-muted-foreground">No dashboards found</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 pt-1">
              {filtered.map((dashboard, i) => (
                <button
                  key={dashboard.name}
                  onClick={() => goTo(dashboard.slug)}
                  className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-left"
                  style={{
                    background: "var(--raised)",
                    border: "1px solid var(--border)",
                    animation: "tab-in 0.2s ease-out both",
                    animationDelay: `${i * 35}ms`,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium mb-0.5" style={{ color: "var(--muted-foreground)" }}>
                      {dashboard.reports} {dashboard.reports === 1 ? "report" : "reports"}
                    </p>
                    <p className="text-base font-semibold text-foreground leading-snug truncate">
                      {dashboard.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                      Updated {dashboard.updated}
                    </p>
                  </div>
                  <ChevronRight size={16} strokeWidth={1.75} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                </button>
              ))}
            </div>
          )}
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
