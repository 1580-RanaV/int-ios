"use client";

import { useState, useEffect, useRef } from "react";
import { useNav } from "../_context/nav-context";
import {
  ChevronRight, LayoutGrid, Globe, Moon, Bell, BarChart2,
  Camera, Mic, ImageIcon, Sparkles, CalendarDays, Link2,
  Star, MessageSquare, HelpCircle, Shield, LogOut, UserCircle,
  Settings, Sun, SunMoon, Check, Smartphone, Trash2, Mail, Phone, X,
  Building2, FolderKanban,
} from "lucide-react";

// ─── Org / project data ──────────────────────────────────────────────────────

type OrgProject = { id: string; name: string };
type Org = { id: string; name: string; color: string; initial: string; projects: OrgProject[] };

const ORGS: Org[] = [
  { id: "fieldsusa",   name: "fieldsusa",                  color: "#111827", initial: "F", projects: [] },
  { id: "intempt-int", name: "Intempt Internal Use Only",  color: "#9333ea", initial: "I", projects: [] },
  { id: "intempt-ext", name: "Intempt External Use",       color: "#7c3aed", initial: "I", projects: [{ id: "stockinvest-project", name: "stockinvest-project" }] },
  { id: "stockinvest", name: "StockInvest.us",             color: "#6d28d9", initial: "S", projects: [] },
  { id: "intempt-tec", name: "Intempt Technologies",       color: "#be185d", initial: "I", projects: [] },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

type Sheet = "appearance" | "reporting" | "connections" | "account" | "profile" | "orgSwitch" | null;
type OrgTab = "Organizations" | "Projects";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function subtractPeriod(now: Date, period: string): Date {
  const d = new Date(now);
  if (period === "7D")  { d.setDate(d.getDate() - 7);   return d; }
  if (period === "14D") { d.setDate(d.getDate() - 14);  return d; }
  if (period === "30D") { d.setDate(d.getDate() - 30);  return d; }
  if (period === "90D") { d.setDate(d.getDate() - 90);  return d; }
  if (period === "6M")  { d.setMonth(d.getMonth() - 6); return d; }
  if (period === "12M") { d.setFullYear(d.getFullYear() - 1); return d; }
  return d;
}

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

// ─── Bottom Sheet wrapper ────────────────────────────────────────────────────

function BottomSheet({
  closing, onClose, children,
}: {
  closing: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{
          background: "rgba(0,0,0,0.4)",
          animation: closing
            ? "fade-out 0.28s ease-in forwards"
            : "fade-in 0.2s ease-out",
        }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 inset-x-0 z-50 rounded-t-3xl"
        style={{
          background: "var(--raised)",
          animation: closing
            ? "sheet-out 0.32s cubic-bezier(0.32,0.72,0,1) forwards"
            : "sheet-in 0.35s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full" style={{ background: "var(--border)" }} />
        </div>
        {children}
      </div>
    </>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const { scrolled, setScrolled } = useNav();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const [sheet,        setSheet]        = useState<Sheet>(null);
  const [sheetClosing, setSheetClosing] = useState(false);

  const [appearance,    setAppearance]    = useState<"Light" | "Dark" | "Automatic">("Light");
  const [reportPeriod,  setReportPeriod]  = useState("30D");
  const [gmailConn,     setGmailConn]     = useState(true);
  const [gcalConn,      setGcalConn]      = useState(false);
  const [now,           setNow]           = useState<Date | null>(null);
  const [orgTab,           setOrgTab]           = useState<OrgTab>("Organizations");
  const [selectedOrg,     setSelectedOrg]      = useState<string>("intempt-ext");
  const [selectedProject, setSelectedProject]  = useState<string>("stockinvest-project");
  const [profileName,      setProfileName]      = useState("Rana V");
  const [profileDisplay,   setProfileDisplay]   = useState("");
  const [profilePhone,     setProfilePhone]     = useState("+1 (555) 123-4567");
  const [profileScrolled,  setProfileScrolled]  = useState(false);
  const [profileAtBottom,  setProfileAtBottom]  = useState(false);

  useEffect(() => { setScrolled(false); setNow(new Date()); }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
  }, []);

  const openSheet = (s: Sheet) => { setSheetClosing(false); setSheet(s); };
  const closeSheet = (cb?: () => void) => {
    setSheetClosing(true);
    setTimeout(() => { setSheet(null); setSheetClosing(false); cb?.(); }, 320);
  };

  const PERIODS = ["7D", "14D", "30D", "90D", "6M", "12M"];

  const dateRange = now
    ? `${reportPeriod} · ${formatDate(subtractPeriod(now, reportPeriod))} – ${formatDate(now)}`
    : reportPeriod;

  const APPEARANCE_OPTIONS: { key: "Light" | "Dark" | "Automatic"; icon: React.ElementType; label: string; sub: string }[] = [
    { key: "Light",     icon: Sun,     label: "Light",     sub: "Always use light mode"          },
    { key: "Dark",      icon: Moon,    label: "Dark",      sub: "Always use dark mode"            },
    { key: "Automatic", icon: SunMoon, label: "Automatic", sub: "Follow system preference"        },
  ];

  return (
    <div
      className="flex flex-col flex-1 min-h-0 bg-page relative"
      style={{ animation: "tab-in 0.25s ease-out" }}
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
          {/* User profile — Instagram-style */}
          <div className="pt-3 pb-1">

            {/* Avatar + name row */}
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

            {/* Edit Profile button — full width below */}
            <button
              className="w-full py-2.5 rounded-2xl text-[13px] font-semibold transition-all duration-150"
              style={{ background: "var(--raised)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--secondary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--raised)"; }}
              onClick={() => openSheet("profile")}
            >
              Edit Profile
            </button>
          </div>

          {/* Org */}
          {(() => {
            const activeOrg = ORGS.find((o) => o.id === selectedOrg) ?? ORGS[2];
            const activeProject = activeOrg.projects.find((p) => p.id === selectedProject);
            return (
              <div className="mt-2">
                <Card>
                  <button
                    className="flex items-center gap-3.5 w-full px-4 text-left"
                    style={{ paddingTop: 13, paddingBottom: 13 }}
                    onClick={() => { setOrgTab("Organizations"); openSheet("orgSwitch"); }}
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
            );
          })()}

          {/* General */}
          <SectionLabel title="General" />
          <Card>
            <Row icon={LayoutGrid}  label="Workspace"         subtitle="Name, email sync, domains, Inbox AI" />
            <Divider />
            <Row icon={Globe}       label="Language & Region"  subtitle="Date, time, currency formats" />
            <Divider />
            <Row icon={Moon}        label="Appearance"         value={appearance}    onClick={() => openSheet("appearance")} />
            <Divider />
            <Row icon={Bell}        label="Notifications"      subtitle="Push, email, meeting reminders" />
            <Divider />
            <Row icon={BarChart2}   label="Reporting Period"   value={reportPeriod}  onClick={() => openSheet("reporting")} />
          </Card>

          {/* Permissions */}
          <SectionLabel title="Permissions" />
          <Card>
            <Row icon={Camera}    label="Camera"        subtitle="Required for taking photos"      notSet />
            <Divider />
            <Row icon={Mic}       label="Microphone"    subtitle="Required for meeting recordings" notSet />
            <Divider />
            <Row icon={ImageIcon} label="Photo Library" subtitle="Required for uploading images"   notSet />
            <Divider />
            <Row icon={Bell}      label="Notifications" subtitle="Alerts and reminders"            notSet />
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
            <Row icon={Link2} label="Connections" subtitle="Gmail, Google Calendar, providers"
              onClick={() => openSheet("connections")} />
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
            <Row icon={UserCircle} label="Account" onClick={() => openSheet("account")} />
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

      {/* ── Org / Project switcher sheet ─────────────────────────────────── */}
      {sheet === "orgSwitch" && (() => {
        const activeOrg = ORGS.find((o) => o.id === selectedOrg) ?? ORGS[2];
        const projects  = activeOrg.projects;
        return (
          <BottomSheet closing={sheetClosing} onClose={() => closeSheet()}>
            {/* Tab switcher — top */}
            <div className="px-3 pb-3 pt-1">
              <div className="flex p-1 rounded-[14px]" style={{ background: "var(--secondary)" }}>
                {(["Organizations", "Projects"] as OrgTab[]).map((tab) => {
                  const isActive = orgTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setOrgTab(tab)}
                      className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-[10px] text-[13px] font-semibold transition-all duration-200"
                      style={{
                        background: isActive ? "var(--raised)" : "transparent",
                        color: isActive ? "#1d4ed8" : "var(--muted-foreground)",
                        boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                      }}
                    >
                      {tab === "Organizations"
                        ? <Building2 size={14} strokeWidth={1.75} />
                        : <FolderKanban size={14} strokeWidth={1.75} />
                      }
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: 420 }}>
              {orgTab === "Organizations" ? (
                <div className="px-3 pt-1 pb-3 flex flex-col gap-0.5">
                  {ORGS.map((org) => {
                    const isSelected = org.id === selectedOrg;
                    return (
                      <button
                        key={org.id}
                        className="flex items-center gap-3.5 w-full px-3.5 py-3 rounded-2xl text-left transition-colors duration-150"
                        style={{ background: isSelected ? "rgba(59,130,246,0.07)" : "transparent" }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "var(--secondary)"; }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                        onClick={() => {
                          setSelectedOrg(org.id);
                          setSelectedProject(org.projects[0]?.id ?? "");
                          setTimeout(() => setOrgTab("Projects"), 180);
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-[15px] font-bold"
                          style={{ background: org.color }}
                        >
                          {org.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold text-foreground leading-snug">{org.name}</p>
                          <p className="text-[12px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                            {org.projects.length} project{org.projects.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        {isSelected && <Check size={16} strokeWidth={2.5} style={{ color: "#1d4ed8", flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-3 pt-1 pb-3 flex flex-col gap-0.5">
                  {projects.length === 0 ? (
                    <div className="py-10 flex flex-col items-center gap-2">
                      <FolderKanban size={28} strokeWidth={1.5} className="text-muted-foreground opacity-40" />
                      <p className="text-[13px] text-muted-foreground">No projects in this org</p>
                    </div>
                  ) : projects.map((proj) => {
                    const isSelected = proj.id === selectedProject;
                    return (
                      <button
                        key={proj.id}
                        className="flex items-center gap-3.5 w-full px-3.5 py-3 rounded-2xl text-left transition-colors duration-150"
                        style={{ background: isSelected ? "rgba(59,130,246,0.07)" : "transparent" }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "var(--secondary)"; }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                        onClick={() => { setSelectedProject(proj.id); closeSheet(); }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
                        >
                          <FolderKanban size={16} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold text-foreground leading-snug">{proj.name}</p>
                          <p className="text-[12px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>{activeOrg.name}</p>
                        </div>
                        {isSelected && <Check size={16} strokeWidth={2.5} style={{ color: "#1d4ed8", flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pb-8" />
          </BottomSheet>
        );
      })()}

      {/* ── Profile sheet ────────────────────────────────────────────────── */}
      {sheet === "profile" && (
        <BottomSheet closing={sheetClosing} onClose={() => closeSheet()}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-2 pb-3">
            <button onClick={() => closeSheet()}>
              <X size={18} strokeWidth={1.75} className="text-muted-foreground" />
            </button>
            <p className="text-[15px] font-bold text-foreground">Profile</p>
            <div className="w-5" />
          </div>

          {/* Scrollable body */}
          <div className="relative">
          <div
            className="overflow-y-auto scrollbar-hide"
            style={{ maxHeight: 520 }}
            onScroll={(e) => {
              const el = e.currentTarget;
              setProfileScrolled(el.scrollTop > 8);
              setProfileAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
            }}
          >
            <div className="px-5 pb-6 flex flex-col gap-5">

              {/* Avatar + upload */}
              <div className="flex flex-col items-center gap-3 pt-1">
                <img
                  src="/dp.png"
                  alt="Rana V"
                  className="w-20 h-20 rounded-full object-cover"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}
                />
                <button
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-semibold"
                  style={{ background: "rgba(59,130,246,0.08)", color: "#1d4ed8", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                  <ImageIcon size={13} strokeWidth={1.75} />
                  Upload
                </button>
              </div>

              {/* Section label */}
              <p className="text-[10px] font-bold uppercase tracking-widest -mb-2" style={{ color: "var(--muted-foreground)" }}>
                Personal Information
              </p>

              {/* Full Name */}
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-1.5">Full Name</p>
                <input
                  className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-foreground outline-none"
                  style={{ background: "var(--page)", border: "1px solid var(--border)" }}
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
              </div>

              {/* Display Name */}
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-0.5">Display Name</p>
                <p className="text-[11px] mb-1.5" style={{ color: "var(--muted-foreground)" }}>How others see you in conversations</p>
                <input
                  className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none"
                  style={{ background: "var(--page)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                  placeholder="How you appear in chat"
                  value={profileDisplay}
                  onChange={(e) => setProfileDisplay(e.target.value)}
                />
              </div>

              {/* Email — read only */}
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-1.5">Email</p>
                <div
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                  style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
                >
                  <Mail size={14} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
                  <span className="text-[14px]" style={{ color: "var(--muted-foreground)" }}>rana@intempt.com</span>
                </div>
                <p className="text-[11px] mt-1.5" style={{ color: "var(--muted-foreground)" }}>Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-1.5">Phone</p>
                <div
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                  style={{ background: "var(--page)", border: "1px solid var(--border)" }}
                >
                  <Phone size={14} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
                  <input
                    className="flex-1 bg-transparent text-[14px] text-foreground outline-none"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                  />
                </div>
              </div>

            </div>
          </div>
          {/* Top fade */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none transition-opacity duration-300"
            style={{
              height: 48,
              opacity: profileScrolled ? 1 : 0,
              background: "linear-gradient(to bottom, var(--raised) 0%, transparent 100%)",
            }}
          />
          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none transition-opacity duration-300"
            style={{
              height: 64,
              opacity: profileScrolled ? 0 : profileAtBottom ? 0 : 1,
              background: "linear-gradient(to top, var(--raised) 30%, transparent 100%)",
            }}
          />
          </div>

          {/* Sticky Save */}
          <div className="px-5 pt-2 pb-8">
            <button
              className="w-full py-3 rounded-2xl text-[14px] font-semibold text-white"
              style={{ background: "#1d4ed8" }}
              onClick={() => closeSheet()}
            >
              Save
            </button>
          </div>
        </BottomSheet>
      )}

      {/* ── Appearance sheet ─────────────────────────────────────────────── */}
      {sheet === "appearance" && (
        <BottomSheet closing={sheetClosing} onClose={() => closeSheet()}>
          <div className="px-5 pt-3 pb-2">
            <p className="text-lg font-bold text-foreground">Appearance</p>
          </div>
          <div className="px-3 pb-8 flex flex-col gap-1">
            {APPEARANCE_OPTIONS.map(({ key, icon: Icon, label, sub }) => {
              const active = appearance === key;
              return (
                <button
                  key={key}
                  onClick={() => closeSheet(() => setAppearance(key))}
                  className="flex items-center gap-3.5 w-full px-3.5 py-3 rounded-2xl text-left transition-colors duration-100"
                  style={{ background: active ? "rgba(59,130,246,0.07)" : "transparent" }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--secondary)"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: active ? "rgba(59,130,246,0.12)" : "var(--secondary)" }}>
                    <Icon size={17} strokeWidth={1.75}
                      style={{ color: active ? "#1d4ed8" : "var(--icon)" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold"
                      style={{ color: active ? "#1d4ed8" : "var(--foreground)" }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{sub}</p>
                  </div>
                  {active && <Check size={16} strokeWidth={1.75} style={{ color: "#1d4ed8", flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </BottomSheet>
      )}

      {/* ── Reporting Period sheet ────────────────────────────────────────── */}
      {sheet === "reporting" && (
        <BottomSheet closing={sheetClosing} onClose={() => closeSheet()}>
          <div className="px-5 pt-3 pb-2">
            <p className="text-lg font-bold text-foreground">Reporting Period</p>
          </div>
          <div className="px-5 pb-4">
            <div className="flex gap-2 flex-wrap">
              {PERIODS.map((p) => {
                const active = reportPeriod === p;
                return (
                  <button
                    key={p}
                    onClick={() => { setReportPeriod(p); }}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                    style={{
                      background: active ? "#1d4ed8" : "var(--secondary)",
                      color: active ? "#ffffff" : "var(--foreground)",
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            <p className="text-sm mt-4 text-center" style={{ color: "var(--muted-foreground)" }}>
              {dateRange}
            </p>
          </div>
          <div className="px-5 pb-8">
            <button
              onClick={() => closeSheet()}
              className="w-full py-3 rounded-2xl text-sm font-semibold text-white transition-opacity"
              style={{ background: "#1d4ed8" }}
            >
              Apply
            </button>
          </div>
        </BottomSheet>
      )}

      {/* ── Connections sheet ────────────────────────────────────────────── */}
      {sheet === "connections" && (
        <BottomSheet closing={sheetClosing} onClose={() => closeSheet()}>
          <div className="px-5 pt-3 pb-2">
            <p className="text-lg font-bold text-foreground">Connections</p>
          </div>
          <div className="px-5 pb-8">
            <div className="flex flex-col gap-2">

              {/* Gmail */}
              <div className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl"
                style={{ background: "var(--page)", border: "1px solid var(--border)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-bold"
                  style={{ background: "linear-gradient(135deg,#ea4335,#fbbc05 50%,#34a853)" }}>
                  <Mail size={16} strokeWidth={1.75} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Gmail</p>
                  <p className="text-xs" style={{ color: gmailConn ? "#15803d" : "var(--muted-foreground)" }}>
                    {gmailConn ? "Connected" : "Not connected"}
                  </p>
                </div>
                <button
                  onClick={() => setGmailConn((v) => !v)}
                  className="text-sm font-semibold px-3 py-1.5 rounded-full transition-all duration-200"
                  style={gmailConn
                    ? { color: "#be123c", background: "rgba(244,63,94,0.08)" }
                    : { color: "#1d4ed8", background: "rgba(59,130,246,0.08)" }
                  }
                >
                  {gmailConn ? "Disconnect" : "Connect"}
                </button>
              </div>

              {/* Google Calendar */}
              <div className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl"
                style={{ background: "var(--page)", border: "1px solid var(--border)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold"
                  style={{ background: "#1d4ed8" }}>
                  31
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Google Calendar</p>
                  <p className="text-xs" style={{ color: gcalConn ? "#15803d" : "var(--muted-foreground)" }}>
                    {gcalConn ? "Connected" : "Not connected"}
                  </p>
                </div>
                <button
                  onClick={() => setGcalConn((v) => !v)}
                  className="text-sm font-semibold px-3 py-1.5 rounded-full transition-all duration-200"
                  style={gcalConn
                    ? { color: "#be123c", background: "rgba(244,63,94,0.08)" }
                    : { color: "#1d4ed8", background: "rgba(59,130,246,0.08)" }
                  }
                >
                  {gcalConn ? "Disconnect" : "Connect"}
                </button>
              </div>

            </div>
          </div>
        </BottomSheet>
      )}

      {/* ── Account sheet ─────────────────────────────────────────────────── */}
      {sheet === "account" && (
        <BottomSheet closing={sheetClosing} onClose={() => closeSheet()}>
          <div className="px-5 pt-3 pb-2">
            <p className="text-lg font-bold text-foreground">Account</p>
          </div>
          <div className="px-5 pb-8 flex flex-col gap-4">

            {/* Trusted device */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "var(--page)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-3.5 px-4 py-3.5">
                <Smartphone size={18} strokeWidth={1.75} style={{ color: "var(--icon)" }} className="shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">This device</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Now</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ color: "#15803d", background: "rgba(16,185,129,0.1)" }}>
                  Current
                </span>
              </div>
            </div>

            {/* Log out everywhere */}
            <button
              className="flex items-center gap-2.5 py-1"
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              <LogOut size={17} strokeWidth={1.75} style={{ color: "#be123c" }} />
              <span className="text-sm font-semibold" style={{ color: "#be123c" }}>
                Log out everywhere
              </span>
            </button>

            {/* Delete account */}
            <p className="text-xs font-semibold uppercase tracking-widest -mb-1"
              style={{ color: "var(--muted-foreground)" }}>Danger Zone</p>
            <button
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl"
              style={{ border: "1px solid rgba(244,63,94,0.35)", background: "rgba(244,63,94,0.05)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,63,94,0.10)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(244,63,94,0.05)"; }}
            >
              <Trash2 size={16} strokeWidth={1.75} style={{ color: "#be123c" }} />
              <span className="text-sm font-semibold" style={{ color: "#be123c" }}>Delete account</span>
            </button>

          </div>
        </BottomSheet>
      )}

    </div>
  );
}
