import { LogOut } from "lucide-react";

import { SignOutButton } from "@/components/layout/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { getInitials } from "@/lib/utils";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/80 px-5 py-4 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-sky-600">Your CRM workspace</p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Convert outreach into paying clients
        </h2>
      </div>
      <div className="flex items-center gap-3 self-start sm:self-auto">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-950 px-3 py-2 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-400 font-semibold text-slate-950">
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.name || "Admin"}</p>
            <p className="truncate text-xs text-slate-300">
              {user?.email || "admin@trackingcrm.local"}
            </p>
          </div>
          <SignOutButton>
            <LogOut className="h-4 w-4" />
          </SignOutButton>
        </div>
      </div>
    </header>
  );
}
