export type MeetingStatus = "Completed" | "Canceled" | "Denied entry";

export const STATUS_STYLE: Record<MeetingStatus, { background: string; color: string }> = {
  Completed:      { background: "rgba(16,185,129,0.1)",  color: "#15803d" },
  Canceled:       { background: "rgba(244,63,94,0.1)",   color: "#be123c" },
  "Denied entry": { background: "rgba(234,179,8,0.1)",   color: "#92400e" },
};

export type Participant = {
  initials: string;
  name?: string;
  email?: string;
};

export type ActionItem = {
  text: string;
  assignee?: string;
  done?: boolean;
};

export type TranscriptLine = {
  time: string;
  speaker: string;
  initials: string;
  text: string;
};

export type MeetingDetail = {
  slug: string;
  name: string;
  date: string;
  time: string;
  totalTime: string;
  host: string;
  initial: string;
  status: MeetingStatus;
  purpose?: string;
  keyTakeaways?: string[];
  topics?: string[];
  actionItems?: ActionItem[];
  participants: Participant[];
  transcript?: TranscriptLine[];
};

export const MEETING_DETAILS: MeetingDetail[] = [
  {
    slug: "product-sync",
    name: "Product Sync",
    date: "Jun 10",
    time: "7:00 PM",
    totalTime: "48:00",
    host: "Beso Gugushvili",
    initial: "B",
    status: "Completed",
    purpose: "Daily standup covering active bugs, testing process, CSS uplift progress, model versioning, and next product cycle priorities.",
    keyTakeaways: [
      "CSS uplift is 80% complete, targeting end of week.",
      "Model versioning requires sign-off from engineering lead.",
      "Three critical bugs flagged for hotfix before release.",
      "Next sprint planning session scheduled for Thursday.",
    ],
    topics: [
      "Active bug triage and hotfix priorities",
      "CSS uplift progress and blockers",
      "Model versioning strategy",
      "Next product cycle planning",
      "Testing process improvements",
    ],
    actionItems: [
      { text: "Fix critical login bug before Thursday", assignee: "Aman Patel", done: false },
      { text: "Complete CSS uplift PR review", assignee: "Sid Chaudhary", done: true },
      { text: "Finalize model versioning doc", assignee: "Ved Gorakh Raut", done: false },
      { text: "Send sprint planning invite", assignee: "Rana", done: true },
    ],
    participants: [
      { initials: "V",  email: "ved@intempt.com" },
      { initials: "R",  name: "Rana",          email: "rana@intempt.com" },
      { initials: "VG", name: "Ved Gorakh Raut" },
      { initials: "AP", name: "Aman Patel",     email: "aman.singh@intempt.com" },
      { initials: "SC", name: "Sid Chaudhary",  email: "sid@intempt.com" },
      { initials: "AT", name: "Aman Tiwari",    email: "aman@intempt.com" },
    ],
    transcript: [
      { time: "0:00",  speaker: "Rana",          initials: "R",  text: "Good morning everyone, let's get started with the daily standup." },
      { time: "0:42",  speaker: "Aman Patel",     initials: "AP", text: "I'm currently working on the critical login bug. Should have a fix by tomorrow." },
      { time: "2:10",  speaker: "Sid Chaudhary",  initials: "SC", text: "CSS uplift is progressing well, about 80% done. One blocker on the modal styles." },
      { time: "4:35",  speaker: "Ved Gorakh Raut",initials: "VG", text: "Model versioning strategy document is in review, waiting for engineering sign-off." },
      { time: "7:18",  speaker: "Aman Tiwari",    initials: "AT", text: "Testing process changes are implemented. Running full regression now." },
      { time: "10:02", speaker: "Rana",           initials: "R",  text: "Good updates. Let's prioritize the hotfixes and aim to clear them before Thursday." },
      { time: "15:44", speaker: "Aman Patel",     initials: "AP", text: "Agreed. I'll loop in Sid for the CSS-related bugs since they're intertwined." },
      { time: "20:30", speaker: "Ved Gorakh Raut",initials: "VG", text: "I'll have the versioning doc finalized by EOD tomorrow." },
      { time: "35:12", speaker: "Rana",           initials: "R",  text: "Sprint planning will be Thursday. I'll send out the calendar invite." },
      { time: "47:15", speaker: "Rana",           initials: "R",  text: "Alright, that's everything. Thanks everyone, talk tomorrow." },
    ],
  },
  {
    slug: "rd-check-in",
    name: "R&D check-in",
    date: "Jun 10",
    time: "8:00 PM",
    totalTime: "32:00",
    host: "Beso Gugushvili",
    initial: "B",
    status: "Completed",
    purpose: "Research and development sync to review ongoing experiments and roadmap alignment.",
    keyTakeaways: ["Experiment A/B results are promising.", "New feature pipeline needs bandwidth review."],
    topics: ["Experiment results", "Roadmap Q3 alignment"],
    actionItems: [{ text: "Share experiment results with stakeholders", assignee: "Beso", done: false }],
    participants: [
      { initials: "R",  name: "Rana",          email: "rana@intempt.com" },
      { initials: "AP", name: "Aman Patel",     email: "aman.singh@intempt.com" },
    ],
    transcript: [],
  },
];

export const COMING_UP = [
  { month: "JUN", day: 10, name: "Product Sync",  time: "7:00 PM",  countdown: "in 4 hours", slug: "product-sync" },
  { month: "JUN", day: 10, name: "R&D check-in",  time: "8:00 PM",  countdown: "in 5 hours", slug: "rd-check-in"  },
  { month: "JUN", day: 13, name: "Test Meeting",   time: "12:15 PM", countdown: "in 3 days",  slug: "test-meeting" },
];

export const PAST_MEETINGS: {
  dateLabel: string;
  items: {
    initial: string; name: string; host: string;
    date: string; time: string; duration: string;
    attendees: number; status?: MeetingStatus; slug: string;
  }[];
}[] = [
  {
    dateLabel: "Jun 12",
    items: [
      { initial: "B", name: "Apex studio follow up", host: "Beso Gugushvili", date: "Jun 12", time: "4:00 PM",  duration: "30 min", attendees: 2, status: "Canceled",     slug: "apex-studio" },
    ],
  },
  {
    dateLabel: "Jun 10",
    items: [
      { initial: "B", name: "Test Meeting",  host: "Beso Gugushvili", date: "Jun 10", time: "12:00 PM", duration: "15 min", attendees: 3, status: "Completed",    slug: "test-meeting"  },
      { initial: "B", name: "Product Sync",  host: "Beso Gugushvili", date: "Jun 10", time: "10:00 AM", duration: "45 min", attendees: 5, status: "Completed",    slug: "product-sync"  },
      { initial: "A", name: "Design Review", host: "Alina Marsh",     date: "Jun 10", time: "9:00 AM",  duration: "30 min", attendees: 4, status: "Denied entry", slug: "design-review" },
    ],
  },
  {
    dateLabel: "Jun 7",
    items: [
      { initial: "R", name: "Weekly Standup",  host: "Rana V",          date: "Jun 7", time: "9:30 AM",  duration: "20 min", attendees: 6, status: "Completed", slug: "weekly-standup"  },
      { initial: "B", name: "Onboarding Call", host: "Beso Gugushvili", date: "Jun 7", time: "2:00 PM",  duration: "60 min", attendees: 2, status: "Completed", slug: "onboarding-call" },
    ],
  },
  {
    dateLabel: "Jun 5",
    items: [
      { initial: "A", name: "Investor Update", host: "Alina Marsh", date: "Jun 5", time: "3:00 PM",  duration: "45 min", attendees: 8, status: "Canceled",     slug: "investor-update" },
      { initial: "R", name: "Q2 Planning",     host: "Rana V",      date: "Jun 5", time: "11:00 AM", duration: "90 min", attendees: 7, status: "Denied entry", slug: "q2-planning"    },
    ],
  },
];

export type BookingType = { name: string; duration: string; platform: string };

export const BOOKING_TYPES: BookingType[] = [
  { name: "Test Meeting",   duration: "15 m", platform: "Google Meet" },
  { name: "Onboarding",     duration: "60 m", platform: "Google Meet" },
  { name: "Product Demo",   duration: "30 m", platform: "Google Meet" },
  { name: "Product Query",  duration: "30 m", platform: "Google Meet" },
  { name: "Discovery Call", duration: "30 m", platform: "Google Meet" },
  { name: "test-meeting",   duration: "30 m", platform: "Google Meet" },
];
