"use client";

import { useState, useEffect, useRef } from "react";
import { useNav } from "../_context/nav-context";
import { useRouter } from "next/navigation";
import {
  ChevronRight, LayoutGrid, Globe, Moon, Bell, BarChart2,
  Sparkles, CalendarDays, Link2, Star, MessageSquare,
  HelpCircle, Shield, LogOut, UserCircle, Settings,
  Building2, FolderKanban,
} from "lucide-react";

// ─── Org data (for display only on main screen) ──────────────────────────────

type OrgProject = { id: string; name: string };
type Org = { id: string; name: string; color: string; initial: string; projects: OrgProject[] };

const ORGS: Org[] = [
  { id: "fieldsusa",   name: "fieldsusa",                  color: "#111827", initial: "F", projects: [] },
  { id: "intempt-int", name: "Intempt Internal Use Only",  color: "#9333ea", initial: "I", projects: [] },
  { id: "intempt-ext", name: "Intempt External Use",       color: "#7c3aed", initial: "I", projects: [{ id: "stockinvest-project", name: "stockinvest-project" }] },
  { id: "stockinvest", name: "StockInvest.us",             color: "#6d28d9", initial: "S", projects: [] },
  { id: "intempt-tec", name: "Intempt Technologies",       color: "#be185d", initial: "I", projects: [] },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Divider() {
  return <div className="mx-4" style={{ height: 1, background: "var(--border)" }} />;
}

function SectionLabel({ title }: { title: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest px-1 pt-5 pb-2"
      style={{ color: "var(--muted-foreground)" }}>
      {title}
    </p>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
      {children}
    </div>
  );
}

type RowProps = {
  icon: React.ElementType;
  label: string;
  subtitle?: string;
  value?: string;
  notSet?: boolean;
  danger?: boolean;
  onClick?: () => void;
};

function Row({ icon: Icon, label, subtitle, value, notSet, danger, onClick }: RowProps) {
  return (
    <button
      className="flex items-center gap-3.5 w-full px-4 text-left transition-colors duration-100"
      style={{ paddingTop: 13, paddingBottom: 13 }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--secondary)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      onClick={onClick}
    >
      <Icon size={18} strokeWidth={1.75} className="shrink-0"
        style={{ color: danger ? "#be123c" : "var(--icon)" }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug"
          style={{ color: danger ? "#be123c" : "var(--foreground)" }}>
          {label}
        </p>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{subtitle}</p>
        )}
      </div>
      {notSet && (
        <span className="text-xs font-medium shrink-0" style={{ color: "var(--muted-foreground)" }}>
          Not Set
        </span>
      )}
      {value && !notSet && (
        <span className="text-sm font-medium shrink-0" style={{ color: "var(--muted-foreground)" }}>
          {value}
        </span>
      )}
      {!danger && (
        <ChevronRight size={15} strokeWidth={1.75}
          style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
      )}
    </button>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const { scrolled, setScrolled } = useNav();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const [selectedOrg]     = useState("intempt-ext");
  const [selectedProject] = useState("stockinvest-project");
  const [reportPeriod]    = useState("30D");
  const [appearance]      = useState("Light");
  const router = useRouter();

  // Don't re-animate when returning from a settings detail page
  const [animate] = useState<"tab-in" | "reveal-in">(() => {
    if (typeof window === "undefined") return "tab-in";
    const returning = sessionStorage.getItem("settingsNav");
    if (returning) { sessionStorage.removeItem("settingsNav"); return "reveal-in"; }
    return "tab-in";
  });

  const go = (section: string) => {
    sessionStorage.setItem("settingsNav", "1");
    router.push(`/settings/${section}`);
  };

  useEffect(() => { setScrolled(false); }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
  }, []);

  const activeOrg     = ORGS.find((o) => o.id === selectedOrg) ?? ORGS[2];
  const activeProject = activeOrg.projects.find((p) => p.id === selectedProject);

  return (
    <div
      className="flex flex-col flex-1 min-h-0 bg-page relative"
      style={{ animation: animate === "reveal-in" ? "reveal-in 0.28s ease-out" : "tab-in 0.25s ease-out" }}
    >
      {/* Header */}
      <div className="shrink-0 bg-page px-5 pt-5 pb-2">
        <div className="flex items-center gap-2.5">
          <Settings size={22} className="text-foreground shrink-0" strokeWidth={1.75} />
          <p className="text-xl font-bold text-foreground leading-tight">Settings</p>
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
          {/* User profile */}
          <div className="pt-3 pb-1">
            <div className="flex items-center gap-4 mb-3">
              <img
                src="/dp.png"
                alt="Rana V"
                className="w-18 h-18 rounded-full object-cover shrink-0"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[18px] font-bold text-foreground leading-tight">Rana V</p>
                <p className="text-[13px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>rana@intempt.com</p>
              </div>
            </div>
            <button
              className="w-full py-2.5 rounded-2xl text-[13px] font-semibold transition-all duration-150"
              style={{ background: "var(--raised)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--secondary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--raised)"; }}
              onClick={() => go("profile")}
            >
              Edit Profile
            </button>
          </div>

          {/* Org */}
          <div className="mt-2">
            <Card>
              <button
                className="flex items-center gap-3.5 w-full px-4 text-left"
                style={{ paddingTop: 13, paddingBottom: 13 }}
                onClick={() => go("org")}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-bold"
                  style={{ background: activeOrg.color }}
                >
                  {activeOrg.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-snug truncate">{activeOrg.name}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>
                    {activeProject?.name ?? `${activeOrg.projects.length} project${activeOrg.projects.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
                <ChevronRight size={15} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
              </button>
            </Card>
          </div>

          {/* General */}
          <SectionLabel title="General" />
          <Card>
            <Row icon={LayoutGrid}  label="Workspace"         subtitle="Name, email sync, domains, Inbox AI" />
            <Divider />
            <Row icon={Globe}       label="Language & Region"  subtitle="Date, time, currency formats"        onClick={() => go("locale")} />
            <Divider />
            <Row icon={Moon}        label="Appearance"         value={appearance}                             onClick={() => go("appearance")} />
            <Divider />
            <Row icon={Bell}        label="Notifications"      subtitle="Push, email, meeting reminders"      onClick={() => go("notifications")} />
            <Divider />
            <Row icon={BarChart2}   label="Reporting Period"   value={reportPeriod}                           onClick={() => go("reporting")} />
          </Card>

          {/* Permissions */}
          <SectionLabel title="Permissions" />
          <Card>
            <Row icon={Shield} label="Permissions" subtitle="Camera, microphone, photos & notifications" onClick={() => go("permissions")} />
          </Card>

          {/* Brand & AI */}
          <SectionLabel title="Brand & AI" />
          <Card>
            <Row icon={Sparkles} label="Brand & AI" subtitle="Voice, personas, knowledge base" />
          </Card>

          {/* Meetings */}
          <SectionLabel title="Meetings" />
          <Card>
            <Row icon={CalendarDays} label="Meetings" subtitle="Booking, availability, recording" />
          </Card>

          {/* Connections */}
          <SectionLabel title="Connections" />
          <Card>
            <Row icon={Link2} label="Connections" subtitle="Gmail, Google Calendar, providers" onClick={() => go("connections")} />
          </Card>

          {/* Support */}
          <SectionLabel title="Support" />
          <Card>
            <Row icon={Star}          label="Rate Intempt on the App Store" />
            <Divider />
            <Row icon={MessageSquare} label="Send Feedback" />
            <Divider />
            <Row icon={HelpCircle}    label="Support" />
            <Divider />
            <Row icon={Shield}        label="Privacy" />
          </Card>

          {/* Account */}
          <SectionLabel title="Account" />
          <Card>
            <Row icon={UserCircle} label="Account" onClick={() => go("account")} />
            <Divider />
            <Row icon={LogOut} label="Log out" danger />
          </Card>
        </div>

        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: scrolled ? 1 : 0, background: "linear-gradient(to bottom, var(--page) 0%, transparent 100%)" }} />

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
