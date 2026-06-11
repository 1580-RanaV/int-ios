"use client";

import { useState, use, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Users, Activity, Lightbulb,
  Cog, Target, Monitor,
} from "lucide-react";
import {
  EXPERIENCES, STATUS_COLOR, STATUS_BG,
} from "../../../(screens)/experiences/_data";

// ─── Types ────────────────────────────────────────────────────────────────────

type ExpTab = "Results" | "Summary";
const EXP_TABS: ExpTab[] = ["Results", "Summary"];

// ─── Empty section card ───────────────────────────────────────────────────────

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-4 mb-3"
      style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon size={17} strokeWidth={1.75} className="text-foreground shrink-0" />
        <p className="text-[14px] font-bold text-foreground">{title}</p>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-5 flex items-center justify-center">
      <p className="text-[13px] text-muted-foreground">{message}</p>
    </div>
  );
}

// ─── Results tab ─────────────────────────────────────────────────────────────

function ResultsTab() {
  return (
    <div className="px-4 pt-2">
      <SectionCard icon={Users} title="User Distribution">
        <EmptyState message="No user data available" />
      </SectionCard>

      <SectionCard icon={Activity} title="Impression Distribution">
        <EmptyState message="No impression data available" />
      </SectionCard>

      <SectionCard icon={Users} title="Cumulative Users Over Time">
        <EmptyState message="No cumulative user data available" />
      </SectionCard>

      <SectionCard icon={Activity} title="Cumulative Impressions Over Time">
        <EmptyState message="No cumulative impression data available" />
      </SectionCard>

      {/* Scorecard */}
      <div
        className="rounded-2xl p-4 mb-3"
        style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
            style={{ border: "1.5px solid var(--foreground)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--foreground)" }} />
          </div>
          <p className="text-[14px] font-bold text-foreground">Scorecard</p>
        </div>

        <p
          className="text-[10px] font-bold tracking-widest mb-2"
          style={{ color: "var(--muted-foreground)" }}
        >
          PRIMARY
        </p>
        <EmptyState message="No primary metric data available" />

        <div
          className="my-2"
          style={{
            height: 1,
            background: "linear-gradient(to right, transparent, var(--border) 20%, var(--border) 80%, transparent)",
          }}
        />

        <p
          className="text-[10px] font-bold tracking-widest mb-2"
          style={{ color: "var(--muted-foreground)" }}
        >
          SECONDARY
        </p>
        <EmptyState message="No secondary metric data available" />
      </div>
    </div>
  );
}

// ─── Summary tab ─────────────────────────────────────────────────────────────

function SummaryTab({ exp }: { exp: NonNullable<ReturnType<typeof EXPERIENCES.find>> }) {
  const statusColor = STATUS_COLOR[exp.status];
  const statusBg    = STATUS_BG[exp.status];

  return (
    <div className="px-4 pt-2">

      {/* Status badge */}
      <div className="mb-4">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
          style={{ background: statusBg, color: statusColor }}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusColor }} />
          {exp.status}
        </span>
      </div>

      {/* Config chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          `CI ${exp.ci ?? 95}%`,
          `CUPED ${exp.cuped ? "On" : "Off"}`,
          `Sequential ${exp.sequential ? "On" : "Off"}`,
          `BH ${exp.bh ? "On" : "Off"}`,
        ].map((chip) => (
          <span
            key={chip}
            className="px-3 py-1.5 rounded-full text-[12px] font-semibold text-foreground"
            style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
          >
            {chip}
          </span>
        ))}
      </div>

      {/* Hypothesis */}
      <div
        className="rounded-2xl p-4 mb-3"
        style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={15} strokeWidth={1.75} className="text-muted-foreground shrink-0" />
          <p
            className="text-[10px] font-bold tracking-widest"
            style={{ color: "var(--muted-foreground)" }}
          >
            HYPOTHESIS
          </p>
        </div>
        <p className="text-[13px] italic text-muted-foreground">
          {exp.hypothesis ?? "No hypothesis is assigned"}
        </p>
      </div>

      {/* Setup & Status */}
      <div
        className="rounded-2xl p-4 mb-3"
        style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cog size={17} strokeWidth={1.75} className="text-foreground shrink-0" />
            <p className="text-[14px] font-bold text-foreground">Setup &amp; Status</p>
          </div>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
            style={{ background: statusBg, color: statusColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusColor }} />
            {exp.status}
          </span>
        </div>

        {exp.variants && exp.variants.length > 0 ? (
          <div className="flex flex-col gap-0">
            {exp.variants.map((v, i) => (
              <div key={v.key}>
                {i > 0 && (
                  <div
                    className="my-2"
                    style={{
                      height: 1,
                      background: "linear-gradient(to right, transparent, var(--border) 20%, var(--border) 80%, transparent)",
                    }}
                  />
                )}
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: v.color }}
                  >
                    <span className="text-[13px] font-bold text-white">{v.key}</span>
                  </div>
                  <span className="flex-1 text-[14px] font-medium text-foreground">{v.name}</span>
                  <span className="text-[14px] font-semibold text-muted-foreground">{v.traffic}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No variants configured" />
        )}
      </div>

      {/* All Metrics */}
      <div
        className="rounded-2xl p-4 mb-3"
        style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
            style={{ border: "1.5px solid var(--foreground)" }}
          >
            <div className="w-0 h-0" style={{
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderBottom: "6px solid var(--foreground)",
              marginTop: 1,
            }} />
          </div>
          <p className="text-[14px] font-bold text-foreground">All Metrics</p>
        </div>
        <EmptyState message="No metrics available" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExperienceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  const [activeTab,    setActiveTab]    = useState<ExpTab>("Results");
  const [closing,      setClosing]      = useState(false);
  const [atBottom,     setAtBottom]     = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const exp = EXPERIENCES.find((e) => encodeURIComponent(e.name) === slug);

  const handleBack = () => {
    setClosing(true);
    setTimeout(() => router.back(), 320);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
  }, [activeTab]);

  if (!exp) {
    return (
      <div className="flex flex-col flex-1 min-h-0 bg-page items-center justify-center">
        <p className="text-sm text-muted-foreground">Experience not found</p>
      </div>
    );
  }

  const statusColor = STATUS_COLOR[exp.status];
  const statusBg    = STATUS_BG[exp.status];

  return (
    <div
      className="flex flex-col flex-1 min-h-0 bg-page relative"
      style={{
        animation: closing
          ? "slide-out-right 0.32s cubic-bezier(0.25,0.46,0.45,0.94) forwards"
          : "slide-in-right 0.42s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}
    >
      {/* ── Fixed header ──────────────────────────────────────────────── */}
      <div className="shrink-0">

        {/* Top bar */}
        <div className="flex items-start justify-between px-5 pt-7 pb-3">
          <button
            onClick={handleBack}
            className="w-11 h-11 flex items-center justify-center rounded-full shrink-0 mt-0.5"
            style={{ background: "var(--raised)", border: "1px solid var(--border)", animation: "back-btn-in 0.42s cubic-bezier(0.34,1.56,0.64,1) 0.06s both" }}
          >
            <ChevronLeft size={22} strokeWidth={2} className="text-foreground" />
          </button>

          <div className="flex-1 min-w-0 px-3">
            <p className="text-[18px] font-bold text-foreground leading-snug truncate">{exp.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ background: statusBg, color: statusColor }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusColor }} />
                {exp.status}
              </span>
              <div className="flex items-center gap-1.5">
                <Monitor size={12} strokeWidth={1.75} className="text-muted-foreground" />
                <span className="text-[12px] text-muted-foreground font-medium">{exp.type}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Tab switcher */}
        <div className="px-5 pb-4">
          <div className="flex p-1 rounded-[14px]" style={{ background: "var(--secondary)" }}>
            {EXP_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 h-8 rounded-[10px] text-[13px] font-semibold transition-all duration-200"
                style={{
                  background: activeTab === tab ? "var(--raised)" : "transparent",
                  color:      activeTab === tab ? "var(--foreground)" : "var(--muted-foreground)",
                  boxShadow:  activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scrollable content ────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 relative">
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto scrollbar-hide pb-10"
          onScroll={(e) => {
            const el = e.currentTarget;
            setScrolledDown(el.scrollTop > 8);
            setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
          }}
        >
          {activeTab === "Results"
            ? <ResultsTab />
            : <SummaryTab exp={exp} />
          }
          <div className="h-6" />
        </div>

        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 h-8 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            opacity: scrolledDown ? 1 : 0,
            background: "linear-gradient(to bottom, var(--page) 0%, transparent 100%)",
          }}
        />

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            height: 80,
            opacity: scrolledDown ? 0 : atBottom ? 0 : 1,
            background: "linear-gradient(to top, var(--page) 10%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}
