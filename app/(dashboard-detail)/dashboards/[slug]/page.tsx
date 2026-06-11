"use client";

import { use, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Filter, TrendingUp, Users2,
  BarChart2, PieChart, LineChart, Layers, Clock, FileText,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

type ReportType = "Funnel" | "Insights" | "Retention" | "Analytics" | "Cohort";

type Report = {
  id: string;
  type: ReportType;
  name: string;
  updated: string;
};

type Dashboard = {
  slug: string;
  name: string;
  reportCount: number;
  updated: string;
  reports: Report[];
};

const REPORT_TYPE_META: Record<ReportType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  Funnel:    { icon: Filter,    color: "#8b5cf6", bg: "rgba(139,92,246,0.1)",  label: "Funnel Report"    },
  Insights:  { icon: TrendingUp,color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  label: "Insights Report"  },
  Retention: { icon: Users2,    color: "#16a34a", bg: "rgba(22,163,74,0.1)",   label: "Retention Report" },
  Analytics: { icon: BarChart2, color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  label: "Analytics Report" },
  Cohort:    { icon: Layers,    color: "#ec4899", bg: "rgba(236,72,153,0.1)",   label: "Cohort Report"    },
};

const DASHBOARDS: Dashboard[] = [
  {
    slug: "orderpage",
    name: "OrderPage",
    reportCount: 6,
    updated: "11 hours ago",
    reports: [
      { id: "r1", type: "Funnel",    name: "Checkout Funnel",       updated: "11 hours ago"  },
      { id: "r2", type: "Insights",  name: "Revenue Insights",      updated: "11 hours ago"  },
      { id: "r3", type: "Retention", name: "Buyer Retention",       updated: "2 days ago"    },
      { id: "r4", type: "Analytics", name: "Order Analytics",       updated: "3 days ago"    },
      { id: "r5", type: "Funnel",    name: "Payment Funnel",        updated: "5 days ago"    },
      { id: "r6", type: "Cohort",    name: "Purchase Cohort",       updated: "6 days ago"    },
    ],
  },
  {
    slug: "untitled-dashboard-rwmu",
    name: "Untitled Dashboard-rwmu",
    reportCount: 0,
    updated: "5 days ago",
    reports: [],
  },
  {
    slug: "untitled-dashboard-dq0u",
    name: "Untitled Dashboard-dq0u",
    reportCount: 0,
    updated: "8 days ago",
    reports: [],
  },
  {
    slug: "untitled-dashboard-mivb",
    name: "Untitled Dashboard-mivb",
    reportCount: 3,
    updated: "11 days ago",
    reports: [
      { id: "r1", type: "Funnel",    name: "Untitled report-601",   updated: "11 days ago"   },
      { id: "r2", type: "Insights",  name: "Untitled report-525",   updated: "11 days ago"   },
      { id: "r3", type: "Retention", name: "Untitled report-457",   updated: "11 days ago"   },
    ],
  },
  {
    slug: "untitled-dashboard-3p6o",
    name: "Untitled Dashboard-3p6o",
    reportCount: 7,
    updated: "15 days ago",
    reports: [
      { id: "r1", type: "Funnel",    name: "Untitled report-601",   updated: "15 days ago"   },
      { id: "r2", type: "Insights",  name: "Untitled report-525",   updated: "15 days ago"   },
      { id: "r3", type: "Retention", name: "Untitled report-457",   updated: "16 days ago"   },
      { id: "r4", type: "Insights",  name: "Untitled report-921",   updated: "16 days ago"   },
      { id: "r5", type: "Funnel",    name: "Untitled report-601",   updated: "16 days ago"   },
      { id: "r6", type: "Analytics", name: "Traffic Overview",      updated: "18 days ago"   },
      { id: "r7", type: "Cohort",    name: "Weekly Cohort",         updated: "20 days ago"   },
    ],
  },
  {
    slug: "untitled-dashboard-gsgv",
    name: "Untitled Dashboard-gsgv",
    reportCount: 6,
    updated: "21 days ago",
    reports: [
      { id: "r1", type: "Funnel",    name: "Untitled report-601",   updated: "21 days ago"   },
      { id: "r2", type: "Analytics", name: "Untitled report-320",   updated: "21 days ago"   },
      { id: "r3", type: "Insights",  name: "Untitled report-180",   updated: "22 days ago"   },
      { id: "r4", type: "Retention", name: "Untitled report-457",   updated: "22 days ago"   },
      { id: "r5", type: "Cohort",    name: "Untitled report-290",   updated: "24 days ago"   },
      { id: "r6", type: "Funnel",    name: "Untitled report-110",   updated: "25 days ago"   },
    ],
  },
  {
    slug: "action-trackings",
    name: "Action Trackings",
    reportCount: 6,
    updated: "1 month ago",
    reports: [
      { id: "r1", type: "Funnel",    name: "CTA Funnel",            updated: "1 month ago"   },
      { id: "r2", type: "Analytics", name: "Click Analytics",       updated: "1 month ago"   },
      { id: "r3", type: "Insights",  name: "Action Insights",       updated: "1 month ago"   },
      { id: "r4", type: "Cohort",    name: "Engagement Cohort",     updated: "1 month ago"   },
      { id: "r5", type: "Retention", name: "Action Retention",      updated: "1 month ago"   },
      { id: "r6", type: "Funnel",    name: "Drop-off Funnel",       updated: "1 month ago"   },
    ],
  },
  {
    slug: "revenue-overview",
    name: "Revenue Overview",
    reportCount: 4,
    updated: "1 month ago",
    reports: [
      { id: "r1", type: "Analytics", name: "Revenue Analytics",     updated: "1 month ago"   },
      { id: "r2", type: "Insights",  name: "MRR Insights",          updated: "1 month ago"   },
      { id: "r3", type: "Funnel",    name: "Upsell Funnel",         updated: "1 month ago"   },
      { id: "r4", type: "Cohort",    name: "Revenue Cohort",        updated: "1 month ago"   },
    ],
  },
  {
    slug: "user-funnel",
    name: "User Funnel",
    reportCount: 2,
    updated: "2 months ago",
    reports: [
      { id: "r1", type: "Funnel",    name: "Signup Funnel",         updated: "2 months ago"  },
      { id: "r2", type: "Retention", name: "New User Retention",    updated: "2 months ago"  },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router   = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled]     = useState(false);
  const [atBottom, setAtBottom]     = useState(false);

  const dashboard = DASHBOARDS.find((d) => d.slug === slug) ?? DASHBOARDS[0];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-page" style={{ animation: "slide-in-right 0.45s cubic-bezier(0.25,0.46,0.45,0.94)" }}>

      {/* ── Header ── */}
      <div className="shrink-0 px-4 pt-4 pb-3 flex items-center gap-3" style={{ background: "var(--page)" }}>
        <button
          onClick={() => router.back()}
          className="w-11 h-11 flex items-center justify-center rounded-full shrink-0"
          style={{ background: "var(--raised)", border: "1px solid var(--border)", animation: "back-btn-in 0.42s cubic-bezier(0.34,1.56,0.64,1) 0.06s both" }}
        >
          <ChevronLeft size={22} strokeWidth={2} className="text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-foreground leading-tight truncate">{dashboard.name}</p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Dashboard</p>
        </div>
      </div>

      {/* ── Scroll body ── */}
      <div className="flex-1 min-h-0 relative">
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto scrollbar-hide pb-28 px-4"
          onScroll={(e) => {
            const el = e.currentTarget;
            setScrolled(el.scrollTop > 8);
            setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
          }}
        >

          {/* ── Stats ── */}
          <div className="flex items-center justify-between px-1 mb-4 mt-2">
            <div>
              <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>Contains</p>
              <p className="text-[15px] font-bold text-foreground">{dashboard.reportCount} {dashboard.reportCount === 1 ? "report" : "reports"}</p>
            </div>
            <p className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>Updated {dashboard.updated}</p>
          </div>

          {/* ── Reports section ── */}
          <p className="text-[11px] font-bold uppercase tracking-widest px-1 mb-2" style={{ color: "var(--muted-foreground)" }}>
            Reports
          </p>

          {dashboard.reports.length === 0 ? (
            <div
              className="rounded-2xl px-4 py-10 flex flex-col items-center gap-2"
              style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
            >
              <FileText size={28} strokeWidth={1.5} style={{ color: "var(--muted-foreground)", opacity: 0.4 }} />
              <p className="text-sm text-muted-foreground">No reports yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {dashboard.reports.map((report, i) => {
                const meta = REPORT_TYPE_META[report.type];
                const Icon = meta.icon;
                return (
                  <button
                    key={report.id}
                    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-left"
                    style={{
                      background: "var(--raised)",
                      border: "1px solid var(--border)",
                      animation: "tab-in 0.2s ease-out both",
                      animationDelay: `${i * 40}ms`,
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "var(--secondary)" }}
                    >
                      <Icon size={16} strokeWidth={1.75} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium mb-0.5 text-muted-foreground">{meta.label}</p>
                      <p className="text-[14px] font-semibold text-foreground leading-snug truncate">{report.name}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Updated {report.updated}</p>
                    </div>
                    <ChevronLeft size={15} strokeWidth={1.75} style={{ color: "var(--muted-foreground)", flexShrink: 0, transform: "rotate(180deg)" }} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 h-8 pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: scrolled ? 1 : 0, background: "linear-gradient(to bottom, var(--page), transparent)" }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            opacity: scrolled ? 0 : atBottom ? 0 : 1,
            background: "linear-gradient(to top, var(--page) 0%, var(--page) 15%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}
