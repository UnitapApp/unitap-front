"use client";
import Header from "@/components/layout/header";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const TopBar = dynamic(
  () => import("./layout/TopBar").then((modules) => modules.TopBar),
  { ssr: false },
);
export const HeaderSelection = () => {
  const pathname = usePathname();
  const hideMainHeaderRoutes = ["/about", "/new-landing"];

  return hideMainHeaderRoutes.includes(pathname) ? <TopBar /> : <Header />;
};
