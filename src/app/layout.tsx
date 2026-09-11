import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArcGate AI | Multi-orchestrator",
  description: "Parallel specialist agents with human-approved PDF architecture output",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
