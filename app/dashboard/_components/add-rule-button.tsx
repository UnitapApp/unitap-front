"use client";

import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MouseIcon, SquareMousePointerIcon, TimerIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";

export default function AddRuleButton() {
  const [open, onOpenChange] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild className="w-full">
          <button className="flex w-full items-center justify-center gap-4 rounded-xl border-2 border-dashed border-[#867FEE] bg-[#867FEE1A] p-8 text-xl text-[#867FEE] transition-colors hover:bg-[#867FEE3A]">
            Add New Rule <FaPlusCircle />
          </button>
        </DialogTrigger>
        <DialogContent className="rounded-2xl border-none p-0">
          <DialogHeader className="rounded-t-lg bg-primary-dashboard p-5">
            <DialogTitle className="text-xl text-white">Add Rule</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <main className="p-5">
            <div className="grid grid-cols-2 gap-3">
              <Link
                onClick={() => onOpenChange(false)}
                href={`/dashboard/campaigns/${1}/event-rule`}
              >
                <Card className="flex h-36 flex-col items-center justify-center gap-3 border-2 border-dashed shadow-none transition-all hover:border-primary-dashboard hover:bg-primary-dashboard/10 hover:text-primary-dashboard">
                  <SquareMousePointerIcon />
                  Event Rule
                </Card>
              </Link>
              <Link
                onClick={() => onOpenChange(false)}
                href={`/dashboard/campaigns/${1}/timed-base-rule`}
              >
                <Card className="flex h-36 flex-col items-center justify-center gap-3 border-2 border-dashed shadow-none transition-all hover:border-primary-dashboard hover:bg-primary-dashboard/10 hover:text-primary-dashboard">
                  <TimerIcon />
                  Timed Based
                </Card>
              </Link>
            </div>
          </main>
        </DialogContent>
      </Dialog>
    </>
  );
}
