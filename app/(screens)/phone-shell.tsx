"use client";

import { useState, useEffect, useRef } from "react";
import { Moon, Sun, Smartphone, Loader2, CheckCircle2, CircleX, Check, X } from "lucide-react";

const PHONE_W = 390;
const PHONE_H = 844;

function StatusBar() {
  return (
    <div className="relative shrink-0" style={{ height: 56 }}>
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-black dark:bg-black"
        style={{ top: 10, width: 120, height: 34, borderRadius: 20 }}
      />
      <span className="absolute left-6 text-base font-semibold tracking-tight text-foreground" style={{ top: 16 }}>
        9:41
      </span>
      <div className="absolute right-6 flex items-center gap-1.5 text-foreground" style={{ top: 18 }}>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
          <rect x="0"    y="7"   width="2.5" height="4"    rx="0.6" />
          <rect x="4.5"  y="4.5" width="2.5" height="6.5"  rx="0.6" />
          <rect x="9"    y="2"   width="2.5" height="9"    rx="0.6" />
          <rect x="13.5" y="0"   width="2.5" height="11"   rx="0.6" opacity="0.28" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <circle cx="7.5" cy="10" r="1.4" fill="currentColor" />
          <path d="M4.5 7.2A4.1 4.1 0 0110.5 7.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M2 4.5A7 7 0 0113 4.5"         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M0 2A9.8 9.8 0 0115 2"          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.28" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" strokeOpacity="0.35" />
          <rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" />
          <path d="M23 4.5v3a1.5 1.5 0 000-3z" fill="currentColor" fillOpacity="0.45" />
        </svg>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="shrink-0 h-8 flex items-center justify-center">
      <div className="w-33.5 h-1.25 rounded-full bg-foreground opacity-15" />
    </div>
  );
}

type NotifType = "success" | "error";

const NOTIF = {
  success: {
    title: "Changes saved",
    message: "Your journey settings have been updated successfully.",
    color: "#16a34a",
  },
  error: {
    title: "Something went wrong",
    message: "Failed to save changes. Please try again.",
    color: "#dc2626",
  },
};

export default function PhoneShell({ children }: { children: React.ReactNode }) {
  const [preview,      setPreview]      = useState(false);
  const [dark,         setDark]         = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("phoneDark") === "1"
  );
  const [scale,        setScale]        = useState(1);
  const [notifType,    setNotifType]    = useState<NotifType | null>(null);
  const [notifLeaving, setNotifLeaving] = useState(false);
  const [loadVisible,  setLoadVisible]  = useState(false);
  const notifTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const CONTROLS_H = 56;
    const GAP        = 20;
    const V_PAD      = 24;
    const update = () => {
      const scaleH = (window.innerHeight - CONTROLS_H - GAP - V_PAD) / PHONE_H;
      const scaleW = (window.innerWidth  - 32) / PHONE_W;
      setScale(Math.min(1, scaleH, scaleW));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const triggerNotif = (type: NotifType) => {
    if (notifTimer.current) clearTimeout(notifTimer.current);
    setNotifLeaving(false);
    setNotifType(type);
    notifTimer.current = setTimeout(() => {
      setNotifLeaving(true);
      setTimeout(() => setNotifType(null), 320);
    }, 3000);
  };

  const toggleLoad = () => setLoadVisible((v) => !v);

  const ctrlBase = "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all";

  const notif = notifType ? NOTIF[notifType] : null;

  return (
    <div
      className="h-screen overflow-hidden bg-[#e8e8ee] flex flex-col items-center justify-center"
      style={{ gap: 20, paddingBlock: 12 }}
    >
      {/* Phone wrapper */}
      <div style={{ width: PHONE_W, height: Math.round(PHONE_H * scale) }}>
        <div
          className={`relative flex flex-col overflow-hidden${dark ? " dark" : ""}`}
          style={{
            width: PHONE_W,
            height: PHONE_H,
            borderRadius: preview ? 44 : 0,
            background: dark ? "#0f1011" : "#f7f8f8",
            willChange: "transform",
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {preview && <StatusBar />}

          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {children}
          </div>

          {preview && <HomeIndicator />}

          {/* ── In-app notification ───────────────────────────────── */}
          {notif && (
            <div
              className="absolute left-3 right-3 z-100 pointer-events-none"
              style={{
                top: preview ? 68 : 16,
                willChange: "transform, opacity",
                animation: notifLeaving
                  ? "notif-out 0.3s cubic-bezier(0.4,0,1,1) forwards"
                  : "notif-in 0.56s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              <div
                className="rounded-[20px] flex items-center overflow-hidden"
                style={{
                  background: dark ? "#1c1d21" : "#ffffff",
                  boxShadow: dark
                    ? "0 1px 3px rgba(0,0,0,0.5), 0 6px 16px rgba(0,0,0,0.5), 0 20px 48px rgba(0,0,0,0.45), 0 48px 80px rgba(0,0,0,0.3)"
                    : "0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.10), 0 20px 48px rgba(0,0,0,0.13), 0 48px 80px rgba(0,0,0,0.08)",
                }}
              >
                {/* Full-height filled icon */}
                <div
                  className="self-stretch flex items-center justify-center"
                  style={{
                    width: 68,
                    flexShrink: 0,
                    background: notifType === "success" ? "#16a34a" : "#dc2626",
                    willChange: "transform, opacity",
                    animation: "icon-pop 0.52s cubic-bezier(0.34,1.56,0.64,1) 0.12s both",
                  }}
                >
                  {notifType === "success"
                    ? <Check size={28} strokeWidth={3.5} color="#ffffff" />
                    : <X     size={26} strokeWidth={3.5} color="#ffffff" />
                  }
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 px-4 py-3.5">
                  <p
                    className="text-[14px] font-bold leading-snug"
                    style={{ color: dark ? "#f7f8f8" : "#111113" }}
                  >
                    {notif.title}
                  </p>
                  <p
                    className="text-[12px] mt-0.5 leading-relaxed"
                    style={{ color: dark ? "#8a8f98" : "#62666d" }}
                  >
                    {notif.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Loading overlay ───────────────────────────────────── */}
          {loadVisible && (
            <div
              className="absolute inset-0 z-200 flex items-center justify-center"
              style={{
                background: dark ? "#0f1011" : "#f7f8f8",
                animation: "fade-in 0.22s ease",
              }}
            >
              <img
                src="/logo.png"
                alt="Loading"
                className="animate-logo-pulse"
                style={{ width: 80, height: 80, objectFit: "contain" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Controls ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">

        <button onClick={() => setDark((d) => { const next = !d; localStorage.setItem("phoneDark", next ? "1" : "0"); return next; })} className={ctrlBase}
          style={{ background: dark ? "#222326" : "#ffffff", color: dark ? "#f7f8f8" : "#222326", border: `1px solid ${dark ? "#383b3f" : "#d8dae5"}` }}>
          {dark ? <Moon size={14} /> : <Sun size={14} />}
          {dark ? "Dark" : "Light"}
        </button>

        <button onClick={() => setPreview((p) => !p)} className={ctrlBase}
          style={{ background: preview ? "#3b82f6" : "#ffffff", color: preview ? "#ffffff" : "#222326", border: `1px solid ${preview ? "#3b82f6" : "#d8dae5"}` }}>
          <Smartphone size={14} />
          {preview ? "Exit" : "Preview"}
        </button>

        <button onClick={() => triggerNotif("success")} className={ctrlBase}
          style={{ background: "#ffffff", color: "#16a34a", border: "1px solid #bbf7d0" }}>
          <CheckCircle2 size={14} strokeWidth={2} />
          Saved
        </button>

        <button onClick={() => triggerNotif("error")} className={ctrlBase}
          style={{ background: "#ffffff", color: "#dc2626", border: "1px solid #fecaca" }}>
          <CircleX size={14} strokeWidth={2} />
          Error
        </button>

        <button onClick={toggleLoad} className={ctrlBase}
          style={{ background: loadVisible ? "#222326" : "#ffffff", color: loadVisible ? "#f7f8f8" : "#222326", border: `1px solid ${loadVisible ? "#383b3f" : "#d8dae5"}` }}>
          <Loader2 size={14} />
          {loadVisible ? "Hide" : "Loader"}
        </button>
      </div>
    </div>
  );
}
