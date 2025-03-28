"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronRight } from "react-icons/fa";

export default function DashboardSidebar() {
  return (
    <aside className="ml-2 flex h-full w-72 flex-col gap-4 rounded-2xl border border-black bg-white p-5">
      <Image
        alt="unitap"
        width="182"
        height="54"
        src="/assets/images/landing/unitap-logo.svg"
      />
      <div className="mt-5"></div>
      <SidebarItem href="/dashboard" title="Dashboard" />
      <SidebarItem href="/campaigns" title="Campaigns" />
      <SidebarItem href="/tools" title="Tools" />
      <SidebarItem href="/setting" title="Settings" />
      <SidebarItem href="/effects-overview" title="Effects Overview" />
      <div className="mt-auto">
        <button className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-3 hover:bg-slate-100">
          Project Name
          <div className="ml-auto">
            <FaChevronRight className="text-gray100" />
          </div>
        </button>
      </div>
    </aside>
  );
}

export function SidebarItem({ href, title }: { title: string; href: string }) {
  const pathname = usePathname();
  return (
    <Link
      className={cn(
        "rounded-xl border border-transparent px-4 py-2 transition-colors hover:bg-blue-100",
        pathname === href ? "border-blue-500 bg-blue-200" : "",
      )}
      href={href}
    >
      {title}
    </Link>
  );
}
