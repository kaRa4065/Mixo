import "./globals.css";
import "antd/dist/reset.css";

import React from "react";
import Link from "next/link";
import SidebarLink from "./components/SidebarLink";
import PageHeader from "./components/pageHeader";

export const metadata = {
  title: "Campaign Dashboard",
  description: "Monitor campaign performance in real-time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex overflow-hidden bg-blue-50">
        {/* ─── SIDEBAR ─────────────────────────────────────────── */}
        <aside className="w-52 bg-white border-r p-4 flex-shrink-0">
          <h1 className="text-xl font-bold leading-20 tracking-wider mb-4 text-center text-primary">
            Mixo
          </h1>

          <nav className="space-y-2 text-sm ">
            <SidebarLink href="/" label="Dashboard" />
          </nav>
        </aside>

        {/* ─── MAIN WRAPPER (TOPBAR + CONTENT) ───────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* TOP BAR */}

          {/* MAIN SCROLLABLE CONTENT */}
          <main className="flex-1 overflow-y-auto  min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
