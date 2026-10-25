import { redirect } from "next/navigation";

// Competitions is the first page we build; Home comes later.
export default function RootPage() {
  redirect("/competitions");
}
