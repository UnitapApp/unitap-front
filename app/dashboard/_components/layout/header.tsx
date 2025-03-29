"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store";
import { changeAddCampaginModal } from "@/store/projects/slice";
import Link from "next/link";

export default function DashboardHeader() {
  const dispatch = useAppDispatch();
  return (
    <header className="mt-5 flex items-center justify-between">
      Dashboard
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
