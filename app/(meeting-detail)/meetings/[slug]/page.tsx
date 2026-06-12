"use client";

import { useState, use, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronDown, ChevronUp,
  Play, Pause, SkipBack, SkipForward, Maximize2,
  FileText, Lightbulb, Tag, CheckSquare2, Users,
  Check, Bot, Send, CalendarDays, Clock,
} from "lucide-react";
import { MEETING_DETAILS } from "../../../(screens)/meetings/_data";

// ─── Types ────────────────────────────────────────────────────────────────────

type MeetingTab = "Summary" | "Transcript" | "Ask Blu";
const MEETING_TABS: MeetingTab[] = ["Summary", "Transcript", "Ask Blu"];

// ─── Waveform SVG ─────────────────────────────────────────────────────────────

const BARS = [3,5,8,6,4,7,9,5,3,6,8,4,7,5,9,6,3,8,5,7,4,6,9,3,5,8,6,4,7,5,
              9,6,3,8,5,4,7,9,6,3,5,8,4,7,6,9,5,3,8,6,4,7,5,9,3,6,8,4,7,5,
              9,6,3,8,5,7,4,6,9,3,5,8,6,4,7,5,9,6,3,8,5,4,7,9,6,3,5,8,4,7];

function Waveform({ progress }: { progress: number }) {
  const total = BARS.length;
  const filled = Math.floor(total * progress);
  return (
    <div className="flex items-center gap-[1.5px] h-8">
      {BARS.map((h, i) => (
        <div
          key={i}
          className="rounded-full shrink-0"
          style={{
            width: 2,
            height: `${(h / 9) * 100}%`,
            background: i < filled ? "#1d4ed8" : "rgba(59,130,246,0.25)",
            transition: "background 0.1s",
          }}
        />
      ))}
    </div>
  );
}

// ─── Accordion section ────────────────────────────────────────────────────────

function AccordionSection({
  icon: Icon,
  title,
  defaultOpen = false,
  children,
}: {
  icon: React.ElementType;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="mb-3 rounded-2xl overflow-hidden"
      style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
    >
      <button
        className="w-full flex items-center gap-3 px-4 py-4"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon size={17} strokeWidth={1.75} className="text-foreground shrink-0" />
        <span className="flex-1 text-left text-[15px] font-bold text-foreground">{title}</span>
        {open
          ? <ChevronUp   size={16} strokeWidth={1.75} className="text-muted-foreground shrink-0" />
          : <ChevronDown size={16} strokeWidth={1.75} className="text-muted-foreground shrink-0" />
        }
      </button>
      {open && (
        <div
          className="px-4 pb-4"
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: 14,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MeetingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug }  = use(params);
  const router    = useRouter();

  const [activeTab,  setActiveTab]  = useState<MeetingTab>("Summary");
  const [closing,    setClosing]    = useState(false);
  const [playing,    setPlaying]    = useState(false);
  const [progress,   setProgress]   = useState(0.14);
  const [speed,      setSpeed]      = useState(1);
  const [videoExpanded, setVideoExpanded] = useState(true);
  const [atBottom,   setAtBottom]   = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const [transcriptQuery, setTranscriptQuery] = useState("");
  const [bluInput,   setBluInput]   = useState("");
  const [bluMessages, setBluMessages] = useState<{ role: "user"|"blu"; text: string }[]>([]);
  const scrollRef  = useRef<HTMLDivElement>(null);

  const meeting = MEETING_DETAILS.find((m) => m.slug === slug);

  const handleBack = () => {
    setClosing(true);
    setTimeout(() => router.back(), 320);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
  }, [activeTab]);

  const sendBlu = () => {
    const text = bluInput.trim();
    if (!text) return;
    setBluMessages((m) => [...m, { role: "user", text }, { role: "blu", text: "I'm analysing the meeting recording to answer your question…" }]);
    setBluInput("");
  };

  const speeds = [0.5, 1, 1.5, 2];
  const nextSpeed = () => setSpeed((s) => speeds[(speeds.indexOf(s) + 1) % speeds.length]);

  if (!meeting) {
    return (
      <div className="flex flex-col flex-1 min-h-0 bg-page items-center justify-center">
        <p className="text-sm text-muted-foreground">Meeting not found</p>
      </div>
    );
  }

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
        <div className="flex items-start justify-between px-5 pt-7 pb-3">
          <button
            onClick={handleBack}
            className="w-11 h-11 flex items-center justify-center rounded-full shrink-0"
            style={{ background: "var(--raised)", border: "1px solid var(--border)", animation: "back-btn-in 0.42s cubic-bezier(0.34,1.56,0.64,1) 0.32s both" }}
          >
            <ChevronLeft size={22} strokeWidth={2} className="text-foreground" />
          </button>

          <div className="flex-1 min-w-0 px-3">
            <p className="text-[17px] font-bold text-foreground leading-snug truncate">{meeting.name}</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <CalendarDays size={11} strokeWidth={1.75} className="text-muted-foreground shrink-0" />
                <span className="text-[11px] text-muted-foreground">{meeting.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={11} strokeWidth={1.75} className="text-muted-foreground shrink-0" />
                <span className="text-[11px] text-muted-foreground">{meeting.time}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Video player ──────────────────────────────────────────── */}
        <div
          className="mx-4"
          style={{
            maxHeight: videoExpanded ? 400 : 0,
            overflow: "hidden",
            transition: "max-height 0.44s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div
            className="w-full rounded-2xl relative"
            style={{ aspectRatio: "16/9", background: "#0a0a0a", overflow: "hidden" }}
          >
            {/* Centre controls — skip / play-pause / skip */}
            <div className="absolute inset-0 flex items-center justify-center gap-6">
              <button
                className="text-white opacity-80 active:opacity-100"
                style={{ transition: "opacity 0.15s" }}
                onClick={() => setProgress((p) => Math.max(0, p - 0.05))}
              >
                <SkipBack size={24} strokeWidth={1.75} />
              </button>

              {/* Play / Pause — cross-fade icons */}
              <button
                className="w-14 h-14 rounded-full flex items-center justify-center relative"
                style={{
                  background: "#1d4ed8",
                  transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease",
                  boxShadow: "0 4px 20px rgba(29,78,216,0.5)",
                }}
                onPointerDown={(e) => { e.currentTarget.style.transform = "scale(0.88)"; }}
                onPointerUp={(e)   => { e.currentTarget.style.transform = "scale(1)"; }}
                onPointerLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                onClick={() => setPlaying((v) => !v)}
              >
                <span className="absolute" style={{ opacity: playing ? 1 : 0, transition: "opacity 0.18s ease" }}>
                  <Pause size={22} strokeWidth={1.75} className="text-white" />
                </span>
                <span className="absolute" style={{ opacity: playing ? 0 : 1, transition: "opacity 0.18s ease", marginLeft: 3 }}>
                  <Play size={22} strokeWidth={1.75} className="text-white" />
                </span>
              </button>

              <button
                className="text-white opacity-80 active:opacity-100"
                style={{ transition: "opacity 0.15s" }}
                onClick={() => setProgress((p) => Math.min(1, p + 0.05))}
              >
                <SkipForward size={24} strokeWidth={1.75} />
              </button>
            </div>

            {/* Bottom scrim */}
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{ height: 52, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }}
            />

            {/* Progress bar */}
            <div
              className="absolute left-0 right-0"
              style={{ bottom: 22, padding: "6px 12px", cursor: "pointer" }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setProgress(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
              }}
            >
              <div className="relative rounded-full" style={{ height: 3, background: "rgba(255,255,255,0.28)" }}>
                <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${progress * 100}%`, background: "#3b82f6" }} />
                <div
                  className="absolute top-1/2 rounded-full bg-white"
                  style={{ left: `${progress * 100}%`, transform: "translate(-50%,-50%)", width: 11, height: 11, boxShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
                />
              </div>
            </div>

            {/* Time labels */}
            <div className="absolute bottom-2 left-3 right-3 flex justify-between pointer-events-none">
              <span className="text-white text-[10px] font-medium">
                {(() => {
                  const secs = Math.floor(progress * parseFloat(meeting.totalTime) * 60);
                  const m = Math.floor(secs / 60);
                  const s = secs % 60;
                  return `${m}:${String(s).padStart(2, "0")}`;
                })()}
              </span>
              <span className="text-white text-[10px] font-medium">{meeting.totalTime}</span>
            </div>
          </div>
        </div>

        {/* ── Controls row: speed | collapse | fullscreen ────────────── */}
        <div className="flex items-center justify-between px-4 py-3">

          {/* Speed — fades when collapsed */}
          <button
            className="h-8 px-3 rounded-full text-[12px] font-bold"
            style={{
              background: "var(--secondary)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              opacity: videoExpanded ? 1 : 0,
              transform: videoExpanded ? "scale(1)" : "scale(0.85)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              pointerEvents: videoExpanded ? "auto" : "none",
            }}
            onClick={nextSpeed}
          >
            {speed}x
          </button>

          {/* Collapse pill — always visible */}
          <button
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full"
            style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
            onClick={() => setVideoExpanded((v) => !v)}
          >
            <div style={{ transition: "transform 0.38s cubic-bezier(0.4,0,0.2,1)", transform: videoExpanded ? "rotate(0deg)" : "rotate(180deg)" }}>
              <ChevronUp size={13} strokeWidth={2} className="text-muted-foreground" />
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground">
              {videoExpanded ? "Collapse" : "Expand"}
            </span>
          </button>

          {/* Fullscreen — fades when collapsed */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{
              background: "var(--secondary)",
              border: "1px solid var(--border)",
              opacity: videoExpanded ? 1 : 0,
              transform: videoExpanded ? "scale(1)" : "scale(0.85)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              pointerEvents: videoExpanded ? "auto" : "none",
            }}
          >
            <Maximize2 size={14} strokeWidth={1.75} className="text-muted-foreground" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-4 pb-4">
          <div className="flex p-1 rounded-[14px]" style={{ background: "var(--secondary)" }}>
            {MEETING_TABS.map((tab) => (
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

        {/* Summary + Transcript tabs share a scroller */}
        {activeTab !== "Ask Blu" && (
          <div
            ref={scrollRef}
            className="absolute inset-0 overflow-y-auto scrollbar-hide pb-6 px-4"
            onScroll={(e) => {
              const el = e.currentTarget;
              setScrolledDown(el.scrollTop > 8);
              setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
            }}
          >
            {activeTab === "Summary" && (
              <div className="pt-1">

                {/* Meeting Purpose */}
                <AccordionSection icon={FileText} title="Meeting Purpose" defaultOpen>
                  {meeting.purpose ? (
                    <div className="flex gap-3">
                      <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: "#15803d" }} />
                      <div>
                        <p className="text-[12px] font-semibold text-muted-foreground mb-1">0:00</p>
                        <p className="text-[13px] text-foreground leading-relaxed">{meeting.purpose}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13px] text-muted-foreground italic">No purpose recorded</p>
                  )}
                </AccordionSection>

                {/* Key Takeaways */}
                <AccordionSection icon={Lightbulb} title="Key Takeaways">
                  {meeting.keyTakeaways && meeting.keyTakeaways.length > 0 ? (
                    <div className="flex flex-col gap-2.5">
                      {meeting.keyTakeaways.map((t, i) => (
                        <div key={i} className="flex gap-2.5 items-start">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: "rgba(59,130,246,0.1)" }}
                          >
                            <span className="text-[10px] font-bold" style={{ color: "#1d4ed8" }}>{i + 1}</span>
                          </div>
                          <p className="text-[13px] text-foreground leading-relaxed">{t}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-muted-foreground italic">No takeaways recorded</p>
                  )}
                </AccordionSection>

                {/* Topics */}
                <AccordionSection icon={Tag} title="Topics">
                  {meeting.topics && meeting.topics.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {meeting.topics.map((topic, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--muted-foreground)" }} />
                          <p className="text-[13px] text-foreground">{topic}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-muted-foreground italic">No topics recorded</p>
                  )}
                </AccordionSection>

                {/* Action Items */}
                <AccordionSection icon={CheckSquare2} title="Action Items">
                  {meeting.actionItems && meeting.actionItems.length > 0 ? (
                    <div className="flex flex-col gap-2.5">
                      {meeting.actionItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div
                            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                            style={{
                              background: item.done ? "#1d4ed8" : "transparent",
                              border: item.done ? "none" : "1.5px solid var(--border)",
                            }}
                          >
                            {item.done && <Check size={11} strokeWidth={2.5} className="text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[13px] text-foreground leading-snug"
                              style={{ textDecoration: item.done ? "line-through" : "none", opacity: item.done ? 0.5 : 1 }}
                            >
                              {item.text}
                            </p>
                            {item.assignee && (
                              <p className="text-[11px] text-muted-foreground mt-0.5">→ {item.assignee}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-muted-foreground italic">No action items</p>
                  )}
                </AccordionSection>

                {/* Participants */}
                <AccordionSection icon={Users} title="Participants">
                  <div className="flex flex-col gap-0">
                    {meeting.participants.map((p, i) => (
                      <div key={i}>
                        {i > 0 && (
                          <div
                            className="my-2.5"
                            style={{ height: 1, background: "linear-gradient(to right, transparent, var(--border) 20%, var(--border) 80%, transparent)" }}
                          />
                        )}
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
                          >
                            <span className="text-[11px] font-bold text-foreground">{p.initials}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            {p.name && <p className="text-[13px] font-semibold text-foreground truncate">{p.name}</p>}
                            {p.email && (
                              <p
                                className="text-[12px] text-muted-foreground truncate"
                                style={{ marginTop: p.name ? 1 : 0 }}
                              >
                                {p.email}
                              </p>
                            )}
                            {!p.name && !p.email && (
                              <p className="text-[13px] text-muted-foreground">{p.initials}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionSection>
              </div>
            )}

            {activeTab === "Transcript" && (
              <div className="pt-1">
                {/* Search bar */}
                <div
                  className="flex items-center gap-2.5 px-3.5 h-10 rounded-2xl mb-4"
                  style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0" style={{ color: "var(--muted-foreground)" }}>
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    value={transcriptQuery}
                    onChange={(e) => setTranscriptQuery(e.target.value)}
                    placeholder="Search transcript..."
                    className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
                  />
                </div>

                {/* Lines */}
                <div className="flex flex-col gap-5">
                  {(() => {
                    const lines = meeting.transcript ?? [];
                    const q = transcriptQuery.toLowerCase();
                    const filtered = q ? lines.filter((l) => l.text.toLowerCase().includes(q) || l.speaker.toLowerCase().includes(q)) : lines;
                    if (filtered.length === 0) {
                      return (
                        <div className="flex items-center justify-center h-24">
                          <p className="text-[13px] text-muted-foreground">No results found</p>
                        </div>
                      );
                    }
                    return filtered.map((line, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: "#1d4ed8" }}
                        >
                          <span className="text-[11px] font-bold text-white">{line.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[13px] font-bold text-foreground">{line.speaker}</span>
                            <span
                              className="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                              style={{ background: "rgba(59,130,246,0.12)", color: "#1d4ed8" }}
                            >
                              {line.time}
                            </span>
                          </div>
                          <p className="text-[13px] text-foreground leading-relaxed">{line.text}</p>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                <div className="h-4" />
              </div>
            )}
          </div>
        )}

        {/* Ask Blu tab */}
        {activeTab === "Ask Blu" && (
          <div className="absolute inset-0 flex flex-col">

            {bluMessages.length === 0 ? (
              /* ── Empty state ── */
              <>
                {/* Scrollable zone: mascot + text + chips */}
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center px-5 py-4">
                  <img
                    src="/blu-agent-mascot.png"
                    alt="Blu"
                    width={76}
                    height={76}
                    style={{ objectFit: "contain", marginBottom: 12 }}
                  />
                  <p className="text-[16px] font-bold text-foreground text-center mb-1.5">
                    Ask Blu about this meeting
                  </p>
                  {/* Chips — wrapping pills */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      "Executive brief",
                      "Action items",
                      "Coaching review",
                      "Draft follow-up email",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => setBluInput(q)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full"
                        style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#1d4ed8", flexShrink: 0 }}>
                          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                        <span className="text-[12px] font-medium text-foreground">{q}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input — always pinned at bottom */}
                <div className="shrink-0 px-4 pb-5 pt-2">
                  <div
                    className="flex items-center gap-2 pl-4 pr-1.5 h-12 rounded-full"
                    style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
                  >
                    <input
                      value={bluInput}
                      onChange={(e) => setBluInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") sendBlu(); }}
                      placeholder="Ask about this meeting..."
                      className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    <button
                      onClick={sendBlu}
                      className="w-9 h-9 flex items-center justify-center rounded-full shrink-0"
                      style={{ background: bluInput.trim() ? "#1d4ed8" : "var(--secondary)" }}
                    >
                      <Send size={15} strokeWidth={1.75} style={{ color: bluInput.trim() ? "white" : "var(--muted-foreground)" }} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* ── Chat messages ── */
              <>
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-5">
                  <div className="flex flex-col gap-3 pt-4 pb-2">
                    {bluMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                        {msg.role === "blu" && (
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: "#1d4ed8" }}
                          >
                            <Bot size={14} strokeWidth={1.75} className="text-white" />
                          </div>
                        )}
                        <div
                          className="max-w-[78%] px-3.5 py-2.5 text-[13px] leading-relaxed"
                          style={{
                            background: msg.role === "user" ? "#1d4ed8" : "var(--raised)",
                            color: msg.role === "user" ? "white" : "var(--foreground)",
                            border: msg.role === "user" ? "none" : "1px solid var(--border)",
                            borderRadius: 18,
                            borderBottomRightRadius: msg.role === "user" ? 5 : 18,
                            borderBottomLeftRadius: msg.role === "blu" ? 5 : 18,
                          }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="shrink-0 px-4 pb-6 pt-3">
                  <div
                    className="flex items-center gap-2 pl-4 pr-1.5 h-12 rounded-full"
                    style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
                  >
                    <input
                      value={bluInput}
                      onChange={(e) => setBluInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") sendBlu(); }}
                      placeholder="Ask about this meeting..."
                      className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    <button
                      onClick={sendBlu}
                      className="w-9 h-9 flex items-center justify-center rounded-full shrink-0"
                      style={{ background: bluInput.trim() ? "#1d4ed8" : "var(--secondary)" }}
                    >
                      <Send size={15} strokeWidth={1.75} style={{ color: bluInput.trim() ? "white" : "var(--muted-foreground)" }} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 h-6 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            opacity: scrolledDown ? 1 : 0,
            background: "linear-gradient(to bottom, var(--page) 0%, transparent 100%)",
          }}
        />

        {/* Bottom fade */}
        {activeTab !== "Ask Blu" && (
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 transition-opacity duration-300"
            style={{
              height: 64,
              opacity: scrolledDown ? 0 : atBottom ? 0 : 1,
              background: "linear-gradient(to top, var(--page) 10%, transparent 100%)",
            }}
          />
        )}
      </div>
    </div>
  );
}
