import { Outfit } from "next/font/google";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";

// latin-ext is needed for Polish characters.
const outfit = Outfit({ subsets: ["latin", "latin-ext"], display: "swap" });

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className={outfit.className}>
      <AppShell>{children}</AppShell>
    </div>
  );
}
