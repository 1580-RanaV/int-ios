"use client";

import { useState, useRef } from "react";
import { useNav } from "../_context/nav-context";
import {
  CheckSquare2, Search, ChevronDown, Plus,
  Mail, Phone, CalendarDays, MessageSquare, Check, Clock,
} from "lucide-react";

function LinkedInIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
import {
  TASKS, FILTER_OPTIONS, PRIORITY_COLOR, GROUP_ORDER,
  type Filter, type Task, type TaskType,
} from "./_data";

// ─── Icon per task type ────────────────────────────────────────────────────────

function TaskTypeIcon({ type }: { type: TaskType }) {
  const cls = "text-muted-foreground";
  const props = { size: 15, strokeWidth: 1.75, className: cls };
  if (type === "Email")    return <Mail       {...props} />;
  if (type === "Call")     return <Phone      {...props} />;
  if (type === "Meeting")  return <CalendarDays {...props} />;
  if (type === "LinkedIn") return <LinkedInIcon size={15} />;
  if (type === "SMS")      return <MessageSquare {...props} />;
  return <CheckSquare2 {...props} />;
}

// ─── Task card ─────────────────────────────────────────────────────────────────

function TaskCard({ task }: { task: Task }) {
  const priority = PRIORITY_COLOR[task.priority];
  const isOverdue = task.group === "Overdue";
  const isDone = task.status === "Completed" || task.status === "Skipped";

  return (
    <button
      className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left"
      style={{ animation: "tab-in 0.22s ease-out both" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--secondary)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      {/* Type icon box */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
      >
        <TaskTypeIcon type={task.type} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[14px] font-semibold leading-snug"
          style={{ color: isDone ? "var(--muted-foreground)" : "var(--foreground)", textDecoration: isDone ? "line-through" : "none" }}
        >
          {task.title}
        </p>
        <p className="text-[12px] mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>
          {task.contact} · {task.company}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex items-center gap-1">
            <Clock size={11} strokeWidth={1.75} style={{ color: isOverdue ? "#dc2626" : "var(--muted-foreground)" }} />
            <span className="text-[11px]" style={{ color: isOverdue ? "#dc2626" : "var(--muted-foreground)" }}>
              {task.timeAgo}
            </span>
          </div>
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ color: priority.color, background: priority.bg }}
          >
            {task.priority}
          </span>
        </div>
      </div>

      {/* Chevron */}
      <ChevronDown
        size={14} strokeWidth={1.75}
        className="text-muted-foreground shrink-0"
        style={{ transform: "rotate(-90deg)" }}
      />
    </button>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const { scrolled, setScrolled } = useNav();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom,      setAtBottom]      = useState(false);
  const [query,         setQuery]         = useState("");
  const [filter,        setFilter]        = useState<Filter>("All");
  const [dropOpen,      setDropOpen]      = useState(false);
  const [dropClosing,   setDropClosing]   = useState(false);
  const [createOpen,    setCreateOpen]    = useState(false);
  const [createClosing, setCreateClosing] = useState(false);
  // create form
  const [cTitle,       setCTitle]       = useState("");
  const [cDesc,        setCDesc]        = useState("");
  const [cType,        setCType]        = useState("");
  const [cPriority,    setCPriority]    = useState("");
  const [cContact,     setCContact]     = useState("");
  const [cAssignee,    setCAssignee]    = useState("");
  const [cDeal,        setCDeal]        = useState("");
  const [cDueDate,     setCDueDate]     = useState("Today");
  const [cTime,        setCTime]        = useState("");
  const [cScrolled,    setCScrolled]    = useState(false);
  const [cAtBottom,    setCAtBottom]    = useState(false);

  const openCreate  = () => { setCreateClosing(false); setCreateOpen(true); };
  const closeCreate = () => {
    setCreateClosing(true);
    setTimeout(() => { setCreateOpen(false); setCreateClosing(false); }, 320);
  };

  const openDrop  = () => { setDropClosing(false); setDropOpen(true); };
  const closeDrop = (next?: Filter) => {
    if (next !== undefined) setFilter(next);
    setDropClosing(true);
    setTimeout(() => { setDropOpen(false); setDropClosing(false); }, 220);
  };

  const filterActive = filter !== "All";

  const filtered = TASKS.filter((t) =>
    (t.title.toLowerCase().includes(query.toLowerCase()) ||
     t.contact.toLowerCase().includes(query.toLowerCase())) &&
    (filter === "All" || t.status === filter)
  );

  const groups = GROUP_ORDER
    .map((g) => ({ label: g, items: filtered.filter((t) => t.group === g) }))
    .filter((g) => g.items.length > 0);

  const overdue   = TASKS.filter((t) => t.group === "Overdue").length;
  const dueToday  = TASKS.filter((t) => t.group === "Today").length;
  const total     = TASKS.length;

  return (
    <div
      className="flex flex-col flex-1 min-h-0 bg-page relative"
      style={{ animation: "tab-in 0.25s ease-out" }}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-5 pt-5 pb-0">
        {/* Title row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <CheckSquare2 size={21} strokeWidth={1.75} className="text-foreground shrink-0" />
            <p className="text-xl font-bold text-foreground">Tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
              onClick={openCreate}
            >
              <Plus size={16} strokeWidth={1.75} className="text-foreground" />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <Clock size={13} strokeWidth={1.75} style={{ color: "#dc2626" }} />
            <span className="text-[12px] font-semibold" style={{ color: "#dc2626" }}>
              {overdue} overdue
            </span>
          </div>
          <div className="w-px h-3.5" style={{ background: "var(--border)" }} />
          <div className="flex items-center gap-1.5">
            <Clock size={13} strokeWidth={1.75} style={{ color: "#d97706" }} />
            <span className="text-[12px] font-semibold" style={{ color: "#d97706" }}>
              {dueToday} due today
            </span>
          </div>
          <div className="w-px h-3.5" style={{ background: "var(--border)" }} />
          <div className="flex items-center gap-1.5">
            <CalendarDays size={13} strokeWidth={1.75} className="text-muted-foreground" />
            <span className="text-[12px] font-semibold text-muted-foreground">
              {total} total
            </span>
          </div>
        </div>

        {/* Search + filter dropdown */}
        <div className="flex gap-2 items-center pb-3">
          <div
            className="flex-3 flex items-center gap-2.5 px-3.5 h-10 rounded-2xl"
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

          <div className="flex-1 relative">
            <button
              onClick={dropOpen ? () => closeDrop() : openDrop}
              className="w-full h-10 flex items-center justify-center gap-1 rounded-2xl transition-colors duration-200"
              style={{
                background: filterActive ? "var(--foreground)" : "var(--raised)",
                color:      filterActive ? "var(--raised)"     : "var(--foreground)",
                border:     filterActive ? "1px solid transparent" : "1px solid var(--border)",
              }}
            >
              <span className="text-sm font-semibold truncate">{filter}</span>
              <ChevronDown
                size={12} strokeWidth={1.75}
                style={{ flexShrink: 0, transition: "transform 0.25s ease", transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {dropOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => closeDrop()} />
                <div
                  className="absolute top-full right-0 mt-2 z-50 rounded-2xl overflow-hidden"
                  style={{
                    width: 148,
                    background: "var(--raised)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.13), 0 3px 10px rgba(0,0,0,0.07)",
                    transformOrigin: "top right",
                    animation: dropClosing
                      ? "dropdown-out 0.22s cubic-bezier(0.4,0,1,1) forwards"
                      : "dropdown-in 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  {FILTER_OPTIONS.map(({ value, color }, i) => {
                    const sel = filter === value;
                    return (
                      <button
                        key={value}
                        onClick={() => closeDrop(value)}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-left transition-colors duration-100"
                        style={{
                          background: sel ? "#0080FF" : "transparent",
                          animation: "tab-in 0.2s ease-out both",
                          animationDelay: `${i * 28}ms`,
                        }}
                        onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = "var(--secondary)"; }}
                        onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}
                      >
                        {color
                          ? <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                          : <span className="w-2 h-2 shrink-0" />
                        }
                        <span className="text-sm font-medium" style={{ color: sel ? "#fff" : "var(--foreground)" }}>
                          {value}
                        </span>
                        {sel && <Check size={13} strokeWidth={2} style={{ color: "#fff", marginLeft: "auto" }} />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Scrollable list ───────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 relative">
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto scrollbar-hide pb-28"
          onScroll={(e) => {
            const el = e.currentTarget;
            setScrolled(el.scrollTop > 8);
            setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
          }}
        >
          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 gap-3">
              <CheckSquare2 size={36} strokeWidth={1.25} className="text-muted-foreground opacity-30" />
              <p className="text-[14px] text-muted-foreground">No tasks found</p>
            </div>
          ) : groups.map(({ label, items }) => (
            <div key={label}>
              {/* Group header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-1.5">
                <span
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: label === "Overdue" ? "#dc2626" : "var(--muted-foreground)" }}
                >
                  {label}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground">{items.length}</span>
              </div>

              {/* Cards */}
              <div
                className="mx-4 rounded-2xl overflow-hidden"
                style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
              >
                {items.map((task, i) => (
                  <div key={task.id}>
                    {i > 0 && <div className="mx-4" style={{ height: 1, background: "var(--border)" }} />}
                    <TaskCard task={task} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="h-6" />
        </div>

        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 h-8 pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: scrolled ? 1 : 0, background: "linear-gradient(to bottom, var(--page) 0%, transparent 100%)" }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            height: 80,
            opacity: scrolled ? 0 : atBottom ? 0 : 1,
            background: "linear-gradient(to top, var(--page) 10%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Create Task sheet ─────────────────────────────────────────────── */}
      {createOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(0,0,0,0.4)",
              animation: createClosing ? "fade-out 0.28s ease-in forwards" : "fade-in 0.2s ease-out",
            }}
            onClick={closeCreate}
          />
          <div
            className="fixed bottom-0 inset-x-0 z-50 rounded-t-3xl"
            style={{
              background: "var(--raised)",
              animation: createClosing
                ? "sheet-out 0.32s cubic-bezier(0.32,0.72,0,1) forwards"
                : "sheet-in 0.35s cubic-bezier(0.32,0.72,0,1)",
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full" style={{ background: "var(--border)" }} />
            </div>

            {/* Header */}
            <div className="px-5 pt-2 pb-3">
              <p className="text-lg font-bold text-foreground">Create Task</p>
            </div>

            {/* Scrollable body — same as settings profile sheet */}
            <div className="relative">
              <div
                className="overflow-y-auto scrollbar-hide"
                style={{ maxHeight: 480 }}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  setCScrolled(el.scrollTop > 8);
                  setCAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
                }}
              >
                <div className="px-5 pb-6 flex flex-col gap-4">

                  {/* Task title */}
                  <div>
                    <p className="text-[13px] font-semibold text-foreground mb-1.5">Task title <span style={{ color: "#dc2626" }}>*</span></p>
                    <input
                      className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-foreground outline-none"
                      style={{ background: "var(--page)", border: "1px solid var(--border)" }}
                      placeholder="Enter task title"
                      value={cTitle}
                      onChange={(e) => setCTitle(e.target.value)}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-[13px] font-semibold text-foreground mb-1.5">Description <span className="font-normal text-muted-foreground">(optional)</span></p>
                    <textarea
                      className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-foreground outline-none resize-none"
                      style={{ background: "var(--page)", border: "1px solid var(--border)", minHeight: 88 }}
                      placeholder="Add task details (optional)"
                      value={cDesc}
                      onChange={(e) => setCDesc(e.target.value)}
                    />
                  </div>

                  {/* Task type */}
                  <div>
                    <p className="text-[13px] font-semibold text-foreground mb-1.5">Task type <span style={{ color: "#dc2626" }}>*</span></p>
                    <div className="relative">
                      <select
                        className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none appearance-none"
                        style={{ background: "var(--page)", border: "1px solid var(--border)", color: cType ? "var(--foreground)" : "var(--muted-foreground)" }}
                        value={cType}
                        onChange={(e) => setCType(e.target.value)}
                      >
                        <option value="" disabled>Select task type</option>
                        {["Email", "Call", "Meeting", "LinkedIn", "SMS", "Task"].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} strokeWidth={1.75} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <p className="text-[13px] font-semibold text-foreground mb-1.5">Priority <span style={{ color: "#dc2626" }}>*</span></p>
                    <div className="relative">
                      <select
                        className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none appearance-none"
                        style={{ background: "var(--page)", border: "1px solid var(--border)", color: cPriority ? "var(--foreground)" : "var(--muted-foreground)" }}
                        value={cPriority}
                        onChange={(e) => setCPriority(e.target.value)}
                      >
                        <option value="" disabled>Select priority</option>
                        {["High", "Medium", "Low"].map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} strokeWidth={1.75} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* Associated with user */}
                  <div>
                    <p className="text-[13px] font-semibold text-foreground mb-1.5">Associated with user <span style={{ color: "#dc2626" }}>*</span></p>
                    <div className="relative">
                      <select
                        className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none appearance-none"
                        style={{ background: "var(--page)", border: "1px solid var(--border)", color: cContact ? "var(--foreground)" : "var(--muted-foreground)" }}
                        value={cContact}
                        onChange={(e) => setCContact(e.target.value)}
                      >
                        <option value="" disabled>Select contact</option>
                        {["Koray Akbakir", "Sarah Chen", "James Patel", "Emma Wilson"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} strokeWidth={1.75} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* Assigned to */}
                  <div>
                    <p className="text-[13px] font-semibold text-foreground mb-1.5">Assigned to <span style={{ color: "#dc2626" }}>*</span></p>
                    <div className="relative">
                      <select
                        className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none appearance-none"
                        style={{ background: "var(--page)", border: "1px solid var(--border)", color: cAssignee ? "var(--foreground)" : "var(--muted-foreground)" }}
                        value={cAssignee}
                        onChange={(e) => setCAssignee(e.target.value)}
                      >
                        <option value="" disabled>Select team member</option>
                        {["Rana V", "Aman Patel", "Sid Chaudhary", "Ved Gorakh Raut"].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} strokeWidth={1.75} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* Deal */}
                  <div>
                    <p className="text-[13px] font-semibold text-foreground mb-1.5">Deal <span className="font-normal text-muted-foreground">(optional)</span></p>
                    <div className="relative">
                      <select
                        className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none appearance-none"
                        style={{ background: "var(--page)", border: "1px solid var(--border)", color: cDeal ? "var(--foreground)" : "var(--muted-foreground)" }}
                        value={cDeal}
                        onChange={(e) => setCDeal(e.target.value)}
                      >
                        <option value="">Select deal (optional)</option>
                        {["StockInvest Q3", "TechFlow Renewal", "Acme Expansion"].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} strokeWidth={1.75} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* Due date */}
                  <div>
                    <p className="text-[13px] font-semibold text-foreground mb-1.5">Due date</p>
                    <div className="relative">
                      <select
                        className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none appearance-none text-foreground"
                        style={{ background: "var(--page)", border: "1px solid var(--border)" }}
                        value={cDueDate}
                        onChange={(e) => setCDueDate(e.target.value)}
                      >
                        {["Today", "Tomorrow", "In 3 days", "Next week", "Custom"].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} strokeWidth={1.75} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <p className="text-[13px] font-semibold text-foreground mb-1.5">Time <span style={{ color: "#dc2626" }}>*</span></p>
                    <div className="relative">
                      <select
                        className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none appearance-none"
                        style={{ background: "var(--page)", border: "1px solid var(--border)", color: cTime ? "var(--foreground)" : "var(--muted-foreground)" }}
                        value={cTime}
                        onChange={(e) => setCTime(e.target.value)}
                      >
                        <option value="" disabled>Select time</option>
                        {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} strokeWidth={1.75} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                </div>
              </div>
              {/* Top fade */}
              <div
                className="absolute top-0 left-0 right-0 pointer-events-none transition-opacity duration-300"
                style={{ height: 40, opacity: cScrolled ? 1 : 0, background: "linear-gradient(to bottom, var(--raised) 0%, transparent 100%)" }}
              />
              {/* Bottom fade */}
              <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none transition-opacity duration-300"
                style={{ height: 56, opacity: cScrolled ? 0 : cAtBottom ? 0 : 1, background: "linear-gradient(to top, var(--raised) 20%, transparent 100%)" }}
              />
            </div>

            {/* Create button */}
            <div className="px-5 pt-2 pb-8">
              <button
                className="w-full py-3.5 rounded-2xl text-[14px] font-semibold text-white"
                style={{ background: "#0080FF" }}
                onClick={closeCreate}
              >
                Create
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
