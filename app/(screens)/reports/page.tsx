"use client";

import { useState, useEffect, useRef } from "react";
import { useNav } from "../_context/nav-context";
import { BarChart2, Search, ChevronRight, TrendingUp, Filter, Users } from "lucide-react";

type Category = "Insights" | "Funnels" | "Retention";

const CATEGORY_ICON: Record<Category, React.ElementType> = {
  Insights:  TrendingUp,
  Funnels:   Filter,
  Retention: Users,
};

const REPORTS: { name: string; category: Category; updated: string }[] = [
  // Insights (21)
  { name: "Vault Signups",              category: "Insights",  updated: "Mar 10" },
  { name: "Blog Signups",               category: "Insights",  updated: "Mar 30" },
  { name: "Free Trial Signups",         category: "Insights",  updated: "Feb 9"  },
  { name: "Traffic from LinkedIn",      category: "Insights",  updated: "Mar 10" },
  { name: "Traffic from Hubspot",       category: "Insights",  updated: "Mar 12" },
  { name: "Weekly Active Users",        category: "Insights",  updated: "Apr 1"  },
  { name: "Monthly Active Users",       category: "Insights",  updated: "Apr 1"  },
  { name: "Feature Adoption Rate",      category: "Insights",  updated: "Mar 22" },
  { name: "Conversion by Source",       category: "Insights",  updated: "Mar 18" },
  { name: "Session Duration Avg",       category: "Insights",  updated: "Feb 28" },
  { name: "Page Views by Country",      category: "Insights",  updated: "Mar 5"  },
  { name: "Referral Traffic",           category: "Insights",  updated: "Apr 4"  },
  { name: "Organic Search Signups",     category: "Insights",  updated: "Apr 7"  },
  { name: "Product Demo Requests",      category: "Insights",  updated: "Mar 29" },
  { name: "Paid Campaign ROI",          category: "Insights",  updated: "Apr 2"  },
  { name: "Email Click-Through Rate",   category: "Insights",  updated: "Mar 14" },
  { name: "Push Notification CTR",      category: "Insights",  updated: "Mar 20" },
  { name: "In-App Events Summary",      category: "Insights",  updated: "Feb 18" },
  { name: "New vs Returning Users",     category: "Insights",  updated: "Apr 5"  },
  { name: "Churn by Segment",           category: "Insights",  updated: "Mar 25" },
  { name: "Revenue by Channel",         category: "Insights",  updated: "Apr 9"  },
  // Funnels (2)
  { name: "Onboarding Journey 1",       category: "Funnels",   updated: "Apr 3"  },
  { name: "Untitled report-105",        category: "Funnels",   updated: "May 11" },
  // Retention (3)
  { name: "Untitled report-345",        category: "Retention", updated: "Apr 8"  },
  { name: "Untitled report-279",        category: "Retention", updated: "Apr 8"  },
  { name: "Untitled report-330",        category: "Retention", updated: "Yesterday" },
];

const SECTION_ORDER: Category[] = ["Insights", "Funnels", "Retention"];

export default function ReportsScreen() {
  const [query, setQuery] = useState("");
  const { scrolled, setScrolled } = useNav();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => { setScrolled(false); }, []);

  const filtered = REPORTS.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  const sections = SECTION_ORDER
    .map((cat) => ({ cat, items: filtered.filter((r) => r.category === cat) }))
    .filter((s) => s.items.length > 0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
  }, [sections]);

  return (
    <div
      className="flex flex-col flex-1 min-h-0 bg-page relative"
      style={{ animation: "tab-in 0.25s ease-out" }}
    >
      {/* Header */}
      <div className="shrink-0 bg-page px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <BarChart2 size={22} className="text-foreground shrink-0" strokeWidth={1.75} />
            <p className="text-xl font-bold text-foreground leading-tight">Reports</p>
          </div>
        </div>

        {/* Search */}
        <div
          className="mt-4 flex items-center gap-2.5 px-3.5 h-10 rounded-2xl"
          style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
        >
          <Search size={15} className="text-muted-foreground shrink-0" strokeWidth={1.75} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports..."
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
          {sections.map(({ cat, items }, si) => {
            const totalForCat = REPORTS.filter((r) => r.category === cat).length;
            const CatIcon = CATEGORY_ICON[cat];
            return (
              <div key={cat} className={si > 0 ? "mt-4" : "mt-1"}>
                {/* Section header */}
                <div className="flex items-center justify-between px-0.5 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <CatIcon size={14} strokeWidth={1.75} className="text-foreground" />
                    <span className="text-sm font-semibold text-foreground">{cat}</span>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
                  >{totalForCat}</span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2.5">
                  {items.map((report, i) => (
                      <div
                        key={report.name}
                        className="flex items-center gap-3 rounded-2xl p-4"
                        style={{
                          background: "var(--raised)",
                          border: "1px solid var(--border)",
                          animation: "tab-in 0.2s ease-out both",
                          animationDelay: `${(si * 8 + i) * 35}ms`,
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{report.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Updated {report.updated}</p>
                        </div>
                        <ChevronRight size={16} strokeWidth={1.75} className="text-muted-foreground shrink-0" />
                      </div>
                  ))}
                </div>
              </div>
            );
          })}
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
