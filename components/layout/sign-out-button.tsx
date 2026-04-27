"use client";

import { signOut } from "next-auth/react";
import type { ReactNode } from "react";

export function SignOutButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
      aria-label="Sign out"
    >
      {children}
    </button>
  );
}
