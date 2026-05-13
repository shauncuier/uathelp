import type { Metadata } from "next";
import { SettingsFormClient } from "./settings-client";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return <SettingsFormClient />;
}
