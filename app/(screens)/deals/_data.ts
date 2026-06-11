export type DealStage    = "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";
export type DealPriority = "High" | "Medium" | "Low";
export type DealType     = "New Business" | "Renewal" | "Upsell" | "Cross-sell";

export type Deal = {
  id: string;
  name: string;
  account: string;
  value: number;
  stage: DealStage;
  priority: DealPriority;
  type: DealType;
  owner: string;
  ownerInitial: string;
  closingDate: string;
};

export const STAGE_STYLE: Record<DealStage, { color: string; bg: string }> = {
  "Lead":        { color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
  "Qualified":   { color: "#3b82f6", bg: "rgba(59,130,246,0.1)"  },
  "Proposal":    { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)"  },
  "Negotiation": { color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  "Closed Won":  { color: "#16a34a", bg: "rgba(22,163,74,0.1)"   },
  "Closed Lost": { color: "#dc2626", bg: "rgba(220,38,38,0.1)"   },
};

export const PRIORITY_STYLE: Record<DealPriority, { color: string; bg: string }> = {
  High:   { color: "#dc2626", bg: "rgba(220,38,38,0.1)"  },
  Medium: { color: "#d97706", bg: "rgba(217,119,6,0.1)"  },
  Low:    { color: "#16a34a", bg: "rgba(22,163,74,0.1)"  },
};

export type Filter = "All" | DealStage;

export const FILTER_OPTIONS: { value: Filter; color?: string }[] = [
  { value: "All" },
  { value: "Lead",        color: "#6b7280" },
  { value: "Qualified",   color: "#3b82f6" },
  { value: "Proposal",    color: "#8b5cf6" },
  { value: "Negotiation", color: "#f59e0b" },
  { value: "Closed Won",  color: "#16a34a" },
  { value: "Closed Lost", color: "#dc2626" },
];

export const DEALS: Deal[] = [
  { id: "d1", name: "StockInvest Q3 Renewal",   account: "StockInvest.us",  value: 12000, stage: "Negotiation", priority: "High",   type: "Renewal",      owner: "Rana V",          ownerInitial: "R",  closingDate: "Jun 30" },
  { id: "d2", name: "TechFlow Platform Upgrade", account: "TechFlow",        value: 8500,  stage: "Proposal",    priority: "Medium", type: "Upsell",       owner: "Aman Patel",      ownerInitial: "AP", closingDate: "Jul 15" },
  { id: "d3", name: "Acme Expansion",            account: "Acme Corp",       value: 22000, stage: "Qualified",   priority: "High",   type: "New Business", owner: "Sid Chaudhary",   ownerInitial: "SC", closingDate: "Jul 31" },
  { id: "d4", name: "BuildCo Annual Contract",   account: "BuildCo",         value: 6000,  stage: "Closed Won",  priority: "Low",    type: "Renewal",      owner: "Rana V",          ownerInitial: "R",  closingDate: "Jun 10" },
  { id: "d5", name: "StartupHub Onboarding",     account: "StartupHub",      value: 3200,  stage: "Lead",        priority: "Low",    type: "New Business", owner: "Ved Gorakh Raut", ownerInitial: "VG", closingDate: "Aug 5"  },
  { id: "d6", name: "FieldsUSA Enterprise",      account: "fieldsusa",       value: 45000, stage: "Proposal",    priority: "High",   type: "New Business", owner: "Aman Patel",      ownerInitial: "AP", closingDate: "Aug 20" },
  { id: "d7", name: "Apex Studio Renewal",       account: "Apex Studio",     value: 2800,  stage: "Closed Lost", priority: "Low",    type: "Renewal",      owner: "Sid Chaudhary",   ownerInitial: "SC", closingDate: "Jun 5"  },
];

export const GROUP_ORDER: DealStage[] = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
