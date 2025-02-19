"use client";

import { useTasks } from "@/context/TaskProvider";
import PrizeCard from "@/app/prizetap/components/PrizeCard";
import TokenCardNew from "../token-tap/TokenCardNew";
import { useMemo } from "react";

export default function TasksList() {
  const { tasks, filter, selectedChain } = useTasks();

  const tasksList = useMemo(() => {
    return tasks.filter((task) => {
      if (selectedChain && task.chain.pk !== selectedChain) return false;
      if (filter === "all") return true;
      if (filter === "raffle" && "raffleId" in task) return true;
      if (filter === "fcfs" && !("raffleId" in task)) return true;
      return false;
    });
  }, [tasks, filter, selectedChain]);

  return (
    <div className="mt-20 flex flex-col gap-y-4">
      {tasksList.map((task, key) => {
        if ("raffleId" in task) {
          return <PrizeCard key={key} prize={task} />;
        }

        return <TokenCardNew key={key} token={task} />;
      })}
    </div>
  );
}
