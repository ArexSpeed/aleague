import { Suspense } from "react";

import { requireSport } from "@/sports/registry";

type Props = { params: Promise<{ sport: string }> };

export default function HomePage(props: Props) {
  return (
    <Suspense fallback={null}>
      <HomeContent {...props} />
    </Suspense>
  );
}

async function HomeContent({ params }: Props) {
  const { sport } = await params;
  const { config, HomeView } = requireSport(sport);

  return <HomeView sport={config.id} />;
}