"use client";

import { useState } from "react";
import { Moon, Sun, Smartphone } from "lucide-react";

function StatusBar() {
  return (
    <div className="relative shrink-0" style={{ height: 56 }}>
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-black dark:bg-black"
        style={{ top: 10, width: 120, height: 34, borderRadius: 20 }}
      />
      {/* Time — inherits dark:text-foreground */}
      <span className="absolute left-6 text-[15px] font-semibold tracking-tight text-foreground" style={{ top: 16 }}>
        9:41
      </span>
      {/* Icons — currentColor via text-foreground */}
      <div className="absolute right-6 flex items-center gap-1.5 text-foreground" style={{ top: 18 }}>
        {/* Signal */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
          <rect x="0"    y="7"   width="2.5" height="4"    rx="0.6" />
          <rect x="4.5"  y="4.5" width="2.5" height="6.5"  rx="0.6" />
          <rect x="9"    y="2"   width="2.5" height="9"    rx="0.6" />
          <rect x="13.5" y="0"   width="2.5" height="11"   rx="0.6" opacity="0.28" />
        </svg>
        {/* Wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <circle cx="7.5" cy="10" r="1.4" fill="currentColor" />
          <path d="M4.5 7.2A4.1 4.1 0 0110.5 7.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M2 4.5A7 7 0 0113 4.5"         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M0 2A9.8 9.8 0 0115 2"          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.28" />
        </svg>
        {/* Battery */}
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

export default function PhoneShell({ children }: { children: React.ReactNode }) {
  const [preview, setPreview] = useState(false);
  const [dark, setDark] = useState(false);

  return (
    <div className="min-h-screen bg-[#e8e8ee] flex flex-col items-center justify-center gap-8 py-12">

      {/* Phone screen */}
      <div
        className={`relative flex flex-col overflow-hidden${dark ? " dark" : ""}`}
        style={{
          width: 390,
          height: 844,
          borderRadius: preview ? 44 : 0,
          background: dark ? "#0f1011" : "#f7f8f8",
          willChange: "transform",
        }}
      >
        {preview && <StatusBar />}

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {children}
        </div>

        {preview && <HomeIndicator />}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDark((d) => !d)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all"
          style={{
            background: dark ? "#222326" : "#ffffff",
            color: dark ? "#f7f8f8" : "#222326",
            border: `1px solid ${dark ? "#383b3f" : "#d8dae5"}`,
          }}
        >
          {dark ? <Moon size={14} /> : <Sun size={14} />}
          {dark ? "Dark" : "Light"}
        </button>

        <button
          onClick={() => setPreview((p) => !p)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all"
          style={{
            background: preview ? "#3b82f6" : "#ffffff",
            color: preview ? "#ffffff" : "#222326",
            border: `1px solid ${preview ? "#3b82f6" : "#d8dae5"}`,
          }}
        >
          <Smartphone size={14} />
          {preview ? "Exit preview" : "Preview"}
        </button>
      </div>
    </div>
  );
}
