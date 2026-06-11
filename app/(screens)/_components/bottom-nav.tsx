"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, Users, Building2, Handshake, MoreHorizontal,
  Route, CheckSquare2, CalendarDays, FlaskConical,
  BarChart2, LayoutGrid, Eye, EyeOff, Settings,
} from "lucide-react";
import { useNav } from "../_context/nav-context";

const ALL_SWAPPABLE = [
  { key: "users",       icon: Users,        label: "Users",       href: "/users"       },
  { key: "accounts",    icon: Building2,    label: "Accounts",    href: "/accounts"    },
  { key: "deals",       icon: Handshake,    label: "Deals",       href: "/deals"       },
  { key: "journeys",    icon: Route,        label: "Journeys",    href: "/journeys"    },
  { key: "tasks",       icon: CheckSquare2, label: "Tasks",       href: "/tasks"       },
  { key: "meetings",    icon: CalendarDays, label: "Meetings",    href: "/meetings"    },
  { key: "experiences", icon: FlaskConical, label: "Experiences", href: "/experiences" },
  { key: "reports",     icon: BarChart2,    label: "Reports",     href: "/reports"     },
  { key: "dashboards",  icon: LayoutGrid,   label: "Dashboards",  href: "/dashboards"  },
];

const SPRING = [
  "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
  "box-shadow 0.3s ease",
].join(", ");

const DEFAULT_KEYS = ["users", "accounts", "deals"];

export default function BottomNav() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { scrolled } = useNav();
  const [showMore, setShowMore] = useState(false);
  const [closing,  setClosing]  = useState(false);
  const [selected, setSelected] = useState<string[]>(DEFAULT_KEYS);

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nav-slots");
      if (saved) setSelected(JSON.parse(saved));
    } catch {}
  }, []);

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : prev.length < 3 ? [...prev, key] : prev;
      try { localStorage.setItem("nav-slots", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const openMore  = () => { setClosing(false); setShowMore(true); };
  const closeMore = () => {
    setClosing(true);
    setTimeout(() => { setShowMore(false); setClosing(false); }, 240);
  };

  // Build nav: Home + up-to-3 dynamic slots + More
  const slots = selected
    .map((k) => ALL_SWAPPABLE.find((x) => x.key === k)!)
    .filter(Boolean);

  const navItems = [
    { key: "home", icon: Home,           label: "Home", href: "/home"  },
    ...slots,
    { key: "more", icon: MoreHorizontal, label: "More", href: "/more"  },
  ];

  return (
    <>
      {/* ── Nav bar ─────────────────────────────────────────────────────── */}
      <div
        className="fixed z-30"
        style={{
          bottom: 36,
          left: 12,
          right: 12,
          transform: scrolled
  ? "translateY(-8px) scale(0.95) translateZ(0)"
  : "translateY(0px) scale(1) translateZ(0)",

transformOrigin: "bottom center",
          borderRadius: 999,
          background: "var(--raised)",
          border: "1px solid var(--border)",
          boxShadow: scrolled
            ? "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)"
            : "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
          transition: SPRING,
          willChange: "transform",
          backfaceVisibility: "hidden",
          perspective: 1000,
        }}
      >
        <div className="flex items-center px-1 py-1">
          {navItems.map(({ key, icon: Icon, label, href }) => {
            const isMore = key === "more";
            // While dropdown is open, only More is active — deselects other tabs
            const active = isMore ? showMore : (!showMore && pathname === href);

            const inner = (
              <div
                className="flex-1 flex items-center justify-center gap-1.5 h-9"
                style={{
                  borderRadius: 999,
                  background: active ? "rgba(59,130,246,0.12)" : "transparent",
                  color: active ? "#1d4ed8" : "var(--icon)",
                  transition: "background 0.35s ease, color 0.3s ease",
                }}
              >
                <Icon size={19} strokeWidth={1.75} />
                <span
                  className="text-sm font-semibold leading-none"
                  style={{
                    color: "#1d4ed8", whiteSpace: "nowrap", overflow: "hidden",
                    maxWidth: (active && !scrolled) ? "150px" : "0px",
                    opacity: (active && !scrolled) ? 1 : 0,
                    transition: (active && !scrolled)
                      ? "max-width 0.46s cubic-bezier(0.34,1.3,0.64,1), opacity 0.28s ease-out 0.08s"
                      : "max-width 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.14s ease-in",
                  }}
                >
                  {label}
                </span>
              </div>
            );

            const wrapStyle = {
              flex: (active && !scrolled) ? 3 : 1,
              transition: "flex 0.42s cubic-bezier(0.4,0,0.2,1)",
            };

            return isMore ? (
              <button key={key} onClick={showMore ? closeMore : openMore} className="flex p-0.5" style={wrapStyle}>
                {inner}
              </button>
            ) : (
              <Link key={key} href={href} className="flex p-0.5" style={wrapStyle} onClick={() => showMore && closeMore()}>
                {inner}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Dropdown ────────────────────────────────────────────────────── */}
      {showMore && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeMore} />

          <div
            className="fixed z-50 rounded-2xl overflow-hidden"
            style={{
              bottom: scrolled ? 102 : 92,
              right: 14,
              width: 210,
              background: "var(--raised)",
              border: "1px solid var(--border)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.13), 0 3px 10px rgba(0,0,0,0.07)",
              transformOrigin: "bottom right",
              animation: closing
                ? "dropdown-out 0.22s cubic-bezier(0.4,0,1,1) forwards"
                : "dropdown-in 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {/* Counter */}
            <div className="px-4 pt-3 pb-1 flex justify-end">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: selected.length >= 3 ? "rgba(59,130,246,0.1)" : "var(--secondary)",
                  color: selected.length >= 3 ? "#1d4ed8" : "var(--muted-foreground)",
                }}
              >
                {selected.length} / 3
              </span>
            </div>

            {ALL_SWAPPABLE.map(({ key, icon: Icon, label, href }, i) => {
              const isSelected = selected.includes(key);
              const atMax      = !isSelected && selected.length >= 3;

              return (
                <div
                  key={key}
                  className="flex items-center w-full transition-colors duration-100"
                  style={{
                    animation: "tab-in 0.2s ease-out both",
                    animationDelay: `${i * 28}ms`,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--secondary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  {/* Row — navigate */}
                  <button
                    className="flex items-center gap-3 flex-1 px-4 py-2.5 text-left"
                    onClick={() => { closeMore(); router.push(href); }}
                  >
                    <Icon
                      size={17} strokeWidth={1.75} className="shrink-0"
                      style={{ color: isSelected ? "#1d4ed8" : "var(--icon)" }}
                    />
                    <span className="flex-1 text-sm font-medium" style={{ color: isSelected ? "#1d4ed8" : "var(--foreground)" }}>
                      {label}
                    </span>
                  </button>

                  {/* Eye — toggle slot */}
                  <button
                    className="px-4 py-2.5 shrink-0"
                    onClick={(e) => { e.stopPropagation(); if (!atMax) toggle(key); }}
                    style={{ opacity: atMax ? 0.35 : 1, cursor: atMax ? "default" : "pointer" }}
                  >
                    {isSelected
                      ? <Eye    size={15} strokeWidth={1.75} style={{ color: "#1d4ed8" }} />
                      : <EyeOff size={15} strokeWidth={1.75} style={{ color: "var(--muted-foreground)" }} />
                    }
                  </button>
                </div>
              );
            })}

            {/* Settings — fixed, non-swappable */}
            <div style={{ margin: "4px 12px", height: 1, background: "linear-gradient(to right, transparent, var(--border) 20%, var(--border) 80%, transparent)" }} />
            <Link
              href="/settings"
              onClick={closeMore}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors duration-100"
              style={{ animation: "tab-in 0.2s ease-out both", animationDelay: `${ALL_SWAPPABLE.length * 28}ms` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--secondary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <Settings size={17} strokeWidth={1.75} className="shrink-0" style={{ color: "var(--icon)" }} />
              <span className="flex-1 text-sm font-medium text-foreground">Settings</span>
            </Link>
          </div>
        </>
      )}
    </>
  );
}
