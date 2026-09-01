import type { Metadata } from "next";
import LivePlayer from "./live-player";

export const metadata: Metadata = {
  title: "Live — SprayFoam TV",
  description:
    "24/7 live rotation of spray foam industry content — equipment demos, contractor training, and association webinars.",
  alternates: { canonical: "/live" },
};

export default function LivePage() {
  return <LivePlayer />;
}
