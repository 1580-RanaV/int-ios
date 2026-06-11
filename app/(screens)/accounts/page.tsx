"use client";

import { useState, useEffect, useRef } from "react";
import { useNav } from "../_context/nav-context";
import { Building2, Search, Plus, ChevronRight } from "lucide-react";

const ACCOUNTS = [
  { name: "Waverly Digital",      users: 1,  updated: "2 hours ago"  },
  { name: "Intempt Technologies", users: 35, updated: "4 hours ago"  },
  { name: "Northstar Labs",       users: 1,  updated: "10 hours ago" },
  { name: "Caldera Systems",      users: 1,  updated: "13 hours ago" },
  { name: "Pinebrook Media",      users: 1,  updated: "19 hours ago" },
  { name: "Vantage Point Co.",    users: 1,  updated: "19 hours ago" },
  { name: "StockInvest.us",       users: 12, updated: "1 day ago"    },
  { name: "Ironclad Ops",         users: 3,  updated: "1 day ago"    },
  { name: "Acme Corp",            users: 7,  updated: "2 days ago"   },
  { name: "Solstice Health",      users: 1,  updated: "2 days ago"   },
  { name: "Horizon Ventures",     users: 4,  updated: "3 days ago"   },
  { name: "Driftwood Studio",     users: 2,  updated: "4 days ago"   },
  { name: "BlueSky Analytics",    users: 9,  updated: "5 days ago"   },
  { name: "Redline Commerce",     users: 1,  updated: "6 days ago"   },
  { name: "Meridian Group",       users: 22, updated: "1 week ago"   },
];

export default function AccountsScreen() {
  const [query, setQuery] = useState("");
  const { scrolled, setScrolled } = useNav();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => { setScrolled(false); }, []);

  const filtered = ACCOUNTS.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
  }, [filtered]);

  return (
    <div
      className="flex flex-col flex-1 min-h-0 bg-page relative"
      style={{ animation: "slide-in-right 0.45s cubic-bezier(0.25,0.46,0.45,0.94)" }}
    >
      {/* Header */}
      <div className="shrink-0 bg-page px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Building2 size={22} className="text-foreground shrink-0" strokeWidth={1.75} />
            <p className="text-xl font-bold text-foreground leading-tight">Accounts</p>
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

        {/* Search */}
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

      {/* Scroll area */}
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
          {filtered.map((account, i) => (
            <div
              key={account.name}
              className="flex items-center gap-3 p-3.5 rounded-2xl"
              style={{
                background: "var(--raised)",
                border: "1px solid var(--border)",
                animation: "tab-in 0.2s ease-out both",
                animationDelay: `${i * 35}ms`,
              }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "var(--secondary)" }}
              >
                <Building2 size={18} strokeWidth={1.75} className="text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{account.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Owner: Unassigned · {account.users} {account.users === 1 ? "user" : "users"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{account.updated}</p>
              </div>

              <ChevronRight size={16} strokeWidth={1.75} className="text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>

        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 h-10 pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: scrolled ? 1 : 0, background: "linear-gradient(to bottom, var(--page) 0%, transparent 100%)" }}
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
