"use client";

import { useState, useEffect, useRef } from "react";
import { useNav } from "../_context/nav-context";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
  CheckSquare2,
  Handshake,
  CalendarDays,
  Globe,
  ChevronRight,
  ChevronDown,
  Route,
  FlaskConical,
  TrendingUp,
  Eye,
  Activity,
  Settings,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

const TABS = ["Sales", "Marketing", "Analytics"] as const;
type Tab = (typeof TABS)[number];

// ─── Data ────────────────────────────────────────────────────────────────────

type Stat = {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
  bg: string;
  href?: string;
  change?: { label: string; positive: boolean };
};

const salesStats: Stat[] = [
  { icon: Users,        label: "Users",    value: 20,  color: "#1d4ed8", bg: "rgba(59,130,246,0.10)",  href: "/users"    },
  { icon: Building2,    label: "Accounts", value: 51,  color: "#6d28d9", bg: "rgba(139,92,246,0.10)",  href: "/accounts" },
  { icon: CheckSquare2, label: "Tasks",    value: 0,   color: "#15803d", bg: "rgba(16,185,129,0.10)",  href: "/tasks"    },
  { icon: Handshake,    label: "Deals",    value: 0,   color: "#f59e0b", bg: "rgba(245,158,11,0.10)",  href: "/deals"    },
  { icon: CalendarDays, label: "Meetings", value: 156, color: "#be123c", bg: "rgba(244,63,94,0.10)",   href: "/meetings" },
];

const marketingStats: Stat[] = [
  { icon: Route,        label: "Active Journeys",     value: 30,      color: "#1d4ed8", bg: "rgba(59,130,246,0.10)",  href: "/journeys"     },
  { icon: FlaskConical, label: "Active Experiences",  value: 0,       color: "#6d28d9", bg: "rgba(139,92,246,0.10)",  href: "/experiences"  },
  { icon: TrendingUp,   label: "Revenue",             value: "$0.00", color: "#15803d", bg: "rgba(16,185,129,0.10)"  },
  { icon: Users,        label: "Users",               value: "3.94K", color: "#f59e0b", bg: "rgba(245,158,11,0.10)", change: { label: "-37.21%", positive: false } },
];

// ─── Analytics data ──────────────────────────────────────────────────────────

type AnalyticsCategory = "Traffic" | "Revenue" | "Engagement";

const ANALYTICS_CATEGORIES = [
  {
    key: "Traffic" as AnalyticsCategory,
    label: "Traffic",
    subtitle: "Sources, pages, geography, devices",
    icon: Eye,
    color: "#1d4ed8",
    total: "3.94K",
    totalLabel: "Total users",
    valueLabel: "Users",
    change: "-37.21%",
    positive: false,
    data: [65,95,142,128,110,88,72,68,78,85,90,82,75,68,72,80,88,72,65,52,60,72,88,95,92,78,55,62,70,68],
  },
  {
    key: "Revenue" as AnalyticsCategory,
    label: "Revenue",
    subtitle: "Product catalog, categories, verticals",
    icon: TrendingUp,
    color: "#15803d",
    total: "$0.00",
    totalLabel: "Total revenue",
    valueLabel: "Revenue",
    change: "+0%",
    positive: true,
    data: [3,6,12,8,4,2,6,10,8,4,2,6,4,2,4,6,8,4,2,4,6,8,6,4,2,4,6,4,2,0],
  },
  {
    key: "Engagement" as AnalyticsCategory,
    label: "Engagement",
    subtitle: "Activity, stickiness, retention, sessions",
    icon: Activity,
    color: "#6d28d9",
    total: "2.1K",
    totalLabel: "Total sessions",
    valueLabel: "Sessions",
    change: "+12.4%",
    positive: true,
    data: [420,520,680,620,540,460,420,480,560,640,720,660,580,500,540,600,660,580,440,380,440,520,620,700,660,560,420,480,540,520],
  },
];

// ─── Location data ───────────────────────────────────────────────────────────

type LocationTab = "Country" | "Region" | "City";

const LOCATION_DATA: Record<LocationTab, Array<{ name: string; value: number }>> = {
  Country: [
    { name: "United States", value: 83.86 },
    { name: "Singapore",     value: 63.57 },
    { name: "Canada",        value: 18.03 },
    { name: "Australia",     value: 14.10 },
    { name: "Hong Kong",     value: 13.16 },
    { name: "Japan",         value: 12.80 },
    { name: "Malaysia",      value: 10.33 },
    { name: "Brazil",        value: 6.52  },
    { name: "Indonesia",     value: 6.47  },
    { name: "China",         value: 3.70  },
  ],
  Region: [
    { name: "California",   value: 42.10 },
    { name: "Singapore",    value: 27.30 },
    { name: "New York",     value: 22.50 },
    { name: "Ontario",      value: 19.30 },
    { name: "Texas",        value: 15.20 },
    { name: "Florida",      value: 12.70 },
    { name: "Washington",   value: 10.20 },
    { name: "Victoria",     value: 8.40  },
  ],
  City: [
    { name: "San Francisco", value: 31.20 },
    { name: "Singapore",     value: 28.80 },
    { name: "New York",      value: 22.40 },
    { name: "London",        value: 15.60 },
    { name: "Toronto",       value: 12.10 },
    { name: "Sydney",        value: 9.80  },
    { name: "Tokyo",         value: 8.50  },
    { name: "Kuala Lumpur",  value: 6.30  },
  ],
};

// ─── Stat card ───────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, bg, change, href, onClick }: Stat & { onClick?: () => void }) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col justify-between bg-raised border border-border relative overflow-hidden"
      style={{ minHeight: 120, cursor: href ? "pointer" : "default" }}
      onClick={onClick}
    >
      {/* Large faded watermark icon */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: -14,
          bottom: -10,
          color: "var(--foreground)",
          opacity: 0.035,
          transform: "rotate(-20deg)",
        }}
      >
        <Icon size={96} strokeWidth={1.75} />
      </div>

      {/* Top row */}
      <div className="flex items-start justify-between relative z-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--secondary)" }}>
          <Icon size={17} strokeWidth={1.75} className="text-foreground" style={{ opacity: 0.7 }} />
        </div>
        <ChevronRight size={14} strokeWidth={1.75} className="mt-0.5 text-muted-foreground opacity-50" />
      </div>

      {/* Value + label */}
      <div className="relative z-10 mt-3">
        <p className="text-3xl leading-none font-bold tracking-tight text-foreground">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {change && (
            <span className="text-xs font-semibold" style={{ color: change.positive ? "#15803d" : "#be123c" }}>
              {change.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Line chart ──────────────────────────────────────────────────────────────

function LineChart({ data, color, id, valueLabel }: { data: number[]; color: string; id: string; valueLabel: string }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const H = 110;
  const W = 300;
  const padT = 4, padB = 4;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const px = (i: number) => (i / (data.length - 1)) * W;
  const py = (v: number) => padT + ((max - v) / range) * (H - padT - padB);
  const pts = data.map((v, i) => ({ x: px(i), y: py(v) }));

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
  }
  const fillD = `${d} L ${W} ${H} L 0 ${H} Z`;
  const gradId = `cg-${id}`;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const idx = Math.round(((e.clientX - rect.left) / rect.width) * (data.length - 1));
    setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
  };

  const tooltipPct = hoverIdx !== null ? (hoverIdx / (data.length - 1)) * 100 : 0;

  return (
    <div className="relative">
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ display: "block", cursor: "crosshair" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={0} y1={padT + t * (H - padT - padB)}
            x2={W} y2={padT + t * (H - padT - padB)}
            stroke="var(--border)" strokeWidth="0.6" strokeOpacity="0.7" strokeDasharray="4 3"
          />
        ))}
        <path d={fillD} fill={`url(#${gradId})`} />
        <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

        {hoverIdx !== null && (
          <>
            <line
              x1={pts[hoverIdx].x} y1={padT}
              x2={pts[hoverIdx].x} y2={H - padB}
              stroke={color} strokeWidth="1" strokeOpacity="0.45"
            />
            <circle cx={pts[hoverIdx].x} cy={pts[hoverIdx].y} r="4" fill={color} />
            <circle cx={pts[hoverIdx].x} cy={pts[hoverIdx].y} r="2.5" fill="white" />
          </>
        )}
      </svg>

      {/* Floating tooltip */}
      {hoverIdx !== null && (
        <div
          className="absolute pointer-events-none z-10 flex flex-col items-center"
          style={{
            left: `${tooltipPct}%`,
            top: pts[hoverIdx].y,
            transform: "translate(-50%, calc(-100% - 6px))",
          }}
        >
          <div
            className="px-3 py-1.5 rounded-xl text-white whitespace-nowrap flex flex-col gap-0.5"
            style={{
              background: color,
              boxShadow: `0 2px 10px ${color}55`,
            }}
          >
            <span className="text-xs font-semibold text-white">
              {new Date(2026, 4, 10 + hoverIdx).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            <span className="text-xs font-semibold text-white leading-none">
              {valueLabel}: {data[hoverIdx].toLocaleString()}
            </span>
          </div>
          <div style={{
            width: 0, height: 0, marginTop: 2,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: `4px solid ${color}`,
          }} />
        </div>
      )}

      <div className="flex justify-between mt-2">
        {["May 10", "May 16", "May 22", "May 28", "Jun 9"].map((l) => (
          <span key={l} className="text-xs text-muted-foreground">{l}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Location bar chart ──────────────────────────────────────────────────────

function LocationBarChart({ color }: { color: string }) {
  const [activeTab, setActiveTab] = useState<LocationTab>("Country");
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const data = LOCATION_DATA[activeTab];
  const maxValue = data[0].value;

  return (
    <div className="rounded-2xl bg-raised border border-border p-4">
      <div className="mb-3">
        <p className="text-base font-bold text-foreground">Location — Users</p>
        <p className="text-xs text-muted-foreground mt-0.5">Visitors by country, region, or city</p>
      </div>

      <div className="flex bg-secondary rounded-[14px] p-1 gap-0.5 mb-4">
        {(["Country", "Region", "City"] as LocationTab[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setHoverIdx(null); }}
              className="flex-1 text-xs font-semibold py-1.5 rounded-[10px] transition-all"
              style={{
                background: isActive ? "var(--raised)" : "transparent",
                color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div
        key={activeTab}
        className="flex flex-col gap-3"
        style={{ animation: "tab-in 0.2s ease-out" }}
      >
        {data.map((item, i) => {
          const pct = (item.value / maxValue) * 100;
          return (
            <div
              key={item.name}
              className="flex items-center gap-2"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            >
              <p className="w-[72px] shrink-0 text-xs font-medium text-muted-foreground text-right truncate leading-none">
                {item.name}
              </p>

              <div className="flex-1 relative">
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--secondary)" }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                </div>

                {hoverIdx === i && (
                  <div
                    className="absolute pointer-events-none z-20 flex flex-col items-center"
                    style={{
                      left: `${Math.min(90, Math.max(10, pct))}%`,
                      bottom: "calc(100% + 7px)",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div
                      className="px-3 py-1.5 rounded-xl whitespace-nowrap"
                      style={{ background: color, boxShadow: `0 2px 10px ${color}55` }}
                    >
                      <p className="text-xs font-semibold text-white">{item.name}</p>
                      <p className="text-xs font-semibold text-white">Users: {item.value.toFixed(2)}K</p>
                    </div>
                    <div style={{
                      width: 0, height: 0, marginTop: 2,
                      borderLeft: "4px solid transparent",
                      borderRight: "4px solid transparent",
                      borderTop: `4px solid ${color}`,
                    }} />
                  </div>
                )}
              </div>

              <p className="w-[46px] shrink-0 text-xs font-semibold text-foreground leading-none">
                {item.value.toFixed(2)}K
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Analytics content ────────────────────────────────────────────────────────

function AnalyticsContent({ category, onOpenSheet }: { category: AnalyticsCategory; onOpenSheet: () => void }) {
  const current = ANALYTICS_CATEGORIES.find((c) => c.key === category)!;
  const CatIcon = current.icon;

  return (
    <div className="px-4 pt-3 pb-4 flex flex-col gap-3" style={{ animation: "tab-in 0.2s ease-out" }}>
      {/* Category selector */}
      <button
        onClick={onOpenSheet}
        className="flex items-center gap-3 p-3.5 rounded-2xl bg-raised border border-border w-full text-left"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: current.color + "18" }}
        >
          <CatIcon size={16} style={{ color: current.color }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{current.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{current.subtitle}</p>
        </div>
        <ChevronDown size={15} className="text-muted-foreground shrink-0" />
      </button>

      {/* Chart card — keyed on category so it re-animates on switch */}
      <div
        key={category}
        className="rounded-2xl bg-raised border border-border p-4"
        style={{ animation: "tab-in 0.2s ease-out" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-3xl font-bold text-foreground leading-none">{current.total}</p>
            <p className="text-xs text-muted-foreground mt-1.5">{current.totalLabel}</p>
          </div>
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full mt-0.5"
            style={{
              color: current.positive ? "#15803d" : "#be123c",
              background: current.positive ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)",
            }}
          >
            {current.change}
          </span>
        </div>
        <LineChart data={current.data} color={current.color} id={category} valueLabel={current.valueLabel} />
        <p className="text-xs text-muted-foreground mt-3">May 10 – Jun 9, 2026</p>
      </div>

      <LocationBarChart color={current.color} />

      {/* Pageviews chart */}
      <div className="rounded-2xl bg-raised border border-border p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-3xl font-bold text-foreground leading-none">18.7K</p>
            <p className="text-xs text-muted-foreground mt-1.5">Total pageviews</p>
          </div>
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full mt-0.5"
            style={{ color: "#15803d", background: "rgba(16,185,129,0.1)" }}
          >
            +22.1%
          </span>
        </div>
        <LineChart
          data={[180,240,360,320,280,220,190,230,290,340,380,350,310,260,290,330,360,290,220,180,220,290,360,410,380,320,240,280,320,340]}
          color="#15803d"
          id={`${category}-pageviews`}
          valueLabel="Pageviews"
        />
        <p className="text-xs text-muted-foreground mt-3">May 10 – Jun 9, 2026</p>
      </div>
    </div>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Sales");
  const [analyticsCategory, setAnalyticsCategory] = useState<AnalyticsCategory>("Traffic");
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [sheetClosing,      setSheetClosing]      = useState(false);
  const { scrolled, setScrolled } = useNav();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);

  const openSheet  = () => { setSheetClosing(false); setShowCategorySheet(true); };
  const closeSheet = (cb?: () => void) => {
    setSheetClosing(true);
    setTimeout(() => { setShowCategorySheet(false); setSheetClosing(false); cb?.(); }, 320);
  };

  useEffect(() => { setScrolled(false); }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
  }, [activeTab]);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-page relative" style={{ animation: "tab-in 0.25s ease-out" }}>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="shrink-0 bg-page px-5 pt-5 pb-4">

        {/* Workspace row */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-white">
            <Image src="/logo.png" alt="Intempt" width={44} height={44} className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-foreground leading-tight truncate">
              Intempt External Use
            </p>
            <div className="flex items-center gap-1 mt-[3px]">
              <Globe size={11} className="text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground truncate">
                Intempt on Intempt
              </span>
            </div>
          </div>
          <button
            onClick={() => router.push("/settings")}
            className="w-9 h-9 flex items-center justify-center rounded-full shrink-0"
            style={{ background: "var(--secondary)" }}
          >
            <Settings size={16} strokeWidth={1.75} style={{ color: "var(--icon)" }} />
          </button>
        </div>

        {/* Segmented control */}
        <div className="mt-4 flex bg-secondary rounded-[14px] p-1 gap-0.5">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 text-sm font-semibold py-1.75 rounded-[10px] transition-all"
                style={{
                  background: isActive ? "var(--raised)" : "transparent",
                  color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                  boxShadow: isActive
                    ? "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)"
                    : "none",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

      </div>

      {/* ── Scrollable content ────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 relative">
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto scrollbar-hide pb-28"
          onScroll={(e) => {
            const el = e.currentTarget;
            setScrolled(el.scrollTop > 50);
            setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
          }}
        >
          {activeTab === "Analytics" ? (
            <AnalyticsContent
              category={analyticsCategory}
              onOpenSheet={openSheet}
            />
          ) : (
            <div
              key={activeTab}
              className="px-4 pt-0 pb-4"
              style={{ animation: "tab-in 0.2s ease-out" }}
            >
              <div className="grid grid-cols-2 gap-3">
                {(activeTab === "Sales" ? salesStats : marketingStats).map((s) => (
                  <StatCard key={s.label} {...s} onClick={s.href ? () => router.push(s.href!) : undefined} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top fade — appears when scrolled */}
        <div
          className="absolute top-0 left-0 right-0 h-10 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            opacity: scrolled ? 1 : 0,
            background: "linear-gradient(to bottom, var(--page) 0%, transparent 100%)",
          }}
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

      {/* ── Category bottom sheet ─────────────────────────────────────── */}
      {showCategorySheet && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(0,0,0,0.4)",
              animation: sheetClosing
                ? "fade-out 0.28s ease-in forwards"
                : "fade-in 0.2s ease-out",
            }}
            onClick={() => closeSheet()}
          />
          <div
            className="fixed bottom-0 inset-x-0 z-50 rounded-t-3xl pb-6"
            style={{
              background: "var(--raised)",
              animation: sheetClosing
                ? "sheet-out 0.32s cubic-bezier(0.32,0.72,0,1) forwards"
                : "sheet-in 0.35s cubic-bezier(0.32,0.72,0,1)",
            }}
          >
            <div className="flex justify-center pt-3 pb-5">
              <div className="w-9 h-1 rounded-full bg-border" />
            </div>
            <div className="px-3 flex flex-col gap-0.5">
              {ANALYTICS_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = cat.key === analyticsCategory;
                return (
                  <button
                    key={cat.key}
                    onClick={() => closeSheet(() => setAnalyticsCategory(cat.key))}
                    className="flex items-center gap-3 p-3 rounded-2xl w-full text-left transition-colors"
                    style={{ background: isSelected ? `${cat.color}12` : "transparent" }}
                  >
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: isSelected ? `${cat.color}18` : "var(--secondary)" }}
                    >
                      <Icon size={18} style={{ color: isSelected ? cat.color : "var(--icon)" }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{cat.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
