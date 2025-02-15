"use client";

import { RaffleCard } from "@/app/prizetap/components/RafflesList";
import { useTasks } from "@/context/TaskProvider";
import TokenCard from "../token-tap/TokenCard";

export default function TasksList() {
  const { tasks } = useTasks();

  return (
    <div className="mt-20">
      {tasks.map((task, key) => {
        if ("raffleId" in task) {
          return <RaffleCard key={key} raffle={task} />;
        }

        return <TokenCard key={key} token={task} />;
      })}
    </div>
  );
}
