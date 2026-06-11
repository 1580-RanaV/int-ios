export type Status = "Active" | "Stopped" | "Ready For Review" | "Draft" | "Completed";
export type ExperienceType = "Experiment" | "Personalization";

export const STATUS_COLOR: Record<Status, string> = {
  Active:             "#15803d",
  Stopped:            "#be123c",
  "Ready For Review": "#1d4ed8",
  Draft:              "#4b5563",
  Completed:          "#15803d",
};

export const STATUS_BG: Record<Status, string> = {
  Active:             "rgba(16,185,129,0.1)",
  Stopped:            "rgba(244,63,94,0.1)",
  "Ready For Review": "rgba(59,130,246,0.1)",
  Draft:              "rgba(138,143,152,0.1)",
  Completed:          "rgba(16,185,129,0.1)",
};

export type Variant = {
  key: string;
  label: string;
  name: string;
  color: string;
  traffic: number;
};

export type Experience = {
  name: string;
  type: ExperienceType;
  status: Status;
  progress?: number;
  ci?: number;
  cuped?: boolean;
  sequential?: boolean;
  bh?: boolean;
  hypothesis?: string;
  variants?: Variant[];
};

export const EXPERIENCES: Experience[] = [
  {
    name: "TEZZT",
    type: "Experiment",
    status: "Stopped",
    progress: 0,
    ci: 95,
    cuped: false,
    sequential: false,
    bh: false,
    variants: [
      { key: "A", label: "A", name: "Control",   color: "#1d4ed8", traffic: 50 },
      { key: "B", label: "B", name: "Variant 1", color: "#d97706", traffic: 50 },
    ],
  },
  {
    name: "Untitled-1",
    type: "Experiment",
    status: "Ready For Review",
    ci: 95,
    cuped: false,
    sequential: false,
    bh: false,
    variants: [
      { key: "A", label: "A", name: "Variant 2", color: "#1d4ed8", traffic: 31 },
      { key: "B", label: "B", name: "Variant 1", color: "#d97706", traffic: 31 },
    ],
  },
  {
    name: "intempt.com",
    type: "Experiment",
    status: "Ready For Review",
    ci: 95,
    cuped: false,
    sequential: false,
    bh: false,
    variants: [
      { key: "A", label: "A", name: "Control",   color: "#1d4ed8", traffic: 50 },
      { key: "B", label: "B", name: "Variant 1", color: "#d97706", traffic: 50 },
    ],
  },
  { name: "Untitled-2",       type: "Experiment",      status: "Draft",      ci: 95, cuped: false, sequential: false, bh: false },
  { name: "Untitled-3",       type: "Experiment",      status: "Draft",      ci: 95, cuped: false, sequential: false, bh: false },
  { name: "Untitled-4",       type: "Personalization",  status: "Draft",      ci: 95, cuped: false, sequential: false, bh: false },
  { name: "Untitled-5",       type: "Experiment",      status: "Draft",      ci: 95, cuped: false, sequential: false, bh: false },
  { name: "Untitled-6",       type: "Personalization",  status: "Draft",      ci: 95, cuped: false, sequential: false, bh: false },
  { name: "Untitled-7",       type: "Experiment",      status: "Draft",      ci: 95, cuped: false, sequential: false, bh: false },
  {
    name: "Homepage Hero",
    type: "Experiment",
    status: "Active",
    progress: 62,
    ci: 95,
    cuped: true,
    sequential: false,
    bh: false,
    variants: [
      { key: "A", label: "A", name: "Control",    color: "#1d4ed8", traffic: 50 },
      { key: "B", label: "B", name: "Hero V2",    color: "#d97706", traffic: 50 },
    ],
  },
  {
    name: "Pricing Page A/B",
    type: "Experiment",
    status: "Active",
    progress: 38,
    ci: 95,
    cuped: false,
    sequential: false,
    bh: false,
    variants: [
      { key: "A", label: "A", name: "Control",   color: "#1d4ed8", traffic: 50 },
      { key: "B", label: "B", name: "New Pricing", color: "#d97706", traffic: 50 },
    ],
  },
  {
    name: "Onboard Flow V2",
    type: "Personalization",
    status: "Completed",
    progress: 100,
    ci: 95,
    cuped: false,
    sequential: false,
    bh: false,
  },
];

export const GROUP_ORDER: Status[] = ["Active", "Ready For Review", "Stopped", "Completed", "Draft"];
export const FILTERS = ["All", "Active", "Stopped", "Completed"] as const;
export type Filter = typeof FILTERS[number];
