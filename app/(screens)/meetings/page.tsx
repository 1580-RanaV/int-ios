"use client";

import { useState, useEffect } from "react";
import { useNav } from "../_context/nav-context";
import {
  CalendarDays, Plus, Settings, Search,
  Video, ChevronRight, Users, Clock, Timer, Copy, Pencil, X, ChevronDown,
} from "lucide-react";

type MeetingTab = "Meetings" | "Bookings";

// ── Shared helpers ────────────────────────────────────────────────────────────

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative shrink-0 transition-colors duration-250"
      style={{
        width: 48, height: 28, borderRadius: 999,
        background: on ? "#10b981" : "var(--border)",
        transition: "background 0.25s ease",
      }}
    >
      <div
        className="absolute top-0.5 w-6 h-6 rounded-full bg-white"
        style={{
          boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          transform: on ? "translateX(22px)" : "translateX(2px)",
        }}
      />
    </button>
  );
}

function SelectField({
  label, value, options, onChange,
}: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-semibold text-foreground mb-1.5">{label}</p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 rounded-2xl px-3.5 text-sm font-medium appearance-none outline-none pr-9"
          style={{
            background: "var(--raised)",
            border: "1px solid var(--border)",
            color: value ? "var(--foreground)" : "var(--muted-foreground)",
          }}
        >
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown
          size={14} strokeWidth={1.75}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
        />
      </div>
    </div>
  );
}

function BottomSheet({ closing, onClose, children }: { closing: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{
          background: "rgba(0,0,0,0.4)",
          animation: closing ? "fade-out 0.28s ease-in forwards" : "fade-in 0.2s ease-out",
        }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 inset-x-0 z-50 rounded-t-3xl overflow-hidden"
        style={{
          background: "var(--page)",
          maxHeight: "90%",
          display: "flex",
          flexDirection: "column",
          animation: closing
            ? "sheet-out 0.32s cubic-bezier(0.32,0.72,0,1) forwards"
            : "sheet-in 0.35s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-9 h-1 rounded-full" style={{ background: "var(--border)" }} />
        </div>
        {children}
      </div>
    </>
  );
}

// ── Edit Booking Sheet ────────────────────────────────────────────────────────

type BookingType = { name: string; duration: string; platform: string };

function EditBookingSheet({
  booking, closing, onClose,
}: { booking: BookingType; closing: boolean; onClose: () => void }) {
  const [name,         setName]         = useState(booking.name);
  const [duration,     setDuration]     = useState(booking.duration);
  const [location,     setLocation]     = useState(booking.platform);
  const [meetingType,  setMeetingType]  = useState("Round Robin");
  const [team,         setTeam]         = useState("Product Team");
  const [bookingWindow,setBookingWindow]= useState("14 days");
  const [minNotice,    setMinNotice]    = useState("No minimum");
  const [activeStatus, setActiveStatus] = useState(true);
  const [confirmation, setConfirmation] = useState(true);
  const [triggerWord,  setTriggerWord]  = useState("");
  const [triggerWords, setTriggerWords] = useState<string[]>([]);

  const addTriggerWord = () => {
    const w = triggerWord.trim();
    if (w && !triggerWords.includes(w)) setTriggerWords((p) => [...p, w]);
    setTriggerWord("");
  };

  return (
    <BottomSheet closing={closing} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2 pb-4 shrink-0">
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ background: "var(--secondary)" }}>
          <X size={15} strokeWidth={1.75} className="text-foreground" />
        </button>
        <p className="text-base font-bold text-foreground">Edit Booking Type</p>
        <div className="w-8" />
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-5 pb-6">
        {/* Name */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-foreground mb-1.5">Name <span style={{ color: "#f43f5e" }}>*</span></p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 rounded-2xl px-3.5 text-sm font-medium outline-none"
            style={{ background: "var(--raised)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <SelectField label="Duration" value={duration} options={["15 m", "30 m", "45 m", "60 m", "90 m"]} onChange={setDuration} />
        <SelectField label="Location" value={location} options={["Google Meet", "Zoom", "Microsoft Teams", "In Person"]} onChange={setLocation} />
        <SelectField label="Meeting Type" value={meetingType} options={["Round Robin", "One-on-One", "Group", "Collective"]} onChange={setMeetingType} />

        <div className="mb-4">
          <p className="text-sm font-semibold text-foreground mb-1.5">Team <span style={{ color: "#f43f5e" }}>*</span></p>
          <div className="relative">
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full h-11 rounded-2xl px-3.5 text-sm font-medium appearance-none outline-none pr-9"
              style={{ background: "var(--raised)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              {["Product Team", "Sales Team", "Support Team", "Engineering"].map((o) => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={14} strokeWidth={1.75} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>
        </div>

        <SelectField label="Booking Window" value={bookingWindow} options={["7 days", "14 days", "30 days", "60 days", "90 days"]} onChange={setBookingWindow} />
        <SelectField label="Minimum Notice" value={minNotice} options={["No minimum", "15 min", "30 min", "1 hour", "2 hours", "1 day"]} onChange={setMinNotice} />

        {/* Toggles */}
        <div className="rounded-2xl overflow-hidden mt-2 mb-4" style={{ background: "var(--raised)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between px-4 py-3.5">
            <p className="text-sm font-medium text-foreground">Active Status</p>
            <Toggle on={activeStatus} onToggle={() => setActiveStatus(!activeStatus)} />
          </div>
          <div style={{ height: 1, background: "var(--border)", margin: "0 16px" }} />
          <div className="flex items-center justify-between px-4 py-3.5">
            <p className="text-sm font-medium text-foreground">Meeting Confirmation</p>
            <Toggle on={confirmation} onToggle={() => setConfirmation(!confirmation)} />
          </div>
        </div>

        {/* Blu Codewords */}
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--muted-foreground)" }}>Blu Codewords</p>
        <p className="text-xs text-muted-foreground mb-3">Add trigger words Blu will recognize in email threads to use this meeting type</p>
        <div className="flex gap-2">
          <input
            value={triggerWord}
            onChange={(e) => setTriggerWord(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addTriggerWord(); }}
            placeholder="Enter trigger word"
            className="flex-1 h-11 rounded-2xl px-3.5 text-sm outline-none"
            style={{ background: "var(--raised)", border: "1px solid var(--border)", color: "var(--foreground)" }}
          />
          <button
            onClick={addTriggerWord}
            className="h-11 px-5 rounded-2xl text-sm font-semibold text-white shrink-0"
            style={{ background: "#3b82f6" }}
          >Add</button>
        </div>
        {triggerWords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {triggerWords.map((w) => (
              <div
                key={w}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
              >
                <span className="text-xs font-medium text-foreground">{w}</span>
                <button
                  onClick={() => setTriggerWords((p) => p.filter((t) => t !== w))}
                  className="flex items-center justify-center"
                >
                  <X size={11} strokeWidth={2} className="text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="shrink-0 px-5 pb-8 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
        <button
          className="w-full h-12 rounded-2xl text-sm font-bold text-white"
          style={{ background: "#3b82f6" }}
          onClick={onClose}
        >Save</button>
      </div>
    </BottomSheet>
  );
}

const COMING_UP = [
  { month: "JUN", day: 10, name: "Product Sync", time: "7:00 PM",  countdown: "in 4 hours" },
  { month: "JUN", day: 10, name: "R&D check-in", time: "8:00 PM",  countdown: "in 5 hours" },
  { month: "JUN", day: 13, name: "Test Meeting", time: "12:15 PM", countdown: "in 3 days"  },
];

type MeetingStatus = "Completed" | "Canceled" | "Denied entry";

const STATUS_STYLE: Record<MeetingStatus, { background: string; color: string }> = {
  Completed:      { background: "rgba(16,185,129,0.1)",  color: "#10b981" },
  Canceled:       { background: "rgba(244,63,94,0.1)",   color: "#f43f5e" },
  "Denied entry": { background: "rgba(234,179,8,0.1)",   color: "#ca8a04" },
};

const PAST_MEETINGS: {
  dateLabel: string;
  items: { initial: string; name: string; host: string; date: string; time: string; duration: string; attendees: number; status?: MeetingStatus }[];
}[] = [
  {
    dateLabel: "Jun 12",
    items: [
      { initial: "B", name: "Apex studio follow up", host: "Beso Gugushvili", date: "Jun 12", time: "4:00 PM",  duration: "30 min", attendees: 2, status: "Canceled"     },
    ],
  },
  {
    dateLabel: "Jun 10",
    items: [
      { initial: "B", name: "Test Meeting",           host: "Beso Gugushvili", date: "Jun 10", time: "12:00 PM", duration: "15 min", attendees: 3, status: "Completed"    },
      { initial: "B", name: "Product Sync",           host: "Beso Gugushvili", date: "Jun 10", time: "10:00 AM", duration: "45 min", attendees: 5, status: "Completed"    },
      { initial: "A", name: "Design Review",          host: "Alina Marsh",     date: "Jun 10", time: "9:00 AM",  duration: "30 min", attendees: 4, status: "Denied entry" },
    ],
  },
  {
    dateLabel: "Jun 7",
    items: [
      { initial: "R", name: "Weekly Standup",         host: "Rana V",          date: "Jun 7",  time: "9:30 AM",  duration: "20 min", attendees: 6, status: "Completed"    },
      { initial: "B", name: "Onboarding Call",        host: "Beso Gugushvili", date: "Jun 7",  time: "2:00 PM",  duration: "60 min", attendees: 2, status: "Completed"    },
    ],
  },
  {
    dateLabel: "Jun 5",
    items: [
      { initial: "A", name: "Investor Update",        host: "Alina Marsh",     date: "Jun 5",  time: "3:00 PM",  duration: "45 min", attendees: 8, status: "Canceled"     },
      { initial: "R", name: "Q2 Planning",            host: "Rana V",          date: "Jun 5",  time: "11:00 AM", duration: "90 min", attendees: 7, status: "Denied entry" },
    ],
  },
];

const BOOKING_TYPES = [
  { name: "Test Meeting",   duration: "15 m", platform: "Google Meet" },
  { name: "Onboarding",     duration: "60 m", platform: "Google Meet" },
  { name: "Product Demo",   duration: "30 m", platform: "Google Meet" },
  { name: "Product Query",  duration: "30 m", platform: "Google Meet" },
  { name: "Discovery Call", duration: "30 m", platform: "Google Meet" },
  { name: "test-meeting",   duration: "30 m", platform: "Google Meet" },
];

export default function MeetingsScreen() {
  const [tab, setTab] = useState<MeetingTab>("Meetings");
  const [query, setQuery] = useState("");
  const { scrolled, setScrolled } = useNav();
  const [editingBooking, setEditingBooking] = useState<BookingType | null>(null);
  const [editClosing,    setEditClosing]    = useState(false);

  const openEdit  = (b: BookingType) => { setEditClosing(false); setEditingBooking(b); };
  const closeEdit = () => {
    setEditClosing(true);
    setTimeout(() => { setEditingBooking(null); setEditClosing(false); }, 320);
  };

  useEffect(() => { setScrolled(false); }, []);

  const totalMeetings = COMING_UP.length + PAST_MEETINGS.reduce((s, g) => s + g.items.length, 0);

  return (
    <div
      className="flex flex-col flex-1 min-h-0 bg-page relative"
      style={{ animation: "slide-in-right 0.45s cubic-bezier(0.25,0.46,0.45,0.94)" }}
    >
      {/* Header */}
      <div className="shrink-0 bg-page px-5 pt-5 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <CalendarDays size={22} className="text-foreground shrink-0" strokeWidth={1.75} />
            <div>
              <p className="text-xl font-bold text-foreground leading-tight">Meetings</p>
              <p className="text-xs text-muted-foreground mt-0.5">{totalMeetings} Meetings</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
            >
              <Plus size={16} className="text-foreground" strokeWidth={1.75} />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
            >
              <Settings size={15} className="text-muted-foreground" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Segmented control — same pattern as home screen */}
        <div className="mt-4 flex rounded-[14px] p-1 gap-0.5" style={{ background: "var(--secondary)" }}>
          {(["Meetings", "Bookings"] as MeetingTab[]).map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 text-sm font-semibold py-1.5 rounded-[10px] transition-all duration-200"
                style={{
                  background: isActive ? "var(--raised)" : "transparent",
                  color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                  boxShadow: isActive
                    ? "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)"
                    : "none",
                }}
              >
                {t}
              </button>
            );
          })}
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
            placeholder="Search..."
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
          {tab === "Meetings" ? (
            <>
              {/* Coming up */}
              <div className="mb-1">
                <p className="text-sm font-semibold text-foreground px-0.5 pt-3 pb-2.5">Coming up</p>
                <div className="flex flex-col gap-2.5">
                  {COMING_UP.map((m, i) => (
                    <div
                      key={m.name + m.day}
                      className="flex items-center gap-3 rounded-2xl p-3.5"
                      style={{
                        background: "var(--raised)",
                        border: "1px solid var(--border)",
                        animation: "tab-in 0.2s ease-out both",
                        animationDelay: `${i * 40}ms`,
                      }}
                    >
                      {/* Date box */}
                      <div
                        className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0"
                        style={{ background: "rgba(59,130,246,0.1)" }}
                      >
                        <span className="text-xs font-semibold leading-none" style={{ color: "#3b82f6" }}>{m.month}</span>
                        <span className="text-lg font-bold leading-tight mt-0.5" style={{ color: "#3b82f6" }}>{m.day}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{m.time}</span>
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(251,146,60,0.12)", color: "#f97316" }}
                          >{m.countdown}</span>
                        </div>
                      </div>

                      {/* Join button */}
                      <button
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full shrink-0"
                        style={{ background: "#3b82f6" }}
                      >
                        <Video size={13} strokeWidth={1.75} className="text-white" />
                        <span className="text-xs font-semibold text-white">Join now</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Meetings */}
              <div className="mt-4">
                <p className="text-sm font-semibold text-foreground px-0.5 pb-2">Past Meetings</p>
                {PAST_MEETINGS.map((group, gi) => (
                  <div key={group.dateLabel} className={gi > 0 ? "mt-3" : ""}>
                    {/* Date sub-header */}
                    <div className="flex items-center justify-between px-0.5 pb-2">
                      <span className="text-xs font-semibold text-muted-foreground">{group.dateLabel}</span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
                      >{group.items.length}</span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {group.items.map((item, i) => (
                        <div
                          key={item.name + i}
                          className="flex items-center gap-3 rounded-2xl p-3.5"
                          style={{
                            background: "var(--raised)",
                            border: "1px solid var(--border)",
                            animation: "tab-in 0.2s ease-out both",
                            animationDelay: `${(gi * 4 + i) * 35}ms`,
                          }}
                        >
                          {/* Avatar */}
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 self-start mt-0.5"
                            style={{ background: "var(--secondary)" }}
                          >
                            <span className="text-sm font-bold text-muted-foreground">{item.initial}</span>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            {/* Name + chevron */}
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-foreground leading-snug">{item.name}</p>
                              <ChevronRight size={15} strokeWidth={1.75} className="text-muted-foreground shrink-0 mt-0.5" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.host}</p>

                            {/* Meta row */}
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              <div className="flex items-center gap-1">
                                <CalendarDays size={11} strokeWidth={1.75} className="text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{item.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={11} strokeWidth={1.75} className="text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{item.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Timer size={11} strokeWidth={1.75} className="text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{item.duration}</span>
                              </div>
                            </div>

                            {/* Attendees + status */}
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex items-center gap-1">
                                <Users size={11} strokeWidth={1.75} className="text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{item.attendees}</span>
                              </div>
                              {item.status && (
                                <span
                                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                  style={STATUS_STYLE[item.status]}
                                >{item.status}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-1">
              <p className="text-sm font-semibold text-foreground px-0.5 pt-3 pb-2.5">Booking Types</p>
              <div className="flex flex-col gap-2.5">
                {BOOKING_TYPES.map((b, i) => (
                  <div
                    key={b.name}
                    className="flex items-center gap-3 rounded-2xl p-3.5"
                    style={{
                      background: "var(--raised)",
                      border: "1px solid var(--border)",
                      animation: "tab-in 0.2s ease-out both",
                      animationDelay: `${i * 40}ms`,
                    }}
                  >
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{b.name}</p>
                      <div className="flex items-center gap-2.5 mt-1">
                        <div className="flex items-center gap-1">
                          <Clock size={11} strokeWidth={1.75} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{b.duration}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">·</span>
                        <div className="flex items-center gap-1">
                          <Video size={11} strokeWidth={1.75} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{b.platform}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full"
                        style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
                      >
                        <Copy size={13} strokeWidth={1.75} className="text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => openEdit(b)}
                        className="w-8 h-8 flex items-center justify-center rounded-full"
                        style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
                      >
                        <Pencil size={13} strokeWidth={1.75} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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

      {/* Edit booking sheet */}
      {editingBooking && (
        <EditBookingSheet
          booking={editingBooking}
          closing={editClosing}
          onClose={closeEdit}
        />
      )}
    </div>
  );
}
