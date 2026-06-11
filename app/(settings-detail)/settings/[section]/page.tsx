"use client";

import { use, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Sun, Moon, SunMoon, Check, ChevronDown,
  Camera, Mic, ImageIcon, Bell, Mail, Phone,
  Building2, FolderKanban, Shield,
  Smartphone, Trash2, UserCircle,
} from "lucide-react";

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
  const router = useRouter();
  return (
    <div className="shrink-0 flex items-center gap-3 px-4 pt-4 pb-3" style={{ background: "var(--page)" }}>
      <button
        onClick={() => router.back()}
        className="w-11 h-11 flex items-center justify-center rounded-full shrink-0"
        style={{ background: "var(--raised)", border: "1px solid var(--border)", animation: "back-btn-in 0.42s cubic-bezier(0.34,1.56,0.64,1) 0.06s both" }}
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

function SaveButton({ onPress }: { onPress: () => void }) {
  return (
    <div className="px-4 pt-4 pb-8">
      <button
        onClick={onPress}
        className="w-full py-3 rounded-2xl text-[14px] font-semibold text-white"
        style={{ background: "#1d4ed8" }}
      >
        Save
      </button>
    </div>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest px-1 pt-2 pb-1" style={{ color: "var(--muted-foreground)" }}>
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
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10 transition-opacity duration-300"
        style={{ opacity: atBottom ? 0 : 1, background: "linear-gradient(to top, var(--page) 0%, var(--page) 15%, transparent 100%)" }} />
    </div>
  );
}

// ─── Section pages ────────────────────────────────────────────────────────────

function AppearancePage() {
  const router = useRouter();
  const [appearance, setAppearance] = useState<"Light" | "Dark" | "Automatic">("Light");
  const OPTIONS = [
    { key: "Light" as const,     icon: Sun,     label: "Light",     sub: "Always use light mode"     },
    { key: "Dark" as const,      icon: Moon,    label: "Dark",      sub: "Always use dark mode"      },
    { key: "Automatic" as const, icon: SunMoon, label: "Automatic", sub: "Follow system preference"  },
  ];
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-page" style={{ animation: "slide-in-right 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <PageHeader title="Appearance" />
      <ScrollFade className="px-4 pb-8">
        <div className="flex flex-col gap-1 pt-2">
          {OPTIONS.map(({ key, icon: Icon, label, sub }) => {
            const active = appearance === key;
            return (
              <button
                key={key}
                onClick={() => setAppearance(key)}
                className="flex items-center gap-3.5 w-full px-3.5 py-3 rounded-2xl text-left"
                style={{ background: active ? "rgba(59,130,246,0.07)" : "var(--raised)", border: `1px solid ${active ? "rgba(59,130,246,0.2)" : "var(--border)"}` }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: active ? "rgba(59,130,246,0.12)" : "var(--secondary)" }}>
                  <Icon size={17} strokeWidth={1.75} style={{ color: active ? "#1d4ed8" : "var(--icon)" }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: active ? "#1d4ed8" : "var(--foreground)" }}>{label}</p>
                  <p className="text-xs mt-0.5 text-muted-foreground">{sub}</p>
                </div>
                {active && <Check size={16} strokeWidth={2} style={{ color: "#1d4ed8", flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      </ScrollFade>
    </div>
  );
}

function ReportingPage() {
  const router = useRouter();
  const PERIODS = ["7D", "14D", "30D", "90D", "6M", "12M"];
  const [period, setPeriod] = useState("30D");
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-page" style={{ animation: "slide-in-right 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <PageHeader title="Reporting Period" />
      <ScrollFade className="px-4 pb-8">
        <p className="text-[13px] text-muted-foreground mb-4 pt-2">Choose the default time window for reports and dashboards.</p>
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => {
            const active = period === p;
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={{ background: active ? "#1d4ed8" : "var(--raised)", color: active ? "#fff" : "var(--foreground)", border: `1px solid ${active ? "#1d4ed8" : "var(--border)"}` }}
              >
                {p}
              </button>
            );
          })}
        </div>
        <SaveButton onPress={() => router.back()} />
      </ScrollFade>
    </div>
  );
}

function ConnectionsPage() {
  const [gmailConn, setGmailConn] = useState(true);
  const [gcalConn,  setGcalConn]  = useState(false);
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-page" style={{ animation: "slide-in-right 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <PageHeader title="Connections" />
      <ScrollFade className="px-4 pb-8">
        <p className="text-[13px] text-muted-foreground mb-4 pt-2">Connect external services to sync your data.</p>
        <div className="flex flex-col gap-2">
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
                  : { color: "#1d4ed8", background: "rgba(59,130,246,0.08)" }}
              >
                {connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </ScrollFade>
    </div>
  );
}

function AccountPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-page" style={{ animation: "slide-in-right 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <PageHeader title="Account" />
      <ScrollFade className="px-4 pb-8">
        <div className="flex flex-col gap-2 pt-2">
          {[
            { icon: Smartphone, label: "Trusted Devices",       sub: "Manage devices with access" },
            { icon: Shield,     label: "Two-Factor Auth",        sub: "Secure your account"        },
          ].map(({ icon: Icon, label, sub }) => (
            <button key={label} className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left"
              style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--secondary)" }}>
                <Icon size={17} strokeWidth={1.75} className="text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
              </div>
              <ChevronLeft size={15} strokeWidth={1.75} className="text-muted-foreground shrink-0" style={{ transform: "rotate(180deg)" }} />
            </button>
          ))}

          <div className="mt-4">
            <button className="flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl text-left"
              style={{ background: "rgba(190,18,60,0.06)", border: "1px solid rgba(190,18,60,0.15)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(190,18,60,0.1)" }}>
                <Trash2 size={17} strokeWidth={1.75} style={{ color: "#be123c" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "#be123c" }}>Delete Account</p>
                <p className="text-xs text-muted-foreground mt-0.5">Permanently remove your account</p>
              </div>
            </button>
          </div>
        </div>
      </ScrollFade>
    </div>
  );
}

function ProfilePage() {
  const router = useRouter();
  const [name,    setName]    = useState("Rana V");
  const [display, setDisplay] = useState("");
  const [phone,   setPhone]   = useState("+1 (555) 123-4567");
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-page" style={{ animation: "slide-in-right 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <PageHeader title="Edit Profile" />
      <ScrollFade className="px-4 pb-4">
        <div className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col items-center gap-3 pt-1">
            <img src="/dp.png" alt="Rana V" className="w-20 h-20 rounded-full object-cover" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }} />
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-semibold"
              style={{ background: "rgba(59,130,246,0.08)", color: "#1d4ed8", border: "1px solid rgba(59,130,246,0.2)" }}>
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
      <SaveButton onPress={() => router.back()} />
    </div>
  );
}

function OrgPage() {
  const router = useRouter();
  type OrgTab = "Organizations" | "Projects";
  const [orgTab,          setOrgTab]          = useState<OrgTab>("Organizations");
  const [selectedOrg,     setSelectedOrg]     = useState("intempt-ext");
  const [selectedProject, setSelectedProject] = useState("stockinvest-project");
  const activeOrg = ORGS.find((o) => o.id === selectedOrg) ?? ORGS[2];
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-page" style={{ animation: "slide-in-right 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <PageHeader title="Switch Workspace" />
      <div className="px-4 pb-2">
        <div className="flex p-1 rounded-[14px]" style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
          {(["Organizations", "Projects"] as OrgTab[]).map((tab) => {
            const isActive = orgTab === tab;
            return (
              <button key={tab} onClick={() => setOrgTab(tab)}
                className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-[10px] text-[13px] font-semibold transition-all duration-200"
                style={{ background: isActive ? "var(--page)" : "transparent", color: isActive ? "#1d4ed8" : "var(--muted-foreground)", boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                {tab === "Organizations" ? <Building2 size={14} strokeWidth={1.75} /> : <FolderKanban size={14} strokeWidth={1.75} />}
                {tab}
              </button>
            );
          })}
        </div>
      </div>
      <ScrollFade className="px-4 pb-8">
        {orgTab === "Organizations" ? (
          <div className="flex flex-col gap-1 pt-2">
            {ORGS.map((org) => {
              const isSel = org.id === selectedOrg;
              return (
                <button key={org.id}
                  className="flex items-center gap-3.5 w-full px-3.5 py-3 rounded-2xl text-left"
                  style={{ background: isSel ? "rgba(59,130,246,0.07)" : "var(--raised)", border: `1px solid ${isSel ? "rgba(59,130,246,0.2)" : "var(--border)"}` }}
                  onClick={() => { setSelectedOrg(org.id); setSelectedProject(org.projects[0]?.id ?? ""); setTimeout(() => setOrgTab("Projects"), 180); }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-[15px] font-bold" style={{ background: org.color }}>{org.initial}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground truncate">{org.name}</p>
                    <p className="text-[12px] mt-0.5 text-muted-foreground">{org.projects.length} project{org.projects.length !== 1 ? "s" : ""}</p>
                  </div>
                  {isSel && <Check size={16} strokeWidth={2.5} style={{ color: "#1d4ed8", flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-1 pt-2">
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
                  style={{ background: isSel ? "rgba(59,130,246,0.07)" : "var(--raised)", border: `1px solid ${isSel ? "rgba(59,130,246,0.2)" : "var(--border)"}` }}
                  onClick={() => { setSelectedProject(proj.id); router.back(); }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                    <FolderKanban size={16} strokeWidth={1.75} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground truncate">{proj.name}</p>
                    <p className="text-[12px] mt-0.5 text-muted-foreground">{activeOrg.name}</p>
                  </div>
                  {isSel && <Check size={16} strokeWidth={2.5} style={{ color: "#1d4ed8", flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        )}
      </ScrollFade>
    </div>
  );
}

function LocalePage() {
  const router = useRouter();
  const [language,       setLanguage]       = useState("English");
  const [country,        setCountry]        = useState("United States of America");
  const [dateFormat,     setDateFormat]     = useState("MM/DD/YYYY");
  const [firstDayOfWeek, setFirstDayOfWeek] = useState("Sunday");
  const [timeFormat,     setTimeFormat]     = useState("12-hour (2:30 PM)");
  const [numberFormat,   setNumberFormat]   = useState("1,234.56");
  const [currency,       setCurrency]       = useState("$ USD");
  const [currencyPos,    setCurrencyPos]    = useState("Before amount ($100)");
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-page" style={{ animation: "slide-in-right 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
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
      <SaveButton onPress={() => router.back()} />
    </div>
  );
}

function NotificationsPage() {
  const [pushNotif,       setPushNotif]       = useState(true);
  const [emailNotif,      setEmailNotif]      = useState(true);
  const [meetingReminder, setMeetingReminder] = useState("15 minutes before");
  const [reminderOpen,    setReminderOpen]    = useState(false);
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-page" style={{ animation: "slide-in-right 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
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
              <button onClick={() => setReminderOpen(v => !v)} className="flex items-center gap-1.5 shrink-0" style={{ color: "#1d4ed8" }}>
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
                        style={{ background: sel ? "rgba(59,130,246,0.07)" : "transparent", animation: "tab-in 0.2s ease-out both", animationDelay: `${i * 24}ms` }}>
                        <span className="text-[13px] font-medium" style={{ color: sel ? "#1d4ed8" : "var(--foreground)" }}>{opt}</span>
                        {sel && <Check size={13} strokeWidth={2} style={{ color: "#1d4ed8" }} />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </ScrollFade>
    </div>
  );
}

function PermissionsPage() {
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-page" style={{ animation: "slide-in-right 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
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
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--secondary)" }}>
                  <Icon size={17} strokeWidth={1.8} className="text-muted-foreground" />
                </div>
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
    </div>
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
};

export default function SettingsSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = use(params);
  const Page = PAGES[section];
  if (!Page) return <div className="flex-1 flex items-center justify-center"><p className="text-muted-foreground text-sm">Not found</p></div>;
  return <Page />;
}
