"use client";

import { useState, useEffect, useRef } from "react";
import { useNav } from "../_context/nav-context";
import { Users, Search, Plus, Settings, ChevronRight } from "lucide-react";

const USERS = [
  { name: "Dappled Snipe",        color: "#c97d2a", seen: "just now"       },
  { name: "Cherished Junglefowl", color: "#27ae60", seen: "49 seconds ago" },
  { name: "Ecstatic Newt",        color: "#16a085", seen: "2 minutes ago"  },
  { name: "Purple Marlin",        color: "#8bc34a", seen: "3 minutes ago"  },
  { name: "Striking Porcupine",   color: "#9e8d2e", seen: "5 minutes ago"  },
  { name: "Truthful Lynx",        color: "#8e44ad", seen: "5 minutes ago"  },
  { name: "Wonderful Swallow",    color: "#7b1fa2", seen: "7 minutes ago"  },
  { name: "Diligent Wombat",      color: "#2ecc71", seen: "8 minutes ago"  },
  { name: "Radiant Falcon",       color: "#e67e22", seen: "12 minutes ago" },
  { name: "Swift Mongoose",       color: "#3498db", seen: "15 minutes ago" },
  { name: "Brave Salamander",     color: "#e74c3c", seen: "18 minutes ago" },
  { name: "Curious Pangolin",     color: "#1abc9c", seen: "22 minutes ago" },
  { name: "Nimble Chameleon",     color: "#f39c12", seen: "31 minutes ago" },
  { name: "Bold Capybara",        color: "#2980b9", seen: "45 minutes ago" },
  { name: "Vivid Marmot",         color: "#c0392b", seen: "1 hour ago"     },
  { name: "Gentle Tapir",         color: "#27ae60", seen: "2 hours ago"    },
  { name: "Fierce Kestrel",       color: "#d35400", seen: "3 hours ago"    },
  { name: "Loyal Wolverine",      color: "#6c3483", seen: "5 hours ago"    },
  { name: "Serene Axolotl",       color: "#148f77", seen: "8 hours ago"    },
  { name: "Majestic Ibis",        color: "#a04000", seen: "1 day ago"      },
];

export default function UsersScreen() {
  const [query, setQuery] = useState("");
  const { scrolled, setScrolled } = useNav();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);

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
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
            >
              <Settings size={15} className="text-muted-foreground" strokeWidth={1.75} />
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
          {filtered.map((user) => (
            <div
              key={user.name}
              className="flex items-center gap-3 p-3.5 rounded-2xl"
              style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
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
            </div>
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
            opacity: atBottom ? 0 : 1,
            background: "linear-gradient(to top, var(--page) 0%, var(--page) 15%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}
