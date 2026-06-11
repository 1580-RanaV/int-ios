"use client";

import { useState, useRef } from "react";
import { useNav } from "../_context/nav-context";
import {
  Handshake, Search, ChevronDown, Plus, X, Check,
  DollarSign, TrendingUp,
} from "lucide-react";
import {
  DEALS, FILTER_OPTIONS, STAGE_STYLE, PRIORITY_STYLE, GROUP_ORDER,
  type Filter, type Deal,
} from "./_data";

// ─── Deal card ────────────────────────────────────────────────────────────────

function DealCard({ deal }: { deal: Deal }) {
  const stage    = STAGE_STYLE[deal.stage];
  const priority = PRIORITY_STYLE[deal.priority];

  return (
    <button
      className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left"
      style={{ animation: "tab-in 0.22s ease-out both" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--secondary)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      {/* Owner avatar */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-[11px] font-bold"
        style={{ background: "#1d4ed8" }}
      >
        {deal.ownerInitial}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-foreground leading-snug truncate">{deal.name}</p>
        <p className="text-[12px] mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>{deal.account}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ color: priority.color, background: priority.bg }}
          >
            {deal.priority}
          </span>
          <span className="text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>
            Closes {deal.closingDate}
          </span>
        </div>
      </div>

      {/* Value */}
      <div className="text-right shrink-0">
        <p className="text-[14px] font-bold text-foreground">${deal.value.toLocaleString()}</p>
        <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>{deal.type}</p>
      </div>
    </button>
  );
}

// ─── Select field ─────────────────────────────────────────────────────────────

function SelectField({
  label, required, value, onChange, placeholder, options,
}: {
  label: string; required?: boolean; value: string;
  onChange: (v: string) => void; placeholder: string; options: string[];
}) {
  return (
    <div>
      <p className="text-[13px] font-semibold text-foreground mb-1.5">
        {label}{required && <span style={{ color: "#dc2626" }}> *</span>}
      </p>
      <div className="relative">
        <select
          className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none appearance-none"
          style={{
            background: "var(--page)",
            border: "1px solid var(--border)",
            color: value ? "var(--foreground)" : "var(--muted-foreground)",
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} strokeWidth={1.75} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DealsPage() {
  const { scrolled, setScrolled } = useNav();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom,     setAtBottom]     = useState(false);
  const [query,        setQuery]        = useState("");
  const [filter,       setFilter]       = useState<Filter>("All");
  const [dropOpen,     setDropOpen]     = useState(false);
  const [dropClosing,  setDropClosing]  = useState(false);
  const [createOpen,   setCreateOpen]   = useState(false);
  const [createClosing,setCreateClosing]= useState(false);
  const [cScrolled,    setCScrolled]    = useState(false);
  const [cAtBottom,    setCAtBottom]    = useState(false);

  // create form
  const [cName,     setCName]     = useState("");
  const [cStage,    setCStage]    = useState("");
  const [cValue,    setCValue]    = useState("");
  const [cOwner,    setCOwner]    = useState("");
  const [cType,     setCType]     = useState("");
  const [cPriority, setCPriority] = useState("");
  const [cAccount,  setCAccount]  = useState("");

  const openDrop  = () => { setDropClosing(false); setDropOpen(true); };
  const closeDrop = (next?: Filter) => {
    if (next !== undefined) setFilter(next);
    setDropClosing(true);
    setTimeout(() => { setDropOpen(false); setDropClosing(false); }, 220);
  };

  const openCreate  = () => { setCreateClosing(false); setCreateOpen(true); };
  const closeCreate = () => {
    setCreateClosing(true);
    setTimeout(() => { setCreateOpen(false); setCreateClosing(false); }, 320);
  };

  const filterActive = filter !== "All";

  const filtered = DEALS.filter((d) =>
    (d.name.toLowerCase().includes(query.toLowerCase()) ||
     d.account.toLowerCase().includes(query.toLowerCase())) &&
    (filter === "All" || d.stage === filter)
  );

  const groups = GROUP_ORDER
    .map((g) => ({ label: g, items: filtered.filter((d) => d.stage === g) }))
    .filter((g) => g.items.length > 0);

  const totalValue  = DEALS.reduce((s, d) => s + d.value, 0);
  const openDeals   = DEALS.filter((d) => !["Closed Won", "Closed Lost"].includes(d.stage)).length;
  const closedWon   = DEALS.filter((d) => d.stage === "Closed Won").length;

  return (
    <div
      className="flex flex-col flex-1 min-h-0 bg-page relative"
      style={{ animation: "slide-in-right 0.45s cubic-bezier(0.25,0.46,0.45,0.94)" }}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-5 pt-5 pb-0">
        {/* Title row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <Handshake size={21} strokeWidth={1.75} className="text-foreground shrink-0" />
            <p className="text-xl font-bold text-foreground">Deals</p>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
            onClick={openCreate}
          >
            <Plus size={16} strokeWidth={1.75} className="text-foreground" />
          </button>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <DollarSign size={13} strokeWidth={1.75} style={{ color: "#16a34a" }} />
            <span className="text-[12px] font-semibold" style={{ color: "#16a34a" }}>
              ${totalValue.toLocaleString()} pipeline
            </span>
          </div>
          <div className="w-px h-3.5" style={{ background: "var(--border)" }} />
          <div className="flex items-center gap-1.5">
            <TrendingUp size={13} strokeWidth={1.75} style={{ color: "#3b82f6" }} />
            <span className="text-[12px] font-semibold" style={{ color: "#3b82f6" }}>
              {openDeals} open
            </span>
          </div>
          <div className="w-px h-3.5" style={{ background: "var(--border)" }} />
          <div className="flex items-center gap-1.5">
            <Check size={13} strokeWidth={2} style={{ color: "#16a34a" }} />
            <span className="text-[12px] font-semibold text-muted-foreground">
              {closedWon} won
            </span>
          </div>
        </div>

        {/* Search + filter */}
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
              <span className="text-sm font-semibold truncate">{filter === "All" ? "Stage" : filter}</span>
              <ChevronDown size={12} strokeWidth={1.75} style={{ flexShrink: 0, transition: "transform 0.25s ease", transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>

            {dropOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => closeDrop()} />
                <div
                  className="absolute top-full right-0 mt-2 z-50 rounded-2xl overflow-hidden"
                  style={{
                    width: 160,
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
                          background: sel ? "rgba(59,130,246,0.07)" : "transparent",
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
                        <span className="text-sm font-medium flex-1" style={{ color: sel ? "#1d4ed8" : "var(--foreground)" }}>{value}</span>
                        {sel && <Check size={13} strokeWidth={2} style={{ color: "#1d4ed8" }} />}
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
              <Handshake size={36} strokeWidth={1.25} className="text-muted-foreground opacity-30" />
              <p className="text-[14px] text-muted-foreground">No deals found</p>
            </div>
          ) : groups.map(({ label, items }) => {
            const stageStyle = STAGE_STYLE[label as keyof typeof STAGE_STYLE];
            const groupTotal = items.reduce((s, d) => s + d.value, 0);
            return (
              <div key={label}>
                <div className="flex items-center justify-between px-5 pt-4 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: stageStyle.color }} />
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: stageStyle.color }}>
                      {label}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground">{items.length}</span>
                  </div>
                  <span className="text-[12px] font-semibold" style={{ color: stageStyle.color }}>
                    ${groupTotal.toLocaleString()}
                  </span>
                </div>

                <div
                  className="mx-4 rounded-2xl overflow-hidden"
                  style={{ background: "var(--raised)", border: "1px solid var(--border)" }}
                >
                  {items.map((deal, i) => (
                    <div key={deal.id}>
                      {i > 0 && <div className="mx-4" style={{ height: 1, background: "var(--border)" }} />}
                      <DealCard deal={deal} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="h-6" />
        </div>

        <div className="absolute top-0 left-0 right-0 h-8 pointer-events-none z-10 transition-opacity duration-300"
          style={{ opacity: scrolled ? 1 : 0, background: "linear-gradient(to bottom, var(--page) 0%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 transition-opacity duration-300"
          style={{ height: 80, opacity: scrolled ? 0 : atBottom ? 0 : 1, background: "linear-gradient(to top, var(--page) 10%, transparent 100%)" }} />
      </div>

      {/* ── Create Deal sheet ─────────────────────────────────────────────── */}
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
            <div className="flex items-center justify-between px-5 pt-2 pb-3">
              <button onClick={closeCreate}>
                <X size={18} strokeWidth={1.75} className="text-muted-foreground" />
              </button>
              <p className="text-[15px] font-bold text-foreground">Create Deal</p>
              <div className="w-5" />
            </div>

            {/* Scrollable body */}
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

                  {/* Deal name */}
                  <div>
                    <p className="text-[13px] font-semibold text-foreground mb-1.5">Deal name <span style={{ color: "#dc2626" }}>*</span></p>
                    <input
                      className="w-full px-3.5 py-2.5 rounded-xl text-[14px] text-foreground outline-none"
                      style={{ background: "var(--page)", border: "1px solid var(--border)" }}
                      placeholder="Enter deal name"
                      value={cName}
                      onChange={(e) => setCName(e.target.value)}
                    />
                  </div>

                  {/* Deal stage */}
                  <SelectField label="Deal stage" required value={cStage} onChange={setCStage} placeholder="Select stage"
                    options={["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]} />

                  {/* Value */}
                  <div>
                    <p className="text-[13px] font-semibold text-foreground mb-1.5">Value <span style={{ color: "#dc2626" }}>*</span></p>
                    <div className="flex items-center gap-0 rounded-xl overflow-hidden" style={{ background: "var(--page)", border: "1px solid var(--border)" }}>
                      <span className="px-3 text-[14px] font-semibold" style={{ color: "var(--muted-foreground)" }}>$</span>
                      <input
                        type="number"
                        className="flex-1 py-2.5 pr-3.5 bg-transparent text-[14px] text-foreground outline-none"
                        placeholder="0.00"
                        value={cValue}
                        onChange={(e) => setCValue(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Deal owner */}
                  <SelectField label="Deal owner" required value={cOwner} onChange={setCOwner} placeholder="Select owner"
                    options={["Rana V", "Aman Patel", "Sid Chaudhary", "Ved Gorakh Raut"]} />

                  {/* Deal type */}
                  <SelectField label="Deal type" required value={cType} onChange={setCType} placeholder="Select type"
                    options={["New Business", "Renewal", "Upsell", "Cross-sell"]} />

                  {/* Priority */}
                  <SelectField label="Priority" required value={cPriority} onChange={setCPriority} placeholder="Select priority"
                    options={["High", "Medium", "Low"]} />

                  {/* Associate with account */}
                  <SelectField label="Associate with account" required value={cAccount} onChange={setCAccount} placeholder="Select account"
                    options={["StockInvest.us", "TechFlow", "Acme Corp", "BuildCo", "StartupHub", "fieldsusa", "Apex Studio"]} />

                </div>
              </div>

              {/* Top fade */}
              <div className="absolute top-0 left-0 right-0 pointer-events-none transition-opacity duration-300"
                style={{ height: 40, opacity: cScrolled ? 1 : 0, background: "linear-gradient(to bottom, var(--raised) 0%, transparent 100%)" }} />
              {/* Bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 pointer-events-none transition-opacity duration-300"
                style={{ height: 56, opacity: cScrolled ? 0 : cAtBottom ? 0 : 1, background: "linear-gradient(to top, var(--raised) 20%, transparent 100%)" }} />
            </div>

            {/* Create button */}
            <div className="px-5 pt-2 pb-8">
              <button
                className="w-full py-3.5 rounded-2xl text-[14px] font-semibold text-white"
                style={{ background: "#1d4ed8" }}
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
