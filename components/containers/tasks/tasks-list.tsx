"use client";

import { useTasks } from "@/context/TaskProvider";
import TokenCard from "../token-tap/TokenCard";
import PrizeCard from "@/app/prizetap/components/PrizeCard";

export default function TasksList() {
  const { tasks } = useTasks();

  return (
    <div className="mt-20 flex flex-col gap-y-4">
      {tasks.map((task, key) => {
        if ("raffleId" in task) {
          return <PrizeCard key={key} prize={task} />;
        }

        return <TokenCard key={key} token={task} />;
      })}
    </div>
  );
}
