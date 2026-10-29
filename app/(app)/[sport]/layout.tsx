import { Suspense, type ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { requireSport, SPORT_IDS } from "@/sports/registry";

type SportLayoutProps = {
  children: ReactNode;
  params: Promise<{ sport: string }>;
};

export function generateStaticParams() {
  return SPORT_IDS.map((sport) => ({ sport }));
}

/**
 * Validates the sport segment once for the whole subtree and frames every page.
 * params are runtime data, so they are read inside Suspense; until then a plain
 * shell-coloured frame is shown (no layout jump, no blocked navigation).
 */
export default function SportLayout(props: SportLayoutProps) {
  return (
    <Suspense fallback={<div className="h-dvh bg-shell-deep" />}>
      <SportShell {...props} />
    </Suspense>
  );
}

async function SportShell({ children, params }: SportLayoutProps) {
  const { sport } = await params;
  const { config } = requireSport(sport);

  return (
    <AppShell sport={config.id} sportName={config.name}>
      {children}
    </AppShell>
  );
}