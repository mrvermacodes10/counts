import type { Metadata } from "next";
import { PersonPage } from "@/components/PersonPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Neel" };

export default function NeelPage() {
  return <PersonPage person="NEEL" />;
}
