import type { Metadata } from "next";
import { PersonPage } from "@/components/PersonPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Nishil" };

export default function NishilPage() {
  return <PersonPage person="NISHIL" />;
}
