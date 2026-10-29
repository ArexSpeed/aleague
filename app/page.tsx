import { redirect } from "next/navigation";

import { sportPath } from "@/lib/paths";
import { DEFAULT_SPORT } from "@/sports/registry";

// Home is per sport. A cross-sport landing page can replace this redirect later.
export default function RootPage() {
  redirect(sportPath(DEFAULT_SPORT, "home"));
}
