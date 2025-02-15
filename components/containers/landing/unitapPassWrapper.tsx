"use client";

import dynamic from "next/dynamic";

const UnitapPass = dynamic(() => import("./unitapPass"), { ssr: false });

export default function UnitapPassWrapper() {
  return <UnitapPass />;
}
