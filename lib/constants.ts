export const leadStatuses = [
  "New",
  "Contacted",
  "Interested",
  "Demo Sent",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
] as const;

export const paymentStatuses = [
  "Not started",
  "Advance",
  "Partial",
  "Full",
] as const;

export const leadSources = [
  "Instagram",
  "Facebook",
  "Google Maps",
  "WhatsApp",
  "Referral",
  "Website",
  "Other",
] as const;

export const leadStatusStyles: Record<(typeof leadStatuses)[number], string> = {
  New: "bg-sky-100 text-sky-800",
  Contacted: "bg-violet-100 text-violet-800",
  Interested: "bg-amber-100 text-amber-900",
  "Demo Sent": "bg-indigo-100 text-indigo-800",
  "Proposal Sent": "bg-fuchsia-100 text-fuchsia-800",
  Negotiation: "bg-orange-100 text-orange-900",
  Won: "bg-emerald-100 text-emerald-800",
  Lost: "bg-rose-100 text-rose-800",
};

export const paymentStatusStyles: Record<
  (typeof paymentStatuses)[number],
  string
> = {
  "Not started": "bg-zinc-100 text-zinc-800",
  Advance: "bg-sky-100 text-sky-800",
  Partial: "bg-amber-100 text-amber-900",
  Full: "bg-emerald-100 text-emerald-800",
};

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadSource = (typeof leadSources)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
