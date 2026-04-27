"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  ChartColumnBig,
  Clock3,
  Menu,
  PanelLeftClose,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: ChartColumnBig,
  },
  {
    href: "/leads",
    label: "Leads",
    icon: BriefcaseBusiness,
  },
  {
    href: "/follow-ups",
    label: "Follow-ups",
    icon: Clock3,
  },
  {
    href: "/deals",
    label: "Deals",
    icon: PanelLeftClose,
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col rounded-[2rem] border border-white/60 bg-slate-950 px-5 py-6 text-white shadow-2xl shadow-slate-950/25">
      <div className="mb-10 px-2">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
          Tracking CRM
        </p>
        <h1 className="mt-3 text-2xl font-semibold leading-tight">
          Freelancer sales cockpit
        </h1>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-white text-slate-950"
                  : "text-slate-300 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-3xl bg-white/10 p-4 text-sm text-slate-300">
        Track outreach, follow-ups, proposals, and payments from one place.
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden">
        <Button
          variant="secondary"
          size="sm"
          className="fixed left-4 top-4 z-40"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-4 w-4" />
          Menu
        </Button>
      </div>

      <aside className="hidden w-80 shrink-0 lg:block">
        <SidebarContent />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 bg-slate-950/50 p-4 lg:hidden">
          <div
            className="absolute inset-0"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 h-full max-w-xs">
            <SidebarContent onNavigate={() => setOpen(false)} />
            <button
              type="button"
              aria-label="Close menu"
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"
              onClick={() => setOpen(false)}
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
