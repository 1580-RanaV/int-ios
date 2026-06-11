export type TaskStatus   = "Open" | "Completed" | "Skipped";
export type TaskPriority = "High" | "Medium" | "Low";
export type TaskType     = "Email" | "Call" | "Meeting" | "LinkedIn" | "SMS" | "Task";

export type Task = {
  id: string;
  title: string;
  contact: string;
  company: string;
  timeAgo: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  group: "Overdue" | "Today" | "Upcoming" | "Completed";
};

export const PRIORITY_COLOR: Record<TaskPriority, { color: string; bg: string }> = {
  High:   { color: "#dc2626", bg: "rgba(220,38,38,0.1)"   },
  Medium: { color: "#d97706", bg: "rgba(217,119,6,0.1)"   },
  Low:    { color: "#16a34a", bg: "rgba(22,163,74,0.1)"   },
};

export type Filter = "All" | TaskStatus;

export const FILTER_OPTIONS: { value: Filter; color?: string }[] = [
  { value: "All" },
  { value: "Open",      color: "#3b82f6" },
  { value: "Completed", color: "#16a34a" },
  { value: "Skipped",   color: "#6b7280" },
];

export const TASKS: Task[] = [
  {
    id: "t1",
    title: "Newww",
    contact: "Koray Akbakir",
    company: "Koray",
    timeAgo: "1 day ago",
    status: "Open",
    priority: "High",
    type: "Email",
    group: "Overdue",
  },
  {
    id: "t2",
    title: "Follow up on proposal",
    contact: "Sarah Chen",
    company: "Acme Corp",
    timeAgo: "3 hours ago",
    status: "Open",
    priority: "Medium",
    type: "Call",
    group: "Today",
  },
  {
    id: "t3",
    title: "Schedule product demo",
    contact: "James Patel",
    company: "TechFlow",
    timeAgo: "in 2 days",
    status: "Open",
    priority: "Low",
    type: "Meeting",
    group: "Upcoming",
  },
  {
    id: "t4",
    title: "Send contract documents",
    contact: "Emma Wilson",
    company: "BuildCo",
    timeAgo: "Yesterday",
    status: "Completed",
    priority: "High",
    type: "Email",
    group: "Completed",
  },
  {
    id: "t5",
    title: "LinkedIn connection request",
    contact: "Alex Torres",
    company: "StartupHub",
    timeAgo: "2 days ago",
    status: "Skipped",
    priority: "Low",
    type: "LinkedIn",
    group: "Completed",
  },
];

export const GROUP_ORDER: Task["group"][] = ["Overdue", "Today", "Upcoming", "Completed"];
