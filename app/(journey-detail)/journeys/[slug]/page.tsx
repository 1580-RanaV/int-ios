"use client";

import { useState, use, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Settings, Pause, Play, CircleX, ChevronDown,
  Check, Layers, Mail, Filter, BarChart2,
} from "lucide-react";
import {
  JOURNEYS, CHANNELS, METRIC_ROWS,
  STATUS_COLOR, STATUS_BG,
  type Channel,
} from "../../../(screens)/journeys/_data";

const FUNNELS = [
  "User Signup Funnel",
  "phone test",
  "Untitled report-330",
  "Successful Charge",
  "Free-to-trial conversion funnel test",
  "Untitled report-973",
  "View Page → New Trial",
  "Untitled report-217",
  "Email campaign funnel",
];

export default function JourneyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [detailTab,      setDetailTab]      = useState<"Overview" | "Analytics">("Overview");
  const [channel,        setChannel]        = useState<Channel>("Email");
  const [closing,        setClosing]        = useState(false);
  const [msgFilter,      setMsgFilter]      = useState("All Messages");
  const [selectedFunnel, setSelectedFunnel] = useState<string | null>(null);
  const [activeSheet,    setActiveSheet]    = useState<null | "messages" | "funnels">(null);
  const [sheetClosing,   setSheetClosing]   = useState(false);
  const [atBottom,       setAtBottom]       = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const journey = JOURNEYS.find((j) => encodeURIComponent(j.name) === slug);

  const closeSheet = () => {
    setSheetClosing(true);
    setTimeout(() => { setActiveSheet(null); setSheetClosing(false); }, 270);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
  }, [detailTab, channel]);

  const handleBack = () => {
    setClosing(true);
    setTimeout(() => router.back(), 320);
  };

  if (!journey) {
    return (
      <div className="flex flex-col flex-1 min-h-0 bg-page items-center justify-center">
        <p className="text-sm text-muted-foreground">Journey not found</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col flex-1 min-h-0 bg-page relative"
      style={{
        animation: closing
          ? "slide-out-right 0.32s cubic-bezier(0.25,0.46,0.45,0.94) forwards"
          : "slide-in-right 0.42s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}
    >
      {/* Header */}
      <div className="shrink-0 px-5 pt-7 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center rounded-full shrink-0"
            style={{ background: "var(--secondary)" }}
          >
            <ChevronLeft size={18} strokeWidth={1.75} className="text-foreground" />
          </button>
          <p className="flex-1 text-lg font-bold text-foreground leading-tight truncate">{journey.name}</p>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full shrink-0"
            style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
          >
            <Settings size={16} className="text-muted-foreground" strokeWidth={1.75} />
          </button>
        </div>

        {/* Status row */}
        <div className="flex items-center justify-between mt-4">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
            style={{ background: STATUS_BG[journey.status], color: STATUS_COLOR[journey.status] }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: STATUS_COLOR[journey.status] }} />
            {journey.status}
          </span>
          <span className="text-xs text-muted-foreground">Since {journey.since}</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 relative">
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto scrollbar-hide"
          onScroll={(e) => {
            const el = e.currentTarget;
            setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
          }}
        >
          {/* Stats strip */}
          <div
            className="mx-5 mb-5 rounded-2xl overflow-hidden"
            style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
          >
            <div className="flex">
              <div className="flex-1 py-3.5 px-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Open Rate</p>
                <p className="text-base font-bold text-foreground tabular-nums">{journey.openRate}</p>
              </div>
              <div style={{ width: 1, background: "var(--border)", margin: "10px 0" }} />
              <div className="flex-1 py-3.5 px-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Click Rate</p>
                <p className="text-base font-bold text-foreground tabular-nums">{journey.clickRate}</p>
              </div>
              <div style={{ width: 1, background: "var(--border)", margin: "10px 0" }} />
              <div className="flex-1 py-3.5 px-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                <p className="text-base font-bold text-foreground tabular-nums">{journey.revenue}</p>
              </div>
            </div>
          </div>

          {/* Overview / Analytics segmented control */}
          <div className="mx-5 mb-5">
            <div className="flex p-1 rounded-[14px]" style={{ background: "var(--secondary)" }}>
              {(["Overview", "Analytics"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className="flex-1 h-8 rounded-[10px] text-sm font-semibold transition-all duration-200"
                  style={{
                    background: detailTab === tab ? "var(--raised)" : "transparent",
                    color:      detailTab === tab ? "var(--foreground)" : "var(--muted-foreground)",
                    boxShadow:  detailTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Overview tab */}
          {detailTab === "Overview" && (
            <div className="px-5 pb-6">
              <p className="text-base font-bold text-foreground mb-3">Delivery Health</p>

              {/* Channel sub-tabs */}
              <div className="flex p-1 rounded-[14px] mb-4" style={{ background: "var(--secondary)" }}>
                {CHANNELS.map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setChannel(ch)}
                    className="flex-1 h-7 rounded-[9px] text-xs font-semibold transition-all duration-200"
                    style={{
                      background: channel === ch ? "var(--raised)" : "transparent",
                      color:      channel === ch ? "var(--foreground)" : "var(--muted-foreground)",
                      boxShadow:  channel === ch ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    }}
                  >
                    {ch}
                  </button>
                ))}
              </div>

              {/* Metrics table */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid var(--border)", background: "var(--raised)" }}
              >
                {METRIC_ROWS.map((metric, i) => {
                  const { count, pct } = journey.channels[channel][metric];
                  return (
                    <div
                      key={metric}
                      className="flex items-center justify-between px-4 py-3"
                      style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
                    >
                      <span className="text-sm text-foreground">{metric}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-foreground tabular-nums w-8 text-right">
                          {count}
                        </span>
                        <span
                          className="text-sm tabular-nums w-14 text-right"
                          style={{ color: pct.startsWith("-") ? "#be123c" : "#15803d" }}
                        >
                          {pct}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Analytics tab */}
          {detailTab === "Analytics" && (
            <div className="px-5 pb-8 flex flex-col gap-6">

              {/* Funnel Performance */}
              <div>
                <p className="text-base font-bold text-foreground mb-3">Funnel Performance</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveSheet("messages")}
                    className="flex-1 h-10 flex items-center justify-between px-3.5 rounded-2xl"
                    style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
                  >
                    <span className="text-sm font-medium text-foreground truncate">{msgFilter}</span>
                    <ChevronDown size={13} strokeWidth={1.75} className="text-muted-foreground shrink-0 ml-1" />
                  </button>
                  <button
                    onClick={() => setActiveSheet("funnels")}
                    className="flex-1 h-10 flex items-center justify-between px-3.5 rounded-2xl"
                    style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Filter size={12} strokeWidth={1.75} className="text-muted-foreground shrink-0" />
                      <span className="text-sm text-muted-foreground truncate">
                        {selectedFunnel ?? "No funnel"}
                      </span>
                    </div>
                    <ChevronDown size={13} strokeWidth={1.75} className="text-muted-foreground shrink-0 ml-1" />
                  </button>
                </div>
              </div>

              {/* Message Performance */}
              <div>
                <p className="text-base font-bold text-foreground mb-3">Message Performance</p>

                {journey.analytics
                  ? journey.analytics.messages
                      .filter((m) => msgFilter === "All Messages" || m.label === msgFilter)
                      .map((msg) => {
                        const rows = [
                          [
                            { label: "Failed",      ...msg.failed      },
                            { label: "Opens",       ...msg.opens       },
                            { label: "Clicks",      ...msg.clicks      },
                            { label: "Conversions", ...msg.conversions },
                          ],
                          [
                            { label: "Replies", ...msg.replies },
                            { label: "Bounced", ...msg.bounced },
                            { label: "Unsub",   ...msg.unsub   },
                            { label: "Spam",    ...msg.spam    },
                          ],
                        ];
                        return (
                          <div
                            key={msg.label}
                            className="rounded-2xl overflow-hidden mb-3"
                            style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
                          >
                            <div className="flex items-start justify-between px-4 pt-4 pb-3">
                              <div>
                                <p className="text-sm font-bold text-foreground">{msg.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{msg.sent.toLocaleString()} sent</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-foreground">{msg.revenuePerMsg}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Revenue / Message</p>
                              </div>
                            </div>

                            {rows.map((cells, ri) => (
                              <div key={ri}>
                                <div style={{ height: 1, background: "var(--border)", margin: "0 16px" }} />
                                <div className="grid grid-cols-4 px-4 py-3 gap-x-2">
                                  {cells.map(({ label, count, pct }) => (
                                    <div key={label}>
                                      <p className="text-xs text-muted-foreground mb-1 leading-none">{label}</p>
                                      <p className="text-base font-bold text-foreground tabular-nums leading-snug">{count}</p>
                                      <p
                                        className="text-xs tabular-nums"
                                        style={{
                                          color: pct === "0.0%"
                                            ? "var(--muted-foreground)"
                                            : pct.startsWith("-")
                                              ? "#be123c"
                                              : "#15803d",
                                        }}
                                      >
                                        {pct}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })
                  : <p className="text-sm text-muted-foreground">No analytics data available.</p>
                }
              </div>
            </div>
          )}
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            opacity: atBottom ? 0 : 1,
            background: "linear-gradient(to top, var(--page) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Bottom action bar */}
      <div
        className="shrink-0 px-5 py-4 flex gap-3"
        style={{ background: "var(--page)" }}
      >
        <button
          className="flex-1 h-11 flex items-center justify-center gap-2 rounded-2xl text-sm font-semibold"
          style={{ background: "var(--raised)", border: "1px solid var(--border)", color: "var(--foreground)" }}
        >
          {journey.status === "Paused"
            ? <Play size={16} strokeWidth={1.75} />
            : <Pause size={16} strokeWidth={1.75} />
          }
          {journey.status === "Paused" ? "Resume" : "Pause"}
        </button>
        <button
          className="flex-1 h-11 flex items-center justify-center gap-2 rounded-2xl text-sm font-semibold"
          style={{ background: "#be123c", color: "#ffffff" }}
        >
          <CircleX size={16} strokeWidth={1.75} />
          End
        </button>
      </div>

      {/* Bottom sheet */}
      {activeSheet && (
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
              maxHeight: "65%",
              animation: sheetClosing
                ? "sheet-out 0.26s ease forwards"
                : "sheet-in 0.32s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          >
            {/* Drag handle */}
            <div className="shrink-0 flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full" style={{ background: "var(--handle)" }} />
            </div>

            {/* Scrollable list */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide pb-6">
              {activeSheet === "messages" && (journey.analytics?.messages ?? []).map((m) => {
                const Icon = m.label === "All Messages" ? Layers : Mail;
                return (
                  <button
                    key={m.label}
                    onClick={() => { setMsgFilter(m.label); closeSheet(); }}
                    className="flex items-center gap-4 w-full px-5 py-3.5"
                    style={{ background: "transparent" }}
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-2xl shrink-0"
                      style={{ background: "var(--secondary)" }}
                    >
                      <Icon size={18} strokeWidth={1.75} className="text-foreground" />
                    </div>
                    <span className="flex-1 text-left text-[15px] font-medium text-foreground leading-snug">{m.label}</span>
                    {msgFilter === m.label && <Check size={16} strokeWidth={2.5} style={{ color: "#1d4ed8" }} />}
                  </button>
                );
              })}

              {activeSheet === "funnels" && [
                { label: "No funnel selected", Icon: Filter },
                ...FUNNELS.map((f) => ({ label: f, Icon: BarChart2 })),
              ].map(({ label, Icon }) => {
                const sel = label === "No funnel selected" ? selectedFunnel === null : selectedFunnel === label;
                return (
                  <button
                    key={label}
                    onClick={() => { setSelectedFunnel(label === "No funnel selected" ? null : label); closeSheet(); }}
                    className="flex items-center gap-4 w-full px-5 py-3.5"
                    style={{ background: "transparent" }}
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-2xl shrink-0"
                      style={{ background: "var(--secondary)" }}
                    >
                      <Icon size={18} strokeWidth={1.75} className="text-foreground" />
                    </div>
                    <span className="flex-1 text-left text-[15px] font-medium text-foreground leading-snug">{label}</span>
                    {sel && <Check size={16} strokeWidth={2.5} style={{ color: "#1d4ed8" }} />}
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
