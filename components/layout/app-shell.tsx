import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.28),_transparent_30%),linear-gradient(180deg,_#f8fbff_0%,_#edf4ff_52%,_#f8fafc_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col gap-6 pt-16 lg:pt-0">
          <Navbar />
          {children}
        </main>
      </div>
    </div>
  );
}
