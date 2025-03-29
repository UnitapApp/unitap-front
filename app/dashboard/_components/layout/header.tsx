"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store";
import { changeAddCampaginModal } from "@/store/projects/slice";
import { kebabToTitle } from "@/utils";
import { usePathname } from "next/navigation";

export default function DashboardHeader() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const site = pathname.split("/").at(-1);

  return (
    <header className="mt-5 flex items-center justify-between">
      <p>{kebabToTitle(site ?? "dashboard")}</p>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => dispatch(changeAddCampaginModal(true))}
          size="lg"
          className="bg-[#867FEE] hover:bg-blue-500"
        >
          Add New Campagin
        </Button>
      </div>
    </header>
  );
}
