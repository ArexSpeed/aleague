import { Suspense } from "react";

import { requireSport } from "@/sports/registry";

type Props = { params: Promise<{ sport: string }> };

export default function TeamsPage(props: Props) {
  return (
    <Suspense fallback={null}>
      <TeamsContent {...props} />
    </Suspense>
  );
}

async function TeamsContent({ params }: Props) {
  const { sport } = await params;
  const { config, TeamsView } = requireSport(sport);

  return <TeamsView sport={config.id} />;
}