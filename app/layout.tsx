import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArchNova Studio — Architectural Design Workspace",
  description: "Design, inspect, and refine architectural concepts in a unified 2D and 3D workspace."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
