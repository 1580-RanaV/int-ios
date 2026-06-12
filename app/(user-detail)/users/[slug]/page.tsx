"use client";

import { useState, use, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Mail, Phone, MessageSquare,
  MapPin, Clock, Bot, Zap, Eye, Activity, CheckSquare2, Inbox,
  CheckCircle2, Circle, LogIn, Route, MousePointerClick, FileText,
  ChevronDown, Check, CalendarDays, Layers, Send, MailOpen, AlertCircle,
} from "lucide-react";
import {
  USERS, INTENT_COLOR, INTENT_BG,
  type User, type ActivityEventType,
} from "../../../(screens)/users/_data";

// ─── LinkedIn icon ───────────────────────────────────────────────────────────

function LinkedInIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

type DetailTab = "Overview" | "Activity" | "Tasks" | "Emails";
const DETAIL_TABS: DetailTab[] = ["Overview", "Activity", "Tasks", "Emails"];

// ─── Sparkline ───────────────────────────────────────────────────────────────

function Sparkline({ data }: { data: number[] }) {
  const H = 80;
  const W = 300;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 6;

  const pts = data.map((v, i): [number, number] => [
    (i / (data.length - 1)) * W,
    H - pad - ((v - min) / range) * (H - pad * 2),
  ]);

  const linePath = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const fillPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

  const isEmpty = max === 0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: H }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0080FF" stopOpacity={isEmpty ? 0 : 0.22} />
          <stop offset="100%" stopColor="#0080FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {!isEmpty && <path d={fillPath} fill="url(#spark-grad)" />}
      <path
        d={isEmpty ? `M 0 ${H - pad} L ${W} ${H - pad}` : linePath}
        fill="none"
        stroke={isEmpty ? "var(--border)" : "#0080FF"}
        strokeWidth={isEmpty ? "1" : "2"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={isEmpty ? "4 4" : undefined}
      />
    </svg>
  );
}

// ─── Tab content ─────────────────────────────────────────────────────────────

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl overflow-hidden mb-3"
      style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-4 pb-3">
      <Icon size={16} strokeWidth={1.75} className="text-foreground shrink-0" />
      <p className="text-[14px] font-bold text-foreground">{title}</p>
    </div>
  );
}

function EmptyState({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-1.5">
      <Icon size={22} strokeWidth={1.5} className="text-muted-foreground mb-1" />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground text-center px-6">{subtitle}</p>
    </div>
  );
}

function OverviewTab({ user }: { user: User }) {
  return (
    <div style={{ animation: "tab-in 0.2s ease-out" }}>
      {/* Blu Summary */}
      <Section>
        <SectionHeader icon={Bot} title="Blu Summary" />
        <div style={{ height: 1, background: "var(--border)", margin: "0 16px" }} />
        <p className="px-4 py-3.5 text-[13px] leading-relaxed text-muted-foreground">
          {user.bluSummary}
        </p>
      </Section>

      {/* Contact Info */}
      <Section>
        <SectionHeader icon={MapPin} title="Contact Info" />
        <div style={{ height: 1, background: "var(--border)", margin: "0 16px" }} />
        <div className="px-4 py-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Mail size={13} strokeWidth={1.75} className="text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-2">
              <MapPin size={13} strokeWidth={1.75} className="text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground">{user.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={13} strokeWidth={1.75} className="text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground">{user.timezone}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Top Pages */}
      <Section>
        <SectionHeader icon={Eye} title="Top Pages Viewed" />
        {user.topPages.length === 0 ? (
          <>
            <div style={{ height: 1, background: "var(--border)", margin: "0 16px" }} />
            <EmptyState
              icon={Eye}
              title="No pages visited"
              subtitle="This user has not visited any pages yet."
            />
          </>
        ) : (
          <>
            <div style={{ height: 1, background: "var(--border)", margin: "0 16px" }} />
            <div className="px-4 py-1">
              {user.topPages.map((page, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5"
                  style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
                >
                  <span className="text-[13px] text-foreground font-medium truncate flex-1 mr-3">{page.url}</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: "rgba(0,128,255,0.1)", color: "#0080FF" }}
                  >
                    {page.views} views
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </Section>

      {/* Stats strip */}
      <div
        className="rounded-2xl overflow-hidden mb-3"
        style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
      >
        <div className="flex">
          {[
            { label: "Total events", value: user.totalEvents.toString() },
            { label: "First seen",   value: user.firstSeen },
            { label: "Last seen",    value: user.lastSeen  },
          ].map(({ label, value }, i) => (
            <div
              key={label}
              className="flex-1 py-3.5 px-3 text-center"
              style={{ borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}
            >
              <p className="text-xs font-bold text-foreground tabular-nums">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Event Activity chart */}
      <Section>
        <SectionHeader icon={Activity} title="Event Activity" />
        <div style={{ height: 1, background: "var(--border)", margin: "0 16px" }} />
        <div className="px-4 pt-3 pb-2">
          <Sparkline data={user.activityData} />
        </div>
        <p className="px-4 pb-3 text-[11px] text-muted-foreground">Last 31 days</p>
      </Section>

      {/* Key Signals */}
      <Section>
        <SectionHeader icon={Zap} title="Key Signals" />
        {user.keySignals.length === 0 ? (
          <>
            <div style={{ height: 1, background: "var(--border)", margin: "0 16px" }} />
            <EmptyState
              icon={Zap}
              title="No signals found"
              subtitle="This user has no key signals recorded yet."
            />
          </>
        ) : (
          <>
            <div style={{ height: 1, background: "var(--border)", margin: "0 16px" }} />
            <div className="px-4 py-2">
              {user.keySignals.map((signal, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 py-2.5"
                  style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full mt-1.25 shrink-0" style={{ background: "#0080FF" }} />
                  <p className="text-[13px] text-foreground leading-snug">{signal}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </Section>

    </div>
  );
}

const ACTIVITY_ICON: Record<ActivityEventType, React.ElementType> = {
  email:     Mail,
  page_view: Eye,
  journey:   Route,
  login:     LogIn,
  event:     MousePointerClick,
  form:      FileText,
};

const ACTIVITY_COLOR: Record<ActivityEventType, string> = {
  email:     "#0080FF",
  page_view: "#6d28d9",
  journey:   "#15803d",
  login:     "#8a8f98",
  event:     "#c2410c",
  form:      "#0e7490",
};

const ACTIVITY_BG: Record<ActivityEventType, string> = {
  email:     "rgba(0,128,255,0.10)",
  page_view: "rgba(139,92,246,0.10)",
  journey:   "rgba(16,185,129,0.10)",
  login:     "var(--secondary)",
  event:     "rgba(234,88,12,0.10)",
  form:      "rgba(6,182,212,0.10)",
};

// TODAY = 2026-06-11
const TODAY = "2026-06-11";
const YESTERDAY = "2026-06-10";

function dateLabel(dateKey: string): string {
  if (dateKey === TODAY)     return "TODAY";
  if (dateKey === YESTERDAY) return "YESTERDAY";
  const [, m, d] = dateKey.split("-");
  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m)]} ${parseInt(d)}`;
}

function filterCutoff(key: string): string {
  if (key === "7d")  return "2026-06-04";
  if (key === "30d") return "2026-05-12";
  if (key === "90d") return "2026-03-13";
  return "0000-00-00";
}

const ACTIVITY_FILTERS = [
  { key: "7d",  label: "Last 7 days",  icon: CalendarDays },
  { key: "30d", label: "Last 30 days", icon: CalendarDays },
  { key: "90d", label: "Last 90 days", icon: CalendarDays },
  { key: "all", label: "All Updates",  icon: Layers       },
];

const EMAIL_FILTERS = [
  { key: "all",      label: "All",      icon: Mail        },
  { key: "unread",   label: "Unread",   icon: MailOpen    },
  { key: "received", label: "Received", icon: Inbox       },
  { key: "sent",     label: "Sent",     icon: Send        },
];

const TASK_FILTERS = [
  { key: "all",       label: "All",       icon: CheckSquare2 },
  { key: "pending",   label: "Pending",   icon: Circle       },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
  { key: "overdue",   label: "Overdue",   icon: AlertCircle  },
];

function ActivityTab({ user, filter, onOpenSheet }: { user: User; filter: string; onOpenSheet: () => void }) {

    const cutoff = filterCutoff(filter);
  const filtered = user.activity.filter((a) => a.dateKey >= cutoff);

  // Group by dateKey, preserve insertion order
  const groups: { dateKey: string; label: string; items: typeof filtered }[] = [];
  for (const item of filtered) {
    const last = groups[groups.length - 1];
    if (last && last.dateKey === item.dateKey) {
      last.items.push(item);
    } else {
      groups.push({ dateKey: item.dateKey, label: dateLabel(item.dateKey), items: [item] });
    }
  }

  const activeLabel = ACTIVITY_FILTERS.find((f) => f.key === filter)?.label ?? filter;

  return (
    <div style={{ animation: "tab-in 0.2s ease-out" }}>
      {/* Time filter dropdown button */}
      <div className="mb-4">
        <button
          onClick={onOpenSheet}
          className="flex items-center gap-2 px-4 h-9 rounded-full text-[13px] font-semibold"
          style={{
            background: "var(--raised)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <CalendarDays size={14} strokeWidth={1.75} className="text-muted-foreground" />
          <span>{activeLabel}</span>
          <ChevronDown size={13} strokeWidth={2} className="text-muted-foreground" />
        </button>
      </div>

      {/* Timeline */}
      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-1.5">
          <Activity size={22} strokeWidth={1.5} className="text-muted-foreground mb-1" />
          <p className="text-sm font-semibold text-foreground">No activity</p>
          <p className="text-xs text-muted-foreground">No events recorded in this period.</p>
        </div>
      ) : (
        groups.map(({ dateKey, label, items }) => (
          <div key={dateKey} className="mb-4">
            <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--muted-foreground)" }}>
              {label}
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
              {items.map((item, i) => {
                const Icon = ACTIVITY_ICON[item.type];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: ACTIVITY_BG[item.type] }}
                    >
                      <Icon size={14} strokeWidth={1.75} style={{ color: ACTIVITY_COLOR[item.type] }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function FilterButton({ label, icon: Icon, onClick }: { label: string; icon: React.ElementType; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 h-9 rounded-full text-[13px] font-semibold mb-4"
      style={{
        background: "var(--raised)",
        border: "1px solid var(--border)",
        color: "var(--foreground)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <Icon size={14} strokeWidth={1.75} className="text-muted-foreground" />
      <span>{label}</span>
      <ChevronDown size={13} strokeWidth={2} className="text-muted-foreground" />
    </button>
  );
}

function TasksTab({ user, taskFilter, onOpenSheet }: { user: User; taskFilter: string; onOpenSheet: () => void }) {
  const [tasks, setTasks] = useState(user.tasks);

  const toggle = (i: number) => {
    setTasks((prev) => prev.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));
  };

  const visible = tasks.filter((t) => {
    if (taskFilter === "pending")   return !t.done;
    if (taskFilter === "completed") return  t.done;
    if (taskFilter === "overdue")   return !t.done;
    return true;
  });

  const activeLabel = TASK_FILTERS.find((f) => f.key === taskFilter)?.label ?? "All";
  const ActiveIcon  = TASK_FILTERS.find((f) => f.key === taskFilter)?.icon ?? CheckSquare2;

  return (
    <div style={{ animation: "tab-in 0.2s ease-out" }}>
      <FilterButton label={activeLabel} icon={ActiveIcon} onClick={onOpenSheet} />
      <Section>
        {visible.length === 0 ? (
          <EmptyState
            icon={CheckSquare2}
            title="No tasks"
            subtitle="No tasks match this filter."
          />
        ) : (
          <div className="px-4 py-1">
            {visible.map((task, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-3"
                style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
              >
                <button onClick={() => toggle(tasks.indexOf(task))} className="mt-0.5 shrink-0">
                  {task.done
                    ? <CheckCircle2 size={18} strokeWidth={2}    style={{ color: "#15803d" }} />
                    : <Circle       size={18} strokeWidth={1.75} className="text-muted-foreground" />
                  }
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[13px] font-medium leading-snug"
                    style={{
                      color: task.done ? "var(--muted-foreground)" : "var(--foreground)",
                      textDecoration: task.done ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{task.due}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function EmailsTab({ user, emailFilter, onOpenSheet }: { user: User; emailFilter: string; onOpenSheet: () => void }) {
  const visible = user.emails.filter((e) => {
    if (emailFilter === "unread")   return !e.opened;
    if (emailFilter === "received") return  true;
    if (emailFilter === "sent")     return  false;
    return true;
  });

  const activeLabel = EMAIL_FILTERS.find((f) => f.key === emailFilter)?.label ?? "All";
  const ActiveIcon  = EMAIL_FILTERS.find((f) => f.key === emailFilter)?.icon ?? Mail;

  return (
    <div style={{ animation: "tab-in 0.2s ease-out" }}>
      <FilterButton label={activeLabel} icon={ActiveIcon} onClick={onOpenSheet} />
      <Section>
        {visible.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No emails"
            subtitle="No emails match this filter."
          />
        ) : (
          <div className="py-1">
            {visible.map((email, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3"
                style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: email.opened ? "rgba(0,128,255,0.1)" : "var(--secondary)" }}
                >
                  <Mail size={14} strokeWidth={1.75} style={{ color: email.opened ? "#0080FF" : "var(--muted-foreground)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-[13px] font-semibold text-foreground truncate">{email.subject}</p>
                    {email.opened && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0" style={{ background: "rgba(16,185,129,0.1)", color: "#15803d" }}>
                        Opened
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{email.preview}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{email.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  const [activeTab,       setActiveTab]       = useState<DetailTab>("Overview");
  const [closing,         setClosing]         = useState(false);
  const [atBottom,        setAtBottom]        = useState(false);
  const [scrolledDown,    setScrolledDown]    = useState(false);
  const [activityFilter, setActivityFilter] = useState("30d");
  const [emailFilter,    setEmailFilter]    = useState("all");
  const [taskFilter,     setTaskFilter]     = useState("all");
  const [activeSheet,    setActiveSheet]    = useState<"activity" | "emails" | "tasks" | "blu" | null>(null);
  const [sheetClosing,   setSheetClosing]   = useState(false);
  const [bluChannel,     setBluChannel]     = useState("Email");
  const scrollRef = useRef<HTMLDivElement>(null);

  const closeSheet = () => {
    setSheetClosing(true);
    setTimeout(() => { setActiveSheet(null); setSheetClosing(false); }, 270);
  };

  const user = USERS.find((u) => encodeURIComponent(u.name) === slug);

  const handleBack = () => {
    setClosing(true);
    setTimeout(() => router.back(), 320);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
  }, [activeTab]);

  if (!user) {
    return (
      <div className="flex flex-col flex-1 min-h-0 bg-page items-center justify-center">
        <p className="text-sm text-muted-foreground">User not found</p>
      </div>
    );
  }

  const initials = user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const ACTIONS = [
    { icon: Mail,          label: "Email"    },
    { icon: LinkedInIcon,  label: "LinkedIn" },
    { icon: MessageSquare, label: "SMS"      },
    { icon: Phone,         label: "Call"     },
  ];

  return (
    <div
      className="flex flex-col flex-1 min-h-0 bg-page relative"
      style={{
        animation: closing
          ? "slide-out-right 0.32s ease-in-out forwards"
          : "slide-in-right 0.32s ease-in-out",
      }}
    >
      {/* ── Fixed header ──────────────────────────────────────────────── */}
      <div className="shrink-0">

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-7 pb-5">
          <button
            onClick={handleBack}
            className="w-11 h-11 flex items-center justify-center rounded-full shrink-0"
            style={{ background: "var(--raised)", border: "1px solid var(--border)", animation: "back-btn-in 0.42s cubic-bezier(0.34,1.56,0.64,1) 0.32s both" }}
          >
            <ChevronLeft size={22} strokeWidth={2} className="text-foreground" />
          </button>
        </div>

        {/* Identity */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-3.5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
              style={{ background: user.color }}
            >
              <span className="text-xl font-bold text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[20px] font-bold text-foreground leading-snug truncate">{user.name}</p>
              <p className="text-[13px] text-muted-foreground mt-0.5 truncate">{user.email}</p>
              <span
                className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{
                  background: INTENT_BG[user.intent],
                  color: INTENT_COLOR[user.intent],
                  border: `1px solid ${INTENT_COLOR[user.intent]}22`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: INTENT_COLOR[user.intent] }} />
                {user.intent}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 pb-4 grid grid-cols-4 gap-2">
          {ACTIONS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl"
              style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
              onClick={() => { setBluChannel(label); setActiveSheet("blu"); }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--secondary)" }}>
                <Icon size={16} strokeWidth={1.75} className="text-muted-foreground" />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="px-5 pb-4">
          <div className="flex p-1 rounded-[14px]" style={{ background: "var(--secondary)" }}>
            {DETAIL_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 h-8 rounded-[10px] text-[12px] font-semibold transition-all duration-200"
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
          className="absolute inset-0 overflow-y-auto scrollbar-hide px-5 pb-6"
          onScroll={(e) => {
            const el = e.currentTarget;
            setScrolledDown(el.scrollTop > 8);
            setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
          }}
        >
          {activeTab === "Overview"  && <OverviewTab  user={user} />}
          {activeTab === "Activity"  && <ActivityTab  user={user} filter={activityFilter} onOpenSheet={() => setActiveSheet("activity")} />}
          {activeTab === "Tasks"     && <TasksTab     user={user} taskFilter={taskFilter}  onOpenSheet={() => setActiveSheet("tasks")}    />}
          {activeTab === "Emails"    && <EmailsTab    user={user} emailFilter={emailFilter} onOpenSheet={() => setActiveSheet("emails")}   />}
        </div>

        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            height: 40,
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

      {/* ── Draft with Blu sheet ─────────────────────────────────────── */}
      {activeSheet === "blu" && (
        <>
          <div
            className="absolute inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.32)" }}
            onClick={closeSheet}
          />
          <div
            className="absolute bottom-0 left-0 right-0 z-50 flex flex-col overflow-hidden"
            style={{
              background: "var(--page)",
              borderRadius: "24px 24px 0 0",
              animation: sheetClosing
                ? "sheet-out 0.26s ease forwards"
                : "sheet-in 0.32s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          >
            {/* Drag handle */}
            <div className="shrink-0 flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full" style={{ background: "var(--handle)" }} />
            </div>

            {/* Title */}
            <div className="px-5 pt-2 pb-4">
              <p className="text-[17px] font-bold text-foreground">Draft with Blu</p>
            </div>

            {/* Assistant Blu row */}
            <div
              className="mx-5 mb-4 flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
            >
              <Bot size={18} strokeWidth={1.75} className="text-foreground shrink-0" />
              <span className="text-[14px] font-medium text-foreground">Assistant Blu</span>
            </div>

            {/* Channel label */}
            <p className="px-5 mb-2.5 text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Channel</p>

            {/* Channel cards */}
            <div className="px-5 mb-5 grid grid-cols-4 gap-2">
              {ACTIONS.map(({ icon: Icon, label }) => {
                const active = bluChannel === label;
                return (
                  <button
                    key={label}
                    onClick={() => setBluChannel(label)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-2xl"
                    style={{
                      background: active ? "var(--raised)" : "var(--secondary)",
                      border: active ? "2px solid var(--foreground)" : "1px solid var(--border)",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.75} className="text-foreground" />
                    <span className="text-[11px] font-medium text-foreground">{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Blu Draft header */}
            <div className="px-5 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={15} strokeWidth={1.75} className="text-foreground" />
                <span className="text-[13px] font-semibold text-foreground">Blu Draft</span>
              </div>
              <button className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Regenerate
              </button>
            </div>

            {/* Draft content area */}
            <div
              className="mx-5 mb-6 flex flex-col items-center justify-center rounded-2xl"
              style={{
                background: "var(--raised)",
                border: "1px solid var(--border)",
                minHeight: 160,
              }}
            >
              <p className="text-[13px] font-medium" style={{ color: "#ef4444" }}>Failed to generate draft</p>
              <button className="mt-1.5 text-[12px] font-medium text-foreground underline underline-offset-2">Try again</button>
            </div>

            <div className="shrink-0 h-6" />
          </div>
        </>
      )}

      {/* ── Filter sheet ──────────────────────────────────────────────── */}
      {activeSheet && activeSheet !== "blu" && (() => {
        const filters =
          activeSheet === "activity" ? ACTIVITY_FILTERS :
          activeSheet === "tasks"    ? TASK_FILTERS     :
                                       EMAIL_FILTERS;
        const activeKey =
          activeSheet === "activity" ? activityFilter :
          activeSheet === "tasks"    ? taskFilter     :
                                       emailFilter;
        const setKey = (k: string) => {
          if (activeSheet === "activity") setActivityFilter(k);
          else if (activeSheet === "tasks")  setTaskFilter(k);
          else                               setEmailFilter(k);
        };
        return (
          <>
            <div
              className="absolute inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.32)" }}
              onClick={closeSheet}
            />
            <div
              className="absolute bottom-0 left-0 right-0 z-50 flex flex-col overflow-hidden"
              style={{
                background: "var(--raised)",
                borderRadius: "24px 24px 0 0",
                animation: sheetClosing
                  ? "sheet-out 0.26s ease forwards"
                  : "sheet-in 0.32s cubic-bezier(0.25,0.46,0.45,0.94)",
              }}
            >
              <div className="shrink-0 flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 rounded-full" style={{ background: "var(--handle)" }} />
              </div>

              {filters.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => { setKey(key); closeSheet(); }}
                  className="flex items-center gap-4 w-full px-5 py-3.5"
                  style={{ background: "transparent" }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-2xl shrink-0"
                    style={{ background: "var(--secondary)" }}
                  >
                    <Icon size={18} strokeWidth={1.75} className="text-foreground" />
                  </div>
                  <span className="flex-1 text-left text-[15px] font-medium text-foreground">{label}</span>
                  {activeKey === key && <Check size={16} strokeWidth={2.5} style={{ color: "#0080FF" }} />}
                </button>
              ))}

              <div className="shrink-0 h-6" />
            </div>
          </>
        );
      })()}
    </div>
  );
}
