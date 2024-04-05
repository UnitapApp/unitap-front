"use client";

import Icon from "@/components/ui/Icon";
import { useQuizContext } from "@/context/quizProvider";
import { FC } from "react";

const RestTime: FC<{}> = () => {
  const { timer } = useQuizContext();

  const totalSeconds = Math.floor(timer / 1000);
  const seconds = totalSeconds % 60;

  return (
    <div className="mt-10 text-center">
      <Icon
        iconSrc="/assets/images/quizTap/spaceman-like.png"
        alt="spaceman like"
        width="68px"
        height="68px"
      />
      <p className="text-lg font-semibold text-space-green">
        Nice Job! thats right.
      </p>

      <p className="mt-5 text-gray100">
        <strong className="text-white underline">21</strong>{" "}
        <span>people lost the game in the previous round</span>
      </p>
      <p className="mt-3 text-sm text-gray90">
        Next Questions in {seconds} seconds...
      </p>
    </div>
  );
};

export default RestTime;
