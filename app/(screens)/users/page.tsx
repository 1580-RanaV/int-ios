"use client";

import { useState, useEffect, useRef } from "react";
import { useNav } from "../_context/nav-context";
import { useRouter } from "next/navigation";
import { Users, Search, Plus, ChevronRight } from "lucide-react";
import { USERS } from "./_data";

export default function UsersScreen() {
  const [query, setQuery] = useState("");
  const { scrolled, setScrolled } = useNav();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const router = useRouter();

  useEffect(() => { setScrolled(false); }, []);

  const filtered = USERS.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
  }, [filtered]);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-page relative" style={{ animation: "slide-in-right 0.45s cubic-bezier(0.25,0.46,0.45,0.94)" }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="shrink-0 bg-page px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Users size={22} className="text-foreground shrink-0" strokeWidth={1.75} />
            <p className="text-xl font-bold text-foreground leading-tight">Users</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
            >
              <Plus size={16} className="text-foreground" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div
          className="mt-4 flex items-center gap-2.5 px-3.5 h-10 rounded-2xl"
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

      {/* ── Scrollable list ──────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 relative">
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto scrollbar-hide pb-28 px-4 flex flex-col gap-2.5 pt-1"
          onScroll={(e) => {
            const el = e.currentTarget;
            setScrolled(el.scrollTop > 50);
            setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
          }}
        >
          {filtered.map((user, i) => (
            <button
              key={user.name}
              className="flex items-center gap-3 p-3.5 rounded-2xl w-full text-left"
              style={{
                background: "var(--raised)",
                border: "1px solid var(--border)",
                animation: "tab-in 0.2s ease-out both",
                animationDelay: `${i * 35}ms`,
              }}
              onClick={() => router.push(`/users/${encodeURIComponent(user.name)}`)}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{ background: user.color }}
              >
                <span className="text-base font-bold text-white">
                  {user.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user.seen}</p>
              </div>

              <ChevronRight size={16} className="text-muted-foreground shrink-0" strokeWidth={1.75} />
            </button>
          ))}
        </div>

        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 h-10 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            opacity: scrolled ? 1 : 0,
            background: "linear-gradient(to bottom, var(--page) 0%, transparent 100%)",
          }}
        />

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
