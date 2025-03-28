"use client";

import { PropsWithChildren } from "react";
import DashboardSidebar from "./sidebar";
import DashboardHeader from "./header";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen gap-2 bg-[#F1F5F9] p-5">
      <DashboardSidebar />
      <main className="flex-1">
        <DashboardHeader />
        {children}
      </main>
    </div>
  );
}
