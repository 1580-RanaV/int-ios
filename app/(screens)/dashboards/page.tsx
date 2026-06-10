"use client";

import { useState, useEffect } from "react";
import { useNav } from "../_context/nav-context";
import { LayoutGrid, Search, Settings, ChevronRight } from "lucide-react";

const DASHBOARDS = [
  { name: "OrderPage",                reports: 6, updated: "11 hours ago"  },
  { name: "Untitled Dashboard-rwmu",  reports: 0, updated: "5 days ago"    },
  { name: "Untitled Dashboard-dq0u",  reports: 0, updated: "8 days ago"    },
  { name: "Untitled Dashboard-mivb",  reports: 3, updated: "11 days ago"   },
  { name: "Untitled Dashboard-3p6o",  reports: 7, updated: "15 days ago"   },
  { name: "Untitled Dashboard-gsgv",  reports: 6, updated: "21 days ago"   },
  { name: "Action Trackings",         reports: 6, updated: "1 month ago"   },
  { name: "Revenue Overview",         reports: 4, updated: "1 month ago"   },
  { name: "User Funnel",              reports: 2, updated: "2 months ago"  },
];

export default function DashboardsScreen() {
  const [query, setQuery] = useState("");
  const { scrolled, setScrolled } = useNav();

  useEffect(() => { setScrolled(false); }, []);

  const filtered = DASHBOARDS.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="flex flex-col flex-1 min-h-0 bg-page relative"
      style={{ animation: "tab-in 0.25s ease-out" }}
    >
      {/* Header */}
      <div className="shrink-0 bg-page px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <LayoutGrid size={22} className="text-foreground shrink-0" strokeWidth={1.75} />
          <p className="text-xl font-bold text-foreground leading-tight flex-1">Dashboards</p>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
          >
            <Settings size={15} className="text-muted-foreground" strokeWidth={1.75} />
          </button>
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
          className="absolute inset-0 overflow-y-auto scrollbar-hide pb-28 px-4"
          onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 50)}
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
          className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none z-10"
          style={{ background: "linear-gradient(to top, var(--page) 0%, var(--page) 15%, transparent 100%)" }}
        />
      </div>
    </div>
  );
}
