// ─── Types ───────────────────────────────────────────────────────────────────

export type IntentLevel = "Low Intent" | "Medium Intent" | "High Intent";

export type Task = {
  title: string;
  due: string;
  done: boolean;
};

export type UserEmail = {
  subject: string;
  date: string;
  opened: boolean;
  preview: string;
};

export type PageView = {
  url: string;
  views: number;
};

export type ActivityEventType = "email" | "page_view" | "journey" | "login" | "event" | "form";

export type ActivityItem = {
  type: ActivityEventType;
  title: string;
  timestamp: string;
  dateKey: string; // YYYY-MM-DD
};

export type User = {
  name: string;
  color: string;
  seen: string;
  intent: IntentLevel;
  location: string;
  timezone: string;
  email: string;
  totalEvents: number;
  firstSeen: string;
  lastSeen: string;
  activityData: number[];
  topPages: PageView[];
  keySignals: string[];
  tasks: Task[];
  emails: UserEmail[];
  bluSummary: string;
  activity: ActivityItem[];
};

// ─── Constants ───────────────────────────────────────────────────────────────

export const INTENT_COLOR: Record<IntentLevel, string> = {
  "Low Intent":    "#8a8f98",
  "Medium Intent": "#d29922",
  "High Intent":   "#15803d",
};

export const INTENT_BG: Record<IntentLevel, string> = {
  "Low Intent":    "var(--secondary)",
  "Medium Intent": "rgba(245,158,11,0.10)",
  "High Intent":   "rgba(16,185,129,0.10)",
};

// ─── Data ────────────────────────────────────────────────────────────────────

const empty31 = Array(31).fill(0) as number[];

export const USERS: User[] = [
  {
    name: "Dappled Snipe",
    color: "#c97d2a",
    seen: "just now",
    intent: "High Intent",
    location: "San Francisco, CA",
    timezone: "UTC-8 (PST)",
    email: "dappled.snipe@example.com",
    totalEvents: 42,
    firstSeen: "May 15, 2026",
    lastSeen: "Jun 11, 2026",
    activityData: [2,1,3,2,4,6,5,3,2,5,9,7,5,6,8,11,9,6,5,7,10,13,10,7,8,12,15,19,24,31,26],
    topPages: [
      { url: "/dashboard", views: 18 },
      { url: "/pricing",   views: 12 },
      { url: "/features/analytics", views: 7 },
      { url: "/settings",  views: 5 },
    ],
    keySignals: [
      "Visited pricing page 3 times this week",
      "Clicked upgrade CTA on Jun 10",
      "Spent 12 min on analytics feature page",
    ],
    tasks: [
      { title: "Follow up on pricing inquiry", due: "Jun 12, 2026", done: false },
      { title: "Schedule demo call",           due: "Jun 14, 2026", done: false },
      { title: "Send onboarding guide",        due: "Jun 10, 2026", done: true  },
    ],
    emails: [
      { subject: "Welcome to Intempt!",         date: "May 15, 2026", opened: true,  preview: "Get started with your free trial and explore all features available to you..." },
      { subject: "Your first week recap",       date: "May 22, 2026", opened: true,  preview: "Here's a summary of what happened in your workspace this week..." },
      { subject: "Upgrade to Pro — save 20%",  date: "Jun 1, 2026",  opened: false, preview: "Unlock unlimited journeys, advanced analytics, and priority support..." },
    ],
    bluSummary: "Dappled Snipe is a highly engaged user showing strong purchase intent. They visited the pricing page multiple times and interacted with upgrade CTAs — likely in the evaluation phase and ready for a direct sales touchpoint.",
    activity: [
      { type: "email",     title: "Email thread summary",           timestamp: "Jun 11, 1:10 PM",  dateKey: "2026-06-11" },
      { type: "page_view", title: "Viewed /pricing",                timestamp: "Jun 11, 10:42 AM", dateKey: "2026-06-11" },
      { type: "page_view", title: "Viewed /features/analytics",     timestamp: "Jun 11, 10:38 AM", dateKey: "2026-06-11" },
      { type: "login",     title: "Signed in",                      timestamp: "Jun 11, 10:35 AM", dateKey: "2026-06-11" },
      { type: "journey",   title: "Entered Stock Page Abandon flow", timestamp: "Jun 10, 3:22 PM",  dateKey: "2026-06-10" },
      { type: "email",     title: "Opened: Upgrade to Pro",         timestamp: "Jun 10, 11:05 AM", dateKey: "2026-06-10" },
      { type: "page_view", title: "Viewed /pricing",                timestamp: "Jun 10, 11:02 AM", dateKey: "2026-06-10" },
      { type: "login",     title: "Signed in",                      timestamp: "Jun 10, 11:00 AM", dateKey: "2026-06-10" },
      { type: "page_view", title: "Viewed /dashboard",              timestamp: "Jun 9, 4:15 PM",   dateKey: "2026-06-09" },
      { type: "event",     title: "Button click: Upgrade CTA",      timestamp: "Jun 9, 4:14 PM",   dateKey: "2026-06-09" },
      { type: "page_view", title: "Viewed /pricing",                timestamp: "Jun 9, 4:10 PM",   dateKey: "2026-06-09" },
      { type: "form",      title: "Submitted contact form",         timestamp: "Jun 5, 2:30 PM",   dateKey: "2026-06-05" },
      { type: "email",     title: "Opened: Your first week recap",  timestamp: "May 22, 9:00 AM",  dateKey: "2026-05-22" },
      { type: "login",     title: "Signed in",                      timestamp: "May 15, 8:45 AM",  dateKey: "2026-05-15" },
    ] as ActivityItem[],
  },
  {
    name: "Cherished Junglefowl",
    color: "#27ae60",
    seen: "49 seconds ago",
    intent: "Medium Intent",
    location: "London, UK",
    timezone: "UTC+1 (BST)",
    email: "c.junglefowl@example.com",
    totalEvents: 19,
    firstSeen: "May 28, 2026",
    lastSeen: "Jun 11, 2026",
    activityData: [0,0,0,2,1,3,2,1,0,2,3,2,1,0,2,4,3,2,3,4,5,4,2,3,4,6,5,3,4,6,5],
    topPages: [
      { url: "/home",  views: 8 },
      { url: "/users", views: 5 },
      { url: "/journeys", views: 3 },
    ],
    keySignals: [
      "Logged in 6 days consecutively",
      "Added 3 team members this week",
    ],
    tasks: [],
    emails: [
      { subject: "Welcome to Intempt!", date: "May 28, 2026", opened: true, preview: "Get started with your free trial and explore all features available to you..." },
    ],
    bluSummary: "Cherished Junglefowl is an active user with consistent engagement patterns. Regular logins and team collaboration activity suggest healthy product adoption. Consider nurturing toward an expansion or upgrade conversation.",
    activity: [
      { type: "login",     title: "Signed in",               timestamp: "Jun 11, 9:20 AM",  dateKey: "2026-06-11" },
      { type: "page_view", title: "Viewed /home",             timestamp: "Jun 11, 9:22 AM",  dateKey: "2026-06-11" },
      { type: "login",     title: "Signed in",               timestamp: "Jun 10, 10:05 AM", dateKey: "2026-06-10" },
      { type: "page_view", title: "Viewed /users",            timestamp: "Jun 10, 10:08 AM", dateKey: "2026-06-10" },
      { type: "email",     title: "Opened: Welcome to Intempt!", timestamp: "May 28, 8:30 AM", dateKey: "2026-05-28" },
    ] as ActivityItem[],
  },
  {
    name: "Ecstatic Newt",
    color: "#16a085",
    seen: "2 minutes ago",
    intent: "High Intent",
    location: "Berlin, Germany",
    timezone: "UTC+2 (CEST)",
    email: "ecstatic.newt@example.com",
    totalEvents: 67,
    firstSeen: "Apr 3, 2026",
    lastSeen: "Jun 11, 2026",
    activityData: [5,8,6,4,7,10,12,9,7,8,11,14,12,9,10,13,16,14,11,12,15,18,15,12,14,17,20,18,15,22,19],
    topPages: [
      { url: "/journeys",  views: 28 },
      { url: "/analytics", views: 17 },
      { url: "/accounts",  views: 14 },
      { url: "/settings",  views: 6 },
    ],
    keySignals: [
      "Created 5 journeys in the last 30 days",
      "Power user — above 95th percentile for engagement",
      "Integrated Slack channel last week",
    ],
    tasks: [
      { title: "Review Q2 journey performance",    due: "Jun 15, 2026", done: false },
      { title: "Connect CRM integration",         due: "Jun 20, 2026", done: false },
    ],
    emails: [
      { subject: "Welcome to Intempt!",           date: "Apr 3, 2026",  opened: true,  preview: "Get started with your free trial and explore all features..." },
      { subject: "Pro tips for Journey Builder",  date: "Apr 10, 2026", opened: true,  preview: "Get the most out of multi-channel journeys with these best practices..." },
      { subject: "Your April recap",              date: "May 1, 2026",  opened: true,  preview: "Here's a summary of your workspace activity in April..." },
      { subject: "New feature: A/B testing",      date: "May 14, 2026", opened: true,  preview: "You can now run A/B tests natively inside Journey Builder..." },
      { subject: "Upgrade to Enterprise",         date: "Jun 5, 2026",  opened: false, preview: "Unlock unlimited seats, SSO, custom SLAs, and dedicated support..." },
    ],
    bluSummary: "Ecstatic Newt is a power user and strong expansion candidate. Extremely high engagement across journeys and analytics, with multi-channel integrations in place. Ideal profile for an enterprise upsell conversation.",
    activity: [
      { type: "journey",   title: "Completed onboarding journey",   timestamp: "Jun 11, 11:30 AM", dateKey: "2026-06-11" },
      { type: "page_view", title: "Viewed /analytics",              timestamp: "Jun 11, 11:15 AM", dateKey: "2026-06-11" },
      { type: "login",     title: "Signed in",                      timestamp: "Jun 11, 11:10 AM", dateKey: "2026-06-11" },
      { type: "event",     title: "Journey published",              timestamp: "Jun 10, 5:45 PM",  dateKey: "2026-06-10" },
      { type: "event",     title: "Slack integration connected",    timestamp: "Jun 9, 2:00 PM",   dateKey: "2026-06-09" },
      { type: "page_view", title: "Viewed /journeys",               timestamp: "Jun 9, 1:55 PM",   dateKey: "2026-06-09" },
      { type: "email",     title: "Opened: New feature: A/B testing", timestamp: "May 14, 9:30 AM", dateKey: "2026-05-14" },
    ] as ActivityItem[],
  },
  {
    name: "Purple Marlin",
    color: "#8bc34a",
    seen: "3 minutes ago",
    intent: "Medium Intent",
    location: "Toronto, Canada",
    timezone: "UTC-4 (EDT)",
    email: "purple.marlin@example.com",
    totalEvents: 11,
    firstSeen: "Jun 2, 2026",
    lastSeen: "Jun 11, 2026",
    activityData: [...empty31.slice(0, 20), 2, 1, 3, 2, 4, 3, 2, 4, 5, 4, 3],
    topPages: [
      { url: "/home",     views: 6 },
      { url: "/journeys", views: 3 },
    ],
    keySignals: [
      "Viewed onboarding checklist twice",
    ],
    tasks: [],
    emails: [
      { subject: "Welcome to Intempt!", date: "Jun 2, 2026", opened: true, preview: "Get started with your free trial and explore all features available to you..." },
    ],
    bluSummary: "Purple Marlin is a newer user still in the onboarding phase. Activity is growing week-over-week. Focus on engagement and feature discovery to drive activation toward core features.",
    activity: [
      { type: "login",     title: "Signed in",              timestamp: "Jun 11, 8:50 AM",  dateKey: "2026-06-11" },
      { type: "page_view", title: "Viewed /home",            timestamp: "Jun 11, 8:52 AM",  dateKey: "2026-06-11" },
      { type: "page_view", title: "Viewed /journeys",        timestamp: "Jun 10, 3:10 PM",  dateKey: "2026-06-10" },
      { type: "email",     title: "Opened: Welcome to Intempt!", timestamp: "Jun 2, 9:05 AM", dateKey: "2026-06-02" },
    ] as ActivityItem[],
  },
  {
    name: "Striking Porcupine",
    color: "#9e8d2e",
    seen: "5 minutes ago",
    intent: "Low Intent",
    location: "Unknown Location",
    timezone: "Unknown timezone",
    email: "striking.porcupine@example.com",
    totalEvents: 4,
    firstSeen: "Jun 10, 2026",
    lastSeen: "Jun 11, 2026",
    activityData: [...empty31.slice(0, 29), 3, 1],
    topPages: [],
    keySignals: [],
    tasks: [],
    emails: [],
    bluSummary: "User details are limited. Striking Porcupine joined recently with minimal activity recorded. No further engagement signals are available yet.",
    activity: [
      { type: "login", title: "Signed in", timestamp: "Jun 11, 7:40 AM", dateKey: "2026-06-11" },
    ] as ActivityItem[],
  },
  ...([
    { name: "Truthful Lynx",       color: "#8e44ad", seen: "5 minutes ago",  intent: "Low Intent"    as IntentLevel },
    { name: "Wonderful Swallow",   color: "#7b1fa2", seen: "7 minutes ago",  intent: "Medium Intent" as IntentLevel },
    { name: "Diligent Wombat",     color: "#2ecc71", seen: "8 minutes ago",  intent: "Low Intent"    as IntentLevel },
    { name: "Radiant Falcon",      color: "#e67e22", seen: "12 minutes ago", intent: "High Intent"   as IntentLevel },
    { name: "Swift Mongoose",      color: "#3498db", seen: "15 minutes ago", intent: "Medium Intent" as IntentLevel },
    { name: "Brave Salamander",    color: "#e74c3c", seen: "18 minutes ago", intent: "Low Intent"    as IntentLevel },
    { name: "Curious Pangolin",    color: "#1abc9c", seen: "22 minutes ago", intent: "Medium Intent" as IntentLevel },
    { name: "Nimble Chameleon",    color: "#f39c12", seen: "31 minutes ago", intent: "Low Intent"    as IntentLevel },
    { name: "Bold Capybara",       color: "#2980b9", seen: "45 minutes ago", intent: "Low Intent"    as IntentLevel },
    { name: "Vivid Marmot",        color: "#c0392b", seen: "1 hour ago",     intent: "Medium Intent" as IntentLevel },
    { name: "Gentle Tapir",        color: "#27ae60", seen: "2 hours ago",    intent: "Low Intent"    as IntentLevel },
    { name: "Fierce Kestrel",      color: "#d35400", seen: "3 hours ago",    intent: "Low Intent"    as IntentLevel },
    { name: "Loyal Wolverine",     color: "#6c3483", seen: "5 hours ago",    intent: "Low Intent"    as IntentLevel },
    { name: "Serene Axolotl",      color: "#148f77", seen: "8 hours ago",    intent: "Medium Intent" as IntentLevel },
    { name: "Majestic Ibis",       color: "#a04000", seen: "1 day ago",      intent: "Low Intent"    as IntentLevel },
  ] as Pick<User, "name" | "color" | "seen" | "intent">[]).map((u) => ({
    ...u,
    location: "Unknown Location",
    timezone: "Unknown timezone",
    email: `${u.name.toLowerCase().replace(" ", ".")}@example.com`,
    totalEvents: 0,
    firstSeen: "—",
    lastSeen: "—",
    activityData: empty31,
    topPages: [] as PageView[],
    keySignals: [] as string[],
    tasks: [] as Task[],
    emails: [] as UserEmail[],
    bluSummary: "User details are unavailable, and engagement metrics could not be retrieved. No further information is provided regarding this user.",
    activity: [] as ActivityItem[],
  })),
];
