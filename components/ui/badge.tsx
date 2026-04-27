import type { HTMLAttributes } from "react";

import {
  leadStatusStyles,
  paymentStatusStyles,
  type LeadStatus,
  type PaymentStatus,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "success" | "warning";

const toneStyles: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-900",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        leadStatusStyles[status],
      )}
    >
      {status}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        paymentStatusStyles[status],
      )}
    >
      {status}
    </span>
  );
}
