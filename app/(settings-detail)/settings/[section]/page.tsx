"use client";

import { use, useState, useRef, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Sun, Moon, SunMoon, Check, ChevronDown,
  Camera, Mic, ImageIcon, Bell, Mail, Phone,
  Building2, FolderKanban, Shield,
  Smartphone, Trash2, UserCircle, LogOut, X, ExternalLink,
  BookOpen, Plus, Clock, Copy, Info, Calendar, CalendarDays,
} from "lucide-react";

// ─── Exit animation context ───────────────────────────────────────────────────

const ExitCtx = createContext<() => void>(() => {});

function PageContainer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);
  const goBack = () => { setExiting(true); setTimeout(() => router.back(), 320); };
  return (
    <ExitCtx.Provider value={goBack}>
      <div className="flex flex-col flex-1 min-h-0 bg-page"
        style={{ animation: exiting ? "slide-out-right 0.32s ease-in-out forwards" : "slide-in-right 0.32s ease-in-out" }}>
        {children}
      </div>
    </ExitCtx.Provider>
  );
}

// ─── Shared data ──────────────────────────────────────────────────────────────

type OrgProject = { id: string; name: string };
type Org = { id: string; name: string; color: string; initial: string; projects: OrgProject[] };

const ORGS: Org[] = [
  { id: "fieldsusa",   name: "fieldsusa",                 color: "#111827", initial: "F", projects: [] },
  { id: "intempt-int", name: "Intempt Internal Use Only", color: "#9333ea", initial: "I", projects: [] },
  { id: "intempt-ext", name: "Intempt External Use",      color: "#7c3aed", initial: "I", projects: [{ id: "stockinvest-project", name: "stockinvest-project" }] },
  { id: "stockinvest", name: "StockInvest.us",            color: "#6d28d9", initial: "S", projects: [] },
  { id: "intempt-tec", name: "Intempt Technologies",      color: "#be185d", initial: "I", projects: [] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function PageHeader({ title }: { title: string }) {
  const goBack = useContext(ExitCtx);
  return (
    <div className="shrink-0 flex items-center gap-3 px-4 pt-4 pb-3" style={{ background: "var(--page)" }}>
      <button
        onClick={goBack}
        className="w-11 h-11 flex items-center justify-center rounded-full shrink-0"
        style={{ background: "var(--raised)", border: "1px solid var(--border)", animation: "back-btn-in 0.42s cubic-bezier(0.34,1.56,0.64,1) 0.32s both" }}
      >
        <ChevronLeft size={22} strokeWidth={2} className="text-foreground" />
      </button>
      <p className="text-base font-bold text-foreground">{title}</p>
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <p className="text-[13px] font-semibold text-foreground mb-1.5">{label}</p>
      <div className="relative">
        <select
          className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-foreground outline-none appearance-none"
          style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} strokeWidth={1.75} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

function PickerDrawer({ label, sub, value, onChange, options }: {
  label: string; sub?: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--raised)" }}>
      <button onClick={() => setOpen(v => !v)} className="flex items-start gap-3 w-full px-4 py-3.5 outline-none">
        <div className="flex-1 text-left">
          <p className="text-[15px] font-bold text-foreground">{label}</p>
          {sub && <p className="text-[12px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>{sub}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <span className="text-[12px] font-semibold max-w-[120px] truncate text-right" style={{ color: "#0080FF" }}>{value}</span>
          <ChevronDown size={15} strokeWidth={2} className="text-muted-foreground shrink-0"
            style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s ease" }} />
        </div>
      </button>
      {open && (
        <div className="flex flex-col gap-2 px-4 pb-4" style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          {options.map((opt) => {
            const sel = opt === value;
            return (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
                className="flex items-center w-full px-4 py-3 rounded-2xl text-left"
                style={{ background: sel ? "#0080FF" : "var(--raised)", border: `1px solid ${sel ? "#0080FF" : "var(--border)"}` }}>
                <span className="flex-1 text-[14px] font-semibold" style={{ color: sel ? "#fff" : "var(--foreground)" }}>
                  {opt}
                </span>
                {sel && <Check size={16} strokeWidth={2.5} className="text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SaveButton() {
  const goBack = useContext(ExitCtx);
  return (
    <div className="px-4 pt-4 pb-8">
      <button
        onClick={goBack}
        className="w-full py-3 rounded-2xl text-[14px] font-semibold text-white"
        style={{ background: "#0080FF" }}
      >
        Save
      </button>
    </div>
  );
}

function SectionLabel({ title, blue }: { title: string; blue?: boolean }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest px-1 pt-2 pb-1" style={{ color: blue ? "#0080FF" : "var(--muted-foreground)" }}>
      {title}
    </p>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="shrink-0 relative rounded-full"
      style={{ width: 51, height: 31, background: value ? "#22c55e" : "var(--border)", transition: "background 0.25s ease" }}
    >
      <span
        className="absolute top-0.75 rounded-full bg-white"
        style={{ width: 25, height: 25, left: value ? 23 : 3, transition: "left 0.25s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: "0 2px 6px rgba(0,0,0,0.18)" }}
      />
    </button>
  );
}

function ScrollFade({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setAtBottom(el.scrollHeight <= el.clientHeight + 4);
  }, []);
  return (
    <div className="flex-1 min-h-0 relative">
      <div
        ref={ref}
        className={`absolute inset-0 overflow-y-auto scrollbar-hide ${className ?? ""}`}
        onScroll={(e) => {
          const el = e.currentTarget;
          setScrolled(el.scrollTop > 8);
          setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
        }}
      >
        {children}
      </div>
      <div className="absolute top-0 left-0 right-0 h-8 pointer-events-none z-10 transition-opacity duration-300"
        style={{ opacity: scrolled ? 1 : 0, background: "linear-gradient(to bottom, var(--page), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none z-10 transition-opacity duration-300"
        style={{ opacity: atBottom ? 0 : 1, background: "linear-gradient(to top, var(--page) 0%, var(--page) 10%, transparent 100%)" }} />
    </div>
  );
}

// ─── Section pages ────────────────────────────────────────────────────────────

function AppearancePage() {
  const [appearance, setAppearance] = useState<"Light" | "Dark" | "Automatic">("Light");
  const OPTIONS = [
    { key: "Light" as const,     icon: Sun,     label: "Light",     sub: "Always use light mode"     },
    { key: "Dark" as const,      icon: Moon,    label: "Dark",      sub: "Always use dark mode"      },
    { key: "Automatic" as const, icon: SunMoon, label: "Automatic", sub: "Follow system preference"  },
  ];
  return (
    <PageContainer>
      <PageHeader title="Appearance" />
      <ScrollFade className="px-4 pb-8">
        <div className="flex flex-col gap-2 pt-2">
          {OPTIONS.map(({ key, icon: Icon, label, sub }) => {
            const active = appearance === key;
            return (
              <button
                key={key}
                onClick={() => setAppearance(key)}
                className="flex items-center gap-3.5 w-full px-3.5 py-3 rounded-2xl text-left"
                style={{ background: active ? "#0080FF" : "var(--raised)", border: `1px solid ${active ? "#0080FF" : "var(--border)"}` }}
              >
                <Icon size={22} strokeWidth={2} style={{ color: active ? "#fff" : "var(--icon)", flexShrink: 0 }} />
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: active ? "#fff" : "var(--foreground)" }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: active ? "rgba(255,255,255,0.65)" : "var(--muted-foreground)" }}>{sub}</p>
                </div>
                {active && <Check size={16} strokeWidth={2} style={{ color: "#fff", flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      </ScrollFade>
    </PageContainer>
  );
}

function ReportingPage() {
  const PERIODS = [
    { value: "7D",  label: "7 Days"    },
    { value: "14D", label: "14 Days"   },
    { value: "30D", label: "30 Days"   },
    { value: "90D", label: "90 Days"   },
    { value: "6M",  label: "6 Months"  },
    { value: "12M", label: "12 Months" },
  ];
  const [period, setPeriod] = useState("30D");
  return (
    <PageContainer>
      <PageHeader title="Reporting Period" />
      <ScrollFade className="px-4 pb-4">
        <div className="flex flex-col gap-2 pt-2">
          {PERIODS.map(({ value, label }) => {
            const active = period === value;
            return (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                className="flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-left"
                style={{ background: active ? "#0080FF" : "var(--raised)", border: `1px solid ${active ? "#0080FF" : "var(--border)"}` }}
              >
                <span className="text-[14px] font-semibold" style={{ color: active ? "#fff" : "var(--foreground)" }}>{label}</span>
                {active && <Check size={16} strokeWidth={2.5} style={{ color: "#fff" }} />}
              </button>
            );
          })}
        </div>
      </ScrollFade>
      <SaveButton />
    </PageContainer>
  );
}

function ConnectionsPage() {
  const [gmailConn, setGmailConn] = useState(true);
  const [gcalConn,  setGcalConn]  = useState(false);
  return (
    <PageContainer>
      <PageHeader title="Connections" />
      <ScrollFade className="px-4 pb-8">
        <div className="flex flex-col gap-2 pt-2">
          {[
            { src: "https://cdn.brandfetch.io/gmail.com/icon",          alt: "Gmail",           connected: gmailConn, toggle: () => setGmailConn(v => !v) },
            { src: "https://cdn.brandfetch.io/calendar.google.com/icon", alt: "Google Calendar", connected: gcalConn,  toggle: () => setGcalConn(v => !v)  },
          ].map(({ src, alt, connected, toggle }) => (
            <div key={alt} className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl"
              style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
              <img src={src} alt={alt} className="w-9 h-9 rounded-xl object-cover shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{alt}</p>
                <p className="text-xs" style={{ color: connected ? "#15803d" : "var(--muted-foreground)" }}>
                  {connected ? "Connected" : "Not connected"}
                </p>
              </div>
              <button
                onClick={toggle}
                className="text-[13px] font-semibold px-3 py-1.5 rounded-full"
                style={connected
                  ? { color: "#be123c", background: "rgba(244,63,94,0.08)" }
                  : { color: "#0080FF", background: "rgba(0,128,255,0.08)" }}
              >
                {connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </ScrollFade>
    </PageContainer>
  );
}

function AccountPage() {
  return (
    <PageContainer>
      <PageHeader title="Account" />
      <ScrollFade className="px-4 pb-8">
        <div className="flex flex-col gap-5 pt-2">

          {/* Trusted Devices */}
          <div>
            <SectionLabel title="Trusted Devices" />
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-3.5 px-4 py-3.5">
                <Smartphone size={22} strokeWidth={2} className="text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-foreground">This device</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">Now</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0" style={{ color: "#15803d", background: "rgba(22,163,74,0.12)" }}>
                  Current
                </span>
              </div>
            </div>
          </div>

          {/* Log out everywhere */}
          <button className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-left"
            style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
            <LogOut size={20} strokeWidth={2} style={{ color: "#be123c", flexShrink: 0 }} />
            <span className="text-[14px] font-semibold" style={{ color: "#be123c" }}>Log out everywhere</span>
          </button>

          {/* Danger Zone */}
          <div>
            <SectionLabel title="Danger Zone" />
            <button className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-2xl"
              style={{ background: "#be123c", border: "none" }}>
              <Trash2 size={15} strokeWidth={2} style={{ color: "#fff" }} />
              <span className="text-[14px] font-semibold text-white">Delete account</span>
            </button>
          </div>

        </div>
      </ScrollFade>
    </PageContainer>
  );
}

function ProfilePage() {
  const [name,    setName]    = useState("Rana V");
  const [display, setDisplay] = useState("");
  const [phone,   setPhone]   = useState("+1 (555) 123-4567");
  return (
    <PageContainer>
      <PageHeader title="Edit Profile" />
      <ScrollFade className="px-4 pb-4">
        <div className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col items-center gap-3 pt-1">
            <img src="/dp.png" alt="Rana V" className="w-28 h-28 rounded-full object-cover" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }} />
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-semibold"
              style={{ background: "rgba(0,128,255,0.08)", color: "#0080FF", border: "1px solid rgba(0,128,255,0.2)" }}>
              <ImageIcon size={13} strokeWidth={1.75} /> Upload
            </button>
          </div>
          <SectionLabel title="Personal Information" />
          <div>
            <p className="text-[13px] font-semibold text-foreground mb-1.5">Full Name</p>
            <input className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-foreground outline-none"
              style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
              value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-foreground mb-0.5">Display Name</p>
            <p className="text-[11px] mb-1.5 text-muted-foreground">How others see you in conversations</p>
            <input className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none"
              style={{ background: "var(--raised)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              placeholder="How you appear in chat" value={display} onChange={(e) => setDisplay(e.target.value)} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-foreground mb-1.5">Email</p>
            <div className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
              style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
              <Mail size={14} strokeWidth={1.75} className="text-muted-foreground" />
              <span className="text-[14px] text-muted-foreground">rana@intempt.com</span>
            </div>
            <p className="text-[11px] mt-1.5 text-muted-foreground">Email cannot be changed</p>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-foreground mb-1.5">Phone</p>
            <div className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
              style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
              <Phone size={14} strokeWidth={1.75} className="text-muted-foreground" />
              <input className="flex-1 bg-transparent text-[14px] text-foreground outline-none"
                value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
        </div>
      </ScrollFade>
      <SaveButton />
    </PageContainer>
  );
}

function OrgPage() {
  const goBack = useContext(ExitCtx);
  type OrgTab = "Organizations" | "Projects";
  const [orgTab,          setOrgTab]          = useState<OrgTab>("Organizations");
  const [selectedOrg,     setSelectedOrg]     = useState("intempt-ext");
  const [selectedProject, setSelectedProject] = useState("stockinvest-project");
  const activeOrg = ORGS.find((o) => o.id === selectedOrg) ?? ORGS[2];
  return (
    <PageContainer>
      <PageHeader title="Switch Workspace" />
      <div className="px-4 pb-2">
        <div className="flex bg-secondary rounded-[14px] p-1 gap-0.5">
          {(["Organizations", "Projects"] as OrgTab[]).map((tab) => {
            const isActive = orgTab === tab;
            return (
              <button key={tab} onClick={() => setOrgTab(tab)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.75 rounded-[10px] text-sm font-semibold transition-all"
                style={{ background: isActive ? "var(--raised)" : "transparent", color: isActive ? "var(--foreground)" : "var(--muted-foreground)", boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" : "none" }}>
                {tab === "Organizations" ? <Building2 size={14} strokeWidth={1.75} /> : <FolderKanban size={14} strokeWidth={1.75} />}
                {tab}
              </button>
            );
          })}
        </div>
      </div>
      <ScrollFade className="px-4 pb-8">
        {orgTab === "Organizations" ? (
          <div className="flex flex-col gap-2 pt-2">
            {ORGS.map((org) => {
              const isSel = org.id === selectedOrg;
              return (
                <button key={org.id}
                  className="flex items-center gap-3.5 w-full px-3.5 py-3 rounded-2xl text-left"
                  style={{ background: isSel ? "#0080FF" : "var(--raised)", border: `1px solid ${isSel ? "#0080FF" : "var(--border)"}` }}
                  onClick={() => { setSelectedOrg(org.id); setSelectedProject(org.projects[0]?.id ?? ""); setTimeout(() => setOrgTab("Projects"), 180); }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-[15px] font-bold" style={{ background: org.color }}>{org.initial}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold truncate" style={{ color: isSel ? "#fff" : "var(--foreground)" }}>{org.name}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: isSel ? "rgba(255,255,255,0.65)" : "var(--muted-foreground)" }}>{org.projects.length} project{org.projects.length !== 1 ? "s" : ""}</p>
                  </div>
                  {isSel && <Check size={16} strokeWidth={2.5} style={{ color: "#fff", flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2 pt-2">
            {activeOrg.projects.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-2">
                <FolderKanban size={28} strokeWidth={1.5} className="text-muted-foreground opacity-40" />
                <p className="text-[13px] text-muted-foreground">No projects in this org</p>
              </div>
            ) : activeOrg.projects.map((proj) => {
              const isSel = proj.id === selectedProject;
              return (
                <button key={proj.id}
                  className="flex items-center gap-3.5 w-full px-3.5 py-3 rounded-2xl text-left"
                  style={{ background: isSel ? "#0080FF" : "var(--raised)", border: `1px solid ${isSel ? "#0080FF" : "var(--border)"}` }}
                  onClick={() => { setSelectedProject(proj.id); goBack(); }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: isSel ? "rgba(255,255,255,0.15)" : "var(--secondary)", border: `1px solid ${isSel ? "transparent" : "var(--border)"}` }}>
                    <FolderKanban size={16} strokeWidth={1.75} style={{ color: isSel ? "#fff" : "var(--muted-foreground)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold truncate" style={{ color: isSel ? "#fff" : "var(--foreground)" }}>{proj.name}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: isSel ? "rgba(255,255,255,0.65)" : "var(--muted-foreground)" }}>{activeOrg.name}</p>
                  </div>
                  {isSel && <Check size={16} strokeWidth={2.5} style={{ color: "#fff", flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        )}
      </ScrollFade>
    </PageContainer>
  );
}

function LocalePage() {
  const [language,       setLanguage]       = useState("English");
  const [country,        setCountry]        = useState("United States of America");
  const [dateFormat,     setDateFormat]     = useState("MM/DD/YYYY");
  const [firstDayOfWeek, setFirstDayOfWeek] = useState("Sunday");
  const [timeFormat,     setTimeFormat]     = useState("12-hour (2:30 PM)");
  const [numberFormat,   setNumberFormat]   = useState("1,234.56");
  const [currency,       setCurrency]       = useState("$ USD");
  const [currencyPos,    setCurrencyPos]    = useState("Before amount ($100)");
  return (
    <PageContainer>
      <PageHeader title="Language & Region" />
      <ScrollFade className="px-4 pb-4">
        <div className="flex flex-col gap-5 pt-2">
          <SectionLabel title="Locale" />
          <SelectField label="Language" value={language} onChange={setLanguage} options={["English", "Spanish", "French", "German", "Portuguese", "Japanese", "Chinese"]} />
          <SelectField label="Country / Region" value={country} onChange={setCountry} options={["United States of America", "United Kingdom", "Canada", "Australia", "Germany", "France", "India", "Japan"]} />
          <SectionLabel title="Date & Time" />
          <SelectField label="Date Format" value={dateFormat} onChange={setDateFormat} options={["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "DD.MM.YYYY", "MMM D, YYYY"]} />
          <SelectField label="First Day of Week" value={firstDayOfWeek} onChange={setFirstDayOfWeek} options={["Sunday", "Monday", "Saturday"]} />
          <SelectField label="Time Format" value={timeFormat} onChange={setTimeFormat} options={["12-hour (2:30 PM)", "24-hour (14:30)"]} />
          <SectionLabel title="Numbers & Currency" />
          <SelectField label="Number Format" value={numberFormat} onChange={setNumberFormat} options={["1,234.56", "1.234,56", "1 234,56", "1234.56"]} />
          <SelectField label="Currency" value={currency} onChange={setCurrency} options={["$ USD", "€ EUR", "£ GBP", "¥ JPY", "₹ INR", "C$ CAD", "A$ AUD"]} />
          <SelectField label="Currency Position" value={currencyPos} onChange={setCurrencyPos} options={["Before amount ($100)", "After amount (100$)"]} />
        </div>
      </ScrollFade>
      <SaveButton />
    </PageContainer>
  );
}

function NotificationsPage() {
  const [pushNotif,       setPushNotif]       = useState(true);
  const [emailNotif,      setEmailNotif]      = useState(true);
  const [meetingReminder, setMeetingReminder] = useState("15 minutes before");
  const [reminderOpen,    setReminderOpen]    = useState(false);
  return (
    <PageContainer>
      <PageHeader title="Notifications" />
      <ScrollFade className="px-4 pb-8">
        <div className="flex flex-col gap-2 pt-2">
          <SectionLabel title="Notifications" />
          {[
            { label: "Push Notifications", sub: "Receive notifications on your device", value: pushNotif, onChange: setPushNotif },
            { label: "Email Notifications", sub: "Get updates via email",               value: emailNotif, onChange: setEmailNotif },
          ].map(({ label, sub, value, onChange }) => (
            <div key={label} className="flex items-center justify-between px-4 py-4 rounded-2xl"
              style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-[14px] font-semibold text-foreground">{label}</p>
                <p className="text-[12px] mt-0.5 text-muted-foreground">{sub}</p>
              </div>
              <Toggle value={value} onChange={onChange} />
            </div>
          ))}

          <SectionLabel title="Calendar Meetings" />
          <div className="px-4 py-4 rounded-2xl relative" style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-[14px] font-semibold text-foreground">Meeting reminder</p>
                <p className="text-[12px] mt-0.5 text-muted-foreground">Get notified before meetings start</p>
              </div>
              <button onClick={() => setReminderOpen(v => !v)} className="flex items-center gap-1.5 shrink-0" style={{ color: "#0080FF" }}>
                <span className="text-[13px] font-semibold">{meetingReminder}</span>
                <ChevronDown size={13} strokeWidth={2} style={{ transform: reminderOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }} />
              </button>
            </div>
            {reminderOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setReminderOpen(false)} />
                <div className="absolute right-4 top-full mt-2 z-50 rounded-2xl overflow-hidden"
                  style={{ width: 190, background: "var(--raised)", border: "1px solid var(--border)", boxShadow: "0 12px 40px rgba(0,0,0,0.13)", animation: "dropdown-in 0.28s cubic-bezier(0.34,1.56,0.64,1)" }}>
                  {["5 minutes before", "10 minutes before", "15 minutes before", "30 minutes before", "1 hour before"].map((opt, i) => {
                    const sel = meetingReminder === opt;
                    return (
                      <button key={opt} onClick={() => { setMeetingReminder(opt); setReminderOpen(false); }}
                        className="flex items-center justify-between w-full px-4 py-2.5 text-left"
                        style={{ background: sel ? "#0080FF" : "transparent", animation: "tab-in 0.2s ease-out both", animationDelay: `${i * 24}ms` }}>
                        <span className="text-[13px] font-medium" style={{ color: sel ? "#fff" : "var(--foreground)" }}>{opt}</span>
                        {sel && <Check size={13} strokeWidth={2} style={{ color: "#fff" }} />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </ScrollFade>
    </PageContainer>
  );
}

function PermissionsPage() {
  return (
    <PageContainer>
      <PageHeader title="Permissions" />
      <ScrollFade className="px-4 pb-8">
        <div className="flex flex-col gap-2 pt-2">
          {[
            { icon: Camera,    label: "Camera",            subtitle: "Required for taking photos",      status: "Allowed" },
            { icon: Mic,       label: "Microphone",        subtitle: "Required for meeting recordings", status: "Allowed" },
            { icon: ImageIcon, label: "Photo Library",     subtitle: "Required for uploading images",   status: "Denied"  },
            { icon: Bell,      label: "App Notifications", subtitle: "Alerts and reminders",            status: "Not Set" },
          ].map(({ icon: Icon, label, subtitle, status }) => {
            const s = status === "Allowed" ? { color: "#16a34a", bg: "rgba(22,163,74,0.1)" }
                    : status === "Denied"  ? { color: "#dc2626", bg: "rgba(220,38,38,0.1)" }
                    :                        { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
            return (
              <div key={label} className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
                style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
                <Icon size={22} strokeWidth={2} className="text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-foreground">{label}</p>
                  <p className="text-[12px] mt-0.5 text-muted-foreground">{subtitle}</p>
                </div>
                <span className="text-[11px] font-semibold shrink-0 px-2.5 py-1 rounded-full" style={{ color: s.color, background: s.bg }}>{status}</span>
              </div>
            );
          })}
        </div>
      </ScrollFade>
    </PageContainer>
  );
}

function WorkspacePage() {
  const [wsName,         setWsName]         = useState("Dev Playground");
  const [website,        setWebsite]        = useState("");
  const [syncMode,       setSyncMode]       = useState("External only");
  const [syncHistory,    setSyncHistory]    = useState("Last 90 days");
  const [filterType,     setFilterType]     = useState("Blocklist — Sync everything except these");
  const [filterEmail,    setFilterEmail]    = useState("");
  const [filteredEmails, setFilteredEmails] = useState(["email@example.com"]);
  const [domain,         setDomain]         = useState("");
  const [domains,        setDomains]        = useState<string[]>([]);

  const addFilterEmail = () => { if (filterEmail.trim()) { setFilteredEmails(v => [...v, filterEmail.trim()]); setFilterEmail(""); } };
  const addDomain      = () => { if (domain.trim()) { setDomains(v => [...v, domain.trim()]); setDomain(""); } };

  return (
    <PageContainer>
      <PageHeader title="Workspace" />
      <ScrollFade className="px-4 pb-4">
        <div className="flex flex-col gap-5 pt-2">

          {/* Identity card: logo + name + website */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
            {/* Logo row */}
            <div className="flex items-center gap-3.5 px-4 py-3.5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                <span className="text-lg font-bold text-foreground">D</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-foreground">Workspace logo</p>
                <p className="text-[12px] mt-0.5 text-muted-foreground">JPG, PNG or SVG</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold shrink-0"
                style={{ color: "#0080FF", border: "1px solid rgba(0,128,255,0.25)", background: "rgba(0,128,255,0.06)" }}>
                <ImageIcon size={12} strokeWidth={2} /> Upload
              </button>
            </div>

            <div style={{ height: 1, background: "var(--border)", marginInline: 16 }} />

            {/* Workspace name */}
            <div className="px-4 pt-3 pb-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Workspace name</p>
              <input
                className="w-full text-[14px] font-medium text-foreground outline-none bg-transparent"
                value={wsName} onChange={(e) => setWsName(e.target.value)}
                placeholder="Your workspace name"
              />
            </div>

            <div style={{ height: 1, background: "var(--border)", marginInline: 16 }} />

            {/* Website */}
            <div className="px-4 pt-3 pb-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">Website</p>
              <input
                className="w-full text-[14px] font-medium text-foreground outline-none bg-transparent"
                value={website} onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourcompany.com"
              />
            </div>
          </div>

          {/* Email Sync */}
          <div className="flex flex-col gap-2">
            <SectionLabel title="Email Sync" />
            <PickerDrawer label="Sync mode" value={syncMode} onChange={setSyncMode}
              options={["External only", "All emails", "Internal only"]} />
            <PickerDrawer label="Sync history" value={syncHistory} onChange={setSyncHistory}
              options={["Last 30 days", "Last 90 days", "Last 6 months", "Last year", "All time"]} />
          </div>

          {/* Mail Filtering */}
          <div className="flex flex-col gap-2">
            <SectionLabel title="Mail Filtering" />
            <PickerDrawer label="Filter type" value={filterType} onChange={setFilterType}
              options={["Blocklist — Sync everything except these", "Allowlist — Only sync these", "No filter"]} />
            <div className="rounded-2xl" style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
              <div className="px-4 py-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2.5 text-muted-foreground">Blocked addresses</p>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 rounded-xl text-[13px] text-foreground outline-none"
                    style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
                    placeholder="example.com or user@example.com"
                    value={filterEmail} onChange={(e) => setFilterEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addFilterEmail()}
                  />
                  <button onClick={addFilterEmail}
                    className="px-3.5 py-2 rounded-xl text-[13px] font-semibold text-white shrink-0"
                    style={{ background: "#0080FF" }}>Add</button>
                </div>
                {filteredEmails.length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-2.5">
                    {filteredEmails.map((email) => (
                      <div key={email} className="flex items-center justify-between px-3 py-2 rounded-xl"
                        style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                        <span className="text-[13px] text-foreground">{email}</span>
                        <button onClick={() => setFilteredEmails(v => v.filter(e => e !== email))}>
                          <X size={13} strokeWidth={2} className="text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Company Domains */}
          <div className="flex flex-col gap-2">
            <SectionLabel title="Company Domains" />
            <div className="rounded-2xl" style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
              <div className="px-4 py-3.5">
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 rounded-xl text-[13px] text-foreground outline-none"
                    style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
                    placeholder="company.com"
                    value={domain} onChange={(e) => setDomain(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addDomain()}
                  />
                  <button onClick={addDomain}
                    className="px-3.5 py-2 rounded-xl text-[13px] font-semibold text-white shrink-0"
                    style={{ background: "#0080FF" }}>Add</button>
                </div>
                {domains.length === 0
                  ? <p className="text-[12px] mt-2 text-muted-foreground">No domains configured</p>
                  : (
                    <div className="flex flex-col gap-1.5 mt-2.5">
                      {domains.map((d) => (
                        <div key={d} className="flex items-center justify-between px-3 py-2 rounded-xl"
                          style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                          <span className="text-[13px] text-foreground">{d}</span>
                          <button onClick={() => setDomains(v => v.filter(x => x !== d))}>
                            <X size={13} strokeWidth={2} className="text-muted-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>
            </div>
          </div>

        </div>
      </ScrollFade>
      <SaveButton />
    </PageContainer>
  );
}

function MeetingsPage() {
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  type DS = { enabled: boolean; start: string; end: string };
  const [hours, setHours] = useState<Record<string, DS>>({
    Sun: { enabled: false, start: "09:00", end: "17:00" },
    Mon: { enabled: false, start: "09:00", end: "17:00" },
    Tue: { enabled: true,  start: "09:00", end: "17:00" },
    Wed: { enabled: true,  start: "09:00", end: "17:00" },
    Thu: { enabled: true,  start: "09:00", end: "17:00" },
    Fri: { enabled: true,  start: "09:00", end: "17:00" },
    Sat: { enabled: false, start: "09:00", end: "17:00" },
  });
  const toggleDay  = (d: string) => setHours(h => ({ ...h, [d]: { ...h[d], enabled: !h[d].enabled } }));
  const setTime    = (d: string, f: "start" | "end", v: string) => setHours(h => ({ ...h, [d]: { ...h[d], [f]: v } }));
  const copyToAll  = (d: string) => { const { start, end } = hours[d]; setHours(h => Object.fromEntries(DAYS.map(k => [k, { ...h[k], start, end }]))); };

  const [weeksOpen,     setWeeksOpen]     = useState(false);
  const [overridesOpen, setOverridesOpen] = useState(false);
  const [bookingOpen,   setBookingOpen]   = useState(false);
  const [bluOpen,       setBluOpen]       = useState(false);
  const [oooOpen,       setOooOpen]       = useState(false);
  const [autoJoin,      setAutoJoin]      = useState("Only meetings that I own");
  const [autoDelete,    setAutoDelete]    = useState("Delete after 30 days");
  const [overrides,     setOverrides]     = useState([
    { id: 1, date: "Mar 26, 2026", range: "01:00 - 05:00" },
    { id: 2, date: "Mar 18, 2026", range: "09:00 - 17:00" },
  ]);
  const [minNotice,     setMinNotice]     = useState(1);
  const [minUnit,       setMinUnit]       = useState("Hours");
  const [bufBefore,     setBufBefore]     = useState("No buffer");
  const [bufAfter,      setBufAfter]      = useState("No buffer");
  const [maxMtg,        setMaxMtg]        = useState(10);
  const [autoDetect,    setAutoDetect]    = useState(true);
  const [duration,      setDuration]      = useState("30 min");
  const [slots,         setSlots]         = useState("3 slots");
  const [notifyBooked,  setNotifyBooked]  = useState(false);
  const [oooStart,      setOooStart]      = useState("2026-06-12");
  const [oooEnd,        setOooEnd]        = useState("2026-06-12");
  const [oooReason,     setOooReason]     = useState("");

  function Stepper({ value, onChange, min = 0 }: { value: number; onChange: (n: number) => void; min?: number }) {
    return (
      <div className="flex items-center rounded-xl overflow-hidden shrink-0" style={{ border: "1px solid var(--border)", background: "var(--secondary)" }}>
        <span className="px-3 py-2 text-[14px] font-semibold text-foreground min-w-10 text-center">{value}</span>
        <div className="flex flex-col" style={{ borderLeft: "1px solid var(--border)" }}>
          <button onClick={() => onChange(value + 1)} className="px-2 py-0.5 flex items-center justify-center" style={{ borderBottom: "1px solid var(--border)" }}>
            <ChevronDown size={11} strokeWidth={2.5} className="text-muted-foreground" style={{ transform: "rotate(180deg)" }} />
          </button>
          <button onClick={() => onChange(Math.max(min, value - 1))} className="px-2 py-0.5 flex items-center justify-center">
            <ChevronDown size={11} strokeWidth={2.5} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  function InlineSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
    return (
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className="appearance-none pl-3 pr-7 py-1.5 rounded-xl text-[13px] text-foreground outline-none"
          style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Meetings" />
      <ScrollFade className="px-4 pb-4">
        <div className="flex flex-col gap-4 pt-2">

          {/* Auto-join + Auto-delete */}
          <PickerDrawer label="Auto-join type" value={autoJoin} onChange={setAutoJoin}
            options={["All meetings", "Only meetings that I own", "Only meetings with @intempt.com participants", "Only meetings with non-@intempt.com participants", "Only meetings with teammates"]} />
          <PickerDrawer label="Auto-delete recordings" sub="Automatically remove meeting recordings after a set period"
            value={autoDelete} onChange={setAutoDelete}
            options={["Delete after 7 days", "Delete after 30 days", "Delete after 90 days", "Never delete"]} />

          {/* My Weekly Hours */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--raised)" }}>
            <button onClick={() => setWeeksOpen(v => !v)} className="flex items-start gap-3 w-full px-4 py-3.5 outline-none">
              <div className="flex-1 text-left">
                <p className="text-[15px] font-bold text-foreground">My Weekly Hours</p>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Set your personal availability for each day of the week</p>
              </div>
              <ChevronDown size={15} strokeWidth={2} className="text-muted-foreground shrink-0 mt-0.5"
                style={{ transform: weeksOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s ease" }} />
            </button>
            {weeksOpen && DAYS.map((day, i) => {
              const d = hours[day];
              const isFirstActive = d.enabled && !DAYS.slice(0, i).some(pd => hours[pd].enabled);
              return (
                <div key={day} className="flex items-center gap-2 px-4 py-2.5" style={{ borderTop: "1px solid var(--border)" }}>
                  <button onClick={() => toggleDay(day)}
                    className="w-11 h-8 rounded-lg flex items-center justify-center shrink-0 text-[12px] font-bold"
                    style={{ background: d.enabled ? "#0080FF" : "transparent", color: d.enabled ? "#fff" : "var(--foreground)", border: d.enabled ? "none" : "1px solid var(--border)" }}>
                    {day}
                  </button>
                  {d.enabled ? (
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <div className="flex items-center px-2 py-1.5 rounded-lg flex-1 min-w-0" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                        <input type="time" value={d.start} onChange={(e) => setTime(day, "start", e.target.value)}
                          className="flex-1 bg-transparent text-[11px] text-foreground outline-none min-w-0 w-0" />
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">to</span>
                      <div className="flex items-center px-2 py-1.5 rounded-lg flex-1 min-w-0" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                        <input type="time" value={d.end} onChange={(e) => setTime(day, "end", e.target.value)}
                          className="flex-1 bg-transparent text-[11px] text-foreground outline-none min-w-0 w-0" />
                      </div>
                      <button className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ border: "1px solid var(--border)" }}>
                        <Plus size={11} strokeWidth={2.5} className="text-muted-foreground" />
                      </button>
                      {isFirstActive && (
                        <button onClick={() => copyToAll(day)} className="flex items-center gap-1 shrink-0">
                          <Copy size={10} strokeWidth={1.75} style={{ color: "#0080FF" }} />
                          <span className="text-[10px] font-semibold" style={{ color: "#0080FF" }}>Copy to all</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>Unavailable</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Date Overrides */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--raised)" }}>
            <button onClick={() => setOverridesOpen(v => !v)} className="flex items-start gap-3 w-full px-4 py-3.5 outline-none">
              <div className="flex-1 text-left">
                <p className="text-[15px] font-bold text-foreground">Date Overrides</p>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Specific dates when your availability differs</p>
              </div>
              <ChevronDown size={15} strokeWidth={2} className="text-muted-foreground shrink-0 mt-0.5"
                style={{ transform: overridesOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s ease" }} />
            </button>
            {overridesOpen && (
              <>
                {overrides.map((o) => (
                  <div key={o.id} className="flex items-center px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
                    <span className="text-[13px] font-semibold text-foreground flex-1">{o.date}</span>
                    <span className="text-[13px] mr-3" style={{ color: "var(--muted-foreground)" }}>{o.range}</span>
                    <button onClick={() => setOverrides(v => v.filter(x => x.id !== o.id))}>
                      <Trash2 size={15} strokeWidth={1.75} style={{ color: "#dc2626" }} />
                    </button>
                  </div>
                ))}
                <div className="px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <button className="flex items-center gap-1.5" style={{ color: "#0080FF" }}>
                    <Plus size={13} strokeWidth={2.5} />
                    <span className="text-[13px] font-semibold">Add Override</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Booking Preferences */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--raised)" }}>
            <button onClick={() => setBookingOpen(v => !v)} className="flex items-start gap-3 w-full px-4 py-3.5 outline-none">
              <div className="flex-1 text-left">
                <p className="text-[15px] font-bold text-foreground">Booking Preferences</p>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Personal buffer times and booking limits</p>
              </div>
              <ChevronDown size={15} strokeWidth={2} className="text-muted-foreground shrink-0 mt-0.5"
                style={{ transform: bookingOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s ease" }} />
            </button>
            {bookingOpen && <div className="flex flex-col gap-4 px-4 pb-4" style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-1.5 flex items-center gap-1">
                  Minimum Notice <Info size={11} strokeWidth={2} className="text-muted-foreground" />
                </p>
                <div className="flex items-center gap-2">
                  <Stepper value={minNotice} onChange={setMinNotice} />
                  <div className="relative flex-1">
                    <select value={minUnit} onChange={(e) => setMinUnit(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2 rounded-xl text-[14px] text-foreground outline-none pr-8"
                      style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                      {["Minutes", "Hours", "Days"].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {([["Buffer Before", bufBefore, setBufBefore], ["Buffer After", bufAfter, setBufAfter]] as [string, string, (v: string) => void][]).map(([lbl, val, set]) => (
                  <div key={lbl}>
                    <p className="text-[13px] font-semibold text-foreground mb-1.5">{lbl}</p>
                    <div className="relative">
                      <select value={val} onChange={(e) => set(e.target.value)}
                        className="w-full appearance-none px-3 py-2 rounded-xl text-[13px] text-foreground outline-none pr-7"
                        style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                        {["No buffer", "5 min", "10 min", "15 min", "30 min"].map(o => <option key={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-1.5">Max Meetings Per Day</p>
                <div className="flex items-center gap-2.5">
                  <Stepper value={maxMtg} onChange={setMaxMtg} min={1} />
                  <span className="text-[14px] font-semibold" style={{ color: "#0080FF" }}>meetings</span>
                </div>
              </div>
            </div>}
          </div>

          {/* Blu Preferences */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--raised)" }}>
            <button onClick={() => setBluOpen(v => !v)} className="flex items-center gap-3 w-full px-4 py-3.5 outline-none">
              <CalendarDays size={22} strokeWidth={2} className="text-foreground shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-[14px] font-bold text-foreground">Blu Preferences</p>
                <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>How Blu handles scheduling on your behalf</p>
              </div>
              <ChevronDown size={15} strokeWidth={2} className="text-muted-foreground shrink-0"
                style={{ transform: bluOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s ease" }} />
            </button>
            {bluOpen && <div style={{ borderTop: "1px solid var(--border)" }}>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <p className="flex-1 text-[13px] font-semibold text-foreground flex items-center gap-1">
                  Auto-detect scheduling discussions <Info size={11} strokeWidth={2} className="text-muted-foreground shrink-0" />
                </p>
                <Toggle value={autoDetect} onChange={setAutoDetect} />
              </div>
              <div style={{ height: 1, background: "var(--border)" }} />
              <div className="flex items-center px-4 py-3">
                <p className="flex-1 text-[13px] font-semibold text-foreground">Default meeting duration</p>
                <InlineSelect value={duration} onChange={setDuration} options={["15 min", "30 min", "45 min", "60 min", "90 min"]} />
              </div>
              <div style={{ height: 1, background: "var(--border)" }} />
              <div className="flex items-center px-4 py-3">
                <p className="flex-1 text-[13px] font-semibold text-foreground">Time slots to suggest</p>
                <InlineSelect value={slots} onChange={setSlots} options={["1 slot", "2 slots", "3 slots", "4 slots", "5 slots"]} />
              </div>
              <div style={{ height: 1, background: "var(--border)" }} />
              <div className="flex items-center gap-3 px-4 py-3.5">
                <p className="flex-1 text-[13px] font-semibold text-foreground flex items-center gap-1">
                  Notify me when meetings are booked <Info size={11} strokeWidth={2} className="text-muted-foreground shrink-0" />
                </p>
                <Toggle value={notifyBooked} onChange={setNotifyBooked} />
              </div>
            </div>}
          </div>

          {/* Out of Office */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--raised)" }}>
            <button onClick={() => setOooOpen(v => !v)} className="flex items-start gap-3 w-full px-4 py-3.5 outline-none">
              <div className="flex-1 text-left">
                <p className="text-[15px] font-bold text-foreground">Out of Office</p>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Block a date range when you're unavailable for meetings.</p>
              </div>
              <ChevronDown size={15} strokeWidth={2} className="text-muted-foreground shrink-0 mt-0.5"
                style={{ transform: oooOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s ease" }} />
            </button>
            {oooOpen && <div className="flex flex-col gap-4 px-4 pb-4" style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              {(["Start Date", "End Date"] as const).map((lbl) => {
                const val  = lbl === "Start Date" ? oooStart : oooEnd;
                const setV = lbl === "Start Date" ? setOooStart : setOooEnd;
                return (
                  <div key={lbl}>
                    <p className="text-[13px] font-semibold text-foreground mb-1.5">{lbl}</p>
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                      <Calendar size={15} strokeWidth={1.75} className="text-muted-foreground shrink-0" />
                      <input type="date" value={val} onChange={(e) => setV(e.target.value)}
                        className="flex-1 bg-transparent text-[14px] text-foreground outline-none" />
                    </div>
                  </div>
                );
              })}
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-1.5">Reason (optional)</p>
                <input className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-foreground outline-none"
                  style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
                  placeholder="e.g., Vacation, Conference"
                  value={oooReason} onChange={(e) => setOooReason(e.target.value)} />
              </div>
            </div>}
          </div>

        </div>
      </ScrollFade>
      <SaveButton />
    </PageContainer>
  );
}

function BrandAIPage() {
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [kbOpen,        setKbOpen]        = useState(false);
  const [companyName,   setCompanyName]   = useState("");
  const [website,       setWebsite]       = useState("");
  const [products,      setProducts]      = useState("");
  const [useCases,      setUseCases]      = useState("");
  const [about,         setAbout]         = useState("");
  const [competitors,   setCompetitors]   = useState("");
  const [objections,    setObjections]    = useState("");
  const [mission,       setMission]       = useState("");
  const [goals,         setGoals]         = useState("");

  function FieldInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
      <div>
        <p className="text-[14px] font-semibold text-foreground mb-1.5">{label}</p>
        <input className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-foreground outline-none"
          style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
          placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }

  function FieldArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
      <div>
        <p className="text-[14px] font-semibold text-foreground mb-1.5">{label}</p>
        <textarea className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-foreground outline-none resize-none"
          style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
          placeholder={placeholder} rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }

  function CollapsibleCard({ icon, title, open, onToggle, children }: {
    icon: React.ReactNode; title: string; open: boolean; onToggle: () => void; children: React.ReactNode;
  }) {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
        <button onClick={onToggle} className="flex items-center gap-3 w-full px-4 py-3.5 text-left">
          <span className="shrink-0">{icon}</span>
          <span className="flex-1 text-[15px] font-bold text-foreground">{title}</span>
          <ChevronDown size={16} strokeWidth={2} className="text-muted-foreground shrink-0 transition-transform duration-200"
            style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)" }} />
        </button>
        {open && (
          <>
            <div style={{ height: 1, background: "var(--border)" }} />
            <div className="flex flex-col gap-4 px-4 py-4">
              {children}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Brand & AI" />
      <ScrollFade className="px-4 pb-4">
        <div className="flex flex-col gap-3 pt-2">

          <CollapsibleCard
            icon={<Building2 size={22} strokeWidth={2} className="text-foreground" />}
            title="Company Profile"
            open={profileOpen}
            onToggle={() => setProfileOpen(v => !v)}
          >
            <FieldInput  label="Company name"       value={companyName}  onChange={setCompanyName}  placeholder="e.g., Acme Inc." />
            <FieldInput  label="Website"            value={website}      onChange={setWebsite}      placeholder="https://yourbrand.com" />
            <FieldArea   label="Products & services" value={products}    onChange={setProducts}     placeholder="List your main products or services" />
            <FieldArea   label="Use cases"          value={useCases}     onChange={setUseCases}     placeholder="How customers use your product" />
            <FieldArea   label="About your company" value={about}        onChange={setAbout}        placeholder="Your company story and what sets you apart" />
            <FieldInput  label="Competitors"        value={competitors}  onChange={setCompetitors}  placeholder="Competitor A, Competitor B, Competitor C" />
            <FieldArea   label="Common objections"  value={objections}   onChange={setObjections}   placeholder="Objections your sales team hears most" />
            <FieldArea   label="Mission & values"   value={mission}      onChange={setMission}      placeholder="Your company mission and core values" />
            <FieldArea   label="Goals"              value={goals}        onChange={setGoals}        placeholder="Key business goals" />
          </CollapsibleCard>

          <CollapsibleCard
            icon={<BookOpen size={22} strokeWidth={2} className="text-foreground" />}
            title="Knowledge Base"
            open={kbOpen}
            onToggle={() => setKbOpen(v => !v)}
          >
            <div className="flex items-start gap-3">
              <p className="flex-1 text-[13px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                Provide documentation, websites, or text snippets to help Blu understand your product and company.
              </p>
              <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-semibold text-white shrink-0"
                style={{ background: "#0080FF" }}>
                <Plus size={14} strokeWidth={2.5} /> Add Source
              </button>
            </div>
            <p className="text-[13px]" style={{ color: "var(--muted-foreground)" }}>No sources added yet.</p>
          </CollapsibleCard>

        </div>
      </ScrollFade>
      <SaveButton />
    </PageContainer>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

const PAGES: Record<string, React.FC> = {
  appearance:   AppearancePage,
  reporting:    ReportingPage,
  connections:  ConnectionsPage,
  account:      AccountPage,
  profile:      ProfilePage,
  org:          OrgPage,
  locale:       LocalePage,
  notifications: NotificationsPage,
  permissions:  PermissionsPage,
  workspace:    WorkspacePage,
  brandai:      BrandAIPage,
  meetings:     MeetingsPage,
};

export default function SettingsSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = use(params);
  const Page = PAGES[section];
  if (!Page) return <div className="flex-1 flex items-center justify-center"><p className="text-muted-foreground text-sm">Not found</p></div>;
  return <Page />;
}
