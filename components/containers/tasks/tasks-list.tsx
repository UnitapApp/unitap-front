"use client";

import { useTasks } from "@/context/TaskProvider";
import PrizeCard from "@/app/(app)/prizetap/components/PrizeCard";
import TokenCardNew from "../token-tap/TokenCardNew";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function TasksList() {
  const { tasks, filter, selectedChain, search } = useTasks();
  const params = useSearchParams();

  const highlightedName = params.get("hc");

  const tasksList = useMemo(() => {
    const tasksSorted = highlightedName
      ? tasks.sort((a, b) =>
          a.name === highlightedName ? -1 : b.name === highlightedName ? 1 : 0,
        )
      : tasks;

    return tasksSorted.filter((task) => {
      if (search && !task.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (selectedChain && task.chain.pk !== selectedChain) return false;
      if (filter === "all") return true;
      if (filter === "raffle" && "raffleId" in task) return true;
      if (filter === "fcfs" && !("raffleId" in task)) return true;
      return false;
    });
  }, [tasks, filter, selectedChain, search]);

  return (
    <div className="mt-20 flex flex-col gap-y-4">
      {tasksList.map((task, key) => {
        if ("raffleId" in task) {
          return (
            <PrizeCard
              isHighlighted={highlightedName === task.name}
              key={key}
              prize={task}
            />
          );
        }

        return (
          <TokenCardNew
            key={key}
            token={task}
            isHighlighted={highlightedName === task.name}
          />
        );
      })}
    </div>
  );
}
