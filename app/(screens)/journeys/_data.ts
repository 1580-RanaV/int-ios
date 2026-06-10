// ─── Types ───────────────────────────────────────────────────────────────────

export type Status    = "Live" | "Paused" | "Stopped" | "Draft";
export type Filter    = "All" | Status;
export type Channel   = "Email" | "Push" | "Slack" | "SMS";

export const METRIC_ROWS = ["Opened", "Clicked", "Converted", "Bounced", "Unsubscribed", "Replied", "Spam"] as const;
export type MetricRow   = typeof METRIC_ROWS[number];
export type ChannelData = Record<MetricRow, { count: number; pct: string }>;

export type MessagePerf = {
  label: string;
  sent: number;
  revenuePerMsg: string;
  failed:      { count: number; pct: string };
  opens:       { count: number; pct: string };
  clicks:      { count: number; pct: string };
  conversions: { count: number; pct: string };
  replies:     { count: number; pct: string };
  bounced:     { count: number; pct: string };
  unsub:       { count: number; pct: string };
  spam:        { count: number; pct: string };
};

export type Journey = {
  name: string;
  status: Status;
  since: string;
  openRate: string;
  clickRate: string;
  revenue: string;
  channels: Record<Channel, ChannelData>;
  analytics?: { messages: MessagePerf[] };
};

// ─── Data ────────────────────────────────────────────────────────────────────

export const BLANK: ChannelData = {
  Opened:       { count: 0, pct: "0.00%" },
  Clicked:      { count: 0, pct: "0.00%" },
  Converted:    { count: 0, pct: "0.00%" },
  Bounced:      { count: 0, pct: "0.00%" },
  Unsubscribed: { count: 0, pct: "0.00%" },
  Replied:      { count: 0, pct: "0.00%" },
  Spam:         { count: 0, pct: "0.00%" },
};

export const blankChannels: Journey["channels"] = { Email: BLANK, Push: BLANK, Slack: BLANK, SMS: BLANK };

export const JOURNEYS: Journey[] = [
  {
    name: "Stock Page Abandon",
    status: "Live",
    since: "7 months ago",
    openRate: "12.43%",
    clickRate: "3.22%",
    revenue: "$1.2K",
    channels: {
      Email: {
        Opened:       { count: 847, pct: "12.43%"  },
        Clicked:      { count: 219, pct: "3.22%"   },
        Converted:    { count: 41,  pct: "0.60%"   },
        Bounced:      { count: 12,  pct: "-0.18%"  },
        Unsubscribed: { count: 8,   pct: "-0.12%"  },
        Replied:      { count: 3,   pct: "0.04%"   },
        Spam:         { count: 1,   pct: "-0.01%"  },
      },
      Push: {
        Opened:       { count: 312, pct: "8.10%"  },
        Clicked:      { count: 58,  pct: "1.51%"  },
        Converted:    { count: 9,   pct: "0.23%"  },
        Bounced:      { count: 0,   pct: "0.00%"  },
        Unsubscribed: { count: 2,   pct: "0.05%"  },
        Replied:      { count: 0,   pct: "0.00%"  },
        Spam:         { count: 0,   pct: "0.00%"  },
      },
      Slack: BLANK,
      SMS: BLANK,
    },
    analytics: {
      messages: [
        {
          label: "All Messages",
          sent: 1623,
          revenuePerMsg: "$92.61",
          failed:      { count: 0,   pct: "0.0%"  },
          opens:       { count: 929, pct: "57.2%" },
          clicks:      { count: 73,  pct: "4.5%"  },
          conversions: { count: 91,  pct: "5.6%"  },
          replies:     { count: 0,   pct: "0.0%"  },
          bounced:     { count: 19,  pct: "1.2%"  },
          unsub:       { count: 0,   pct: "0.0%"  },
          spam:        { count: 0,   pct: "0.0%"  },
        },
        {
          label: "Welcome Email",
          sent: 841,
          revenuePerMsg: "$48.30",
          failed:      { count: 3,   pct: "0.4%"  },
          opens:       { count: 503, pct: "59.8%" },
          clicks:      { count: 44,  pct: "5.2%"  },
          conversions: { count: 55,  pct: "6.5%"  },
          replies:     { count: 0,   pct: "0.0%"  },
          bounced:     { count: 11,  pct: "1.3%"  },
          unsub:       { count: 0,   pct: "0.0%"  },
          spam:        { count: 0,   pct: "0.0%"  },
        },
        {
          label: "Follow-up Nudge",
          sent: 782,
          revenuePerMsg: "$44.31",
          failed:      { count: 0,   pct: "0.0%"  },
          opens:       { count: 426, pct: "54.5%" },
          clicks:      { count: 29,  pct: "3.7%"  },
          conversions: { count: 36,  pct: "4.6%"  },
          replies:     { count: 0,   pct: "0.0%"  },
          bounced:     { count: 8,   pct: "1.0%"  },
          unsub:       { count: 0,   pct: "0.0%"  },
          spam:        { count: 0,   pct: "0.0%"  },
        },
      ],
    },
  },
  {
    name: "Lifecycle Onboarding",
    status: "Live",
    since: "5 months ago",
    openRate: "18.70%",
    clickRate: "5.10%",
    revenue: "$3.4K",
    channels: {
      Email: {
        Opened:       { count: 1240, pct: "18.70%" },
        Clicked:      { count: 338,  pct: "5.10%"  },
        Converted:    { count: 97,   pct: "1.46%"  },
        Bounced:      { count: 18,   pct: "0.27%"  },
        Unsubscribed: { count: 5,    pct: "0.08%"  },
        Replied:      { count: 0,    pct: "0.00%"  },
        Spam:         { count: 0,    pct: "0.00%"  },
      },
      Push: BLANK, Slack: BLANK, SMS: BLANK,
    },
  },
  { name: "Home Page Abandon [v2]",      status: "Paused",  since: "2 months ago", openRate: "8.20%",  clickRate: "1.90%", revenue: "$0.00", channels: blankChannels },
  { name: "Watchlist Page Abandon [v3]", status: "Paused",  since: "1 month ago",  openRate: "6.40%",  clickRate: "1.20%", revenue: "$0.00", channels: blankChannels },
  { name: "Paying Subscriber Journey",   status: "Draft",   since: "3 weeks ago",  openRate: "0.00%",  clickRate: "0.00%", revenue: "$0.00", channels: blankChannels },
  { name: "High-Value Customer Journey", status: "Draft",   since: "2 weeks ago",  openRate: "0.00%",  clickRate: "0.00%", revenue: "$0.00", channels: blankChannels },
  { name: "Re-engagement Campaign",      status: "Draft",   since: "1 week ago",   openRate: "0.00%",  clickRate: "0.00%", revenue: "$0.00", channels: blankChannels },
  { name: "Welcome Series",              status: "Draft",   since: "4 days ago",   openRate: "0.00%",  clickRate: "0.00%", revenue: "$0.00", channels: blankChannels },
  { name: "Cart Abandonment Flow",       status: "Stopped", since: "4 months ago", openRate: "9.80%",  clickRate: "2.10%", revenue: "$542",  channels: blankChannels },
  { name: "Post-Purchase Sequence",      status: "Stopped", since: "6 months ago", openRate: "14.20%", clickRate: "3.80%", revenue: "$890",  channels: blankChannels },
];

export const STATUS_COLOR: Record<Status, string> = {
  Live:    "#15803d",
  Paused:  "#c2410c",
  Stopped: "#be123c",
  Draft:   "#4b5563",
};

export const STATUS_BG: Record<Status, string> = {
  Live:    "rgba(16,185,129,0.1)",
  Paused:  "rgba(234,88,12,0.1)",
  Stopped: "rgba(244,63,94,0.1)",
  Draft:   "rgba(107,114,128,0.1)",
};

export const GROUP_ORDER: Status[] = ["Live", "Paused", "Stopped", "Draft"];

export const FILTER_OPTIONS: { value: Filter; color?: string }[] = [
  { value: "All"     },
  { value: "Live",    color: "#15803d" },
  { value: "Paused",  color: "#c2410c" },
  { value: "Stopped", color: "#be123c" },
  { value: "Draft",   color: "#4b5563" },
];

export const CHANNELS: Channel[] = ["Email", "Push", "Slack", "SMS"];
