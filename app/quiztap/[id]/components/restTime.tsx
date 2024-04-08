"use client";

import Icon from "@/components/ui/Icon";
import { useQuizContext } from "@/context/quizProvider";
import { FC, useMemo } from "react";

const isArrayEqual = (array1: any[], array2: any[]) => {
  if (array1.length !== array2.length) return false;

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) return false;
  }

  return true;
};

const RestTime: FC<{}> = () => {
  const { timer, userAnswersHistory, answersHistory, stateIndex } =
    useQuizContext();

  const totalSeconds = Math.floor(timer / 1000);
  const seconds = totalSeconds % 60;

  const isLost = useMemo(() => {
    return isArrayEqual(answersHistory, userAnswersHistory);
  }, [answersHistory, userAnswersHistory]);

  if (answersHistory[stateIndex - 1] === null) {
    return (
      <div className="mt-10 text-center">
        <p className="text-lg font-semibold text-white">
          Processing the results....
        </p>

        <p className="mt-5 text-gray100"></p>
        <p className="mt-3 text-sm text-gray90">
          Next Questions in {seconds} seconds...
        </p>
      </div>
    );
  }

  if (isLost) {
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
  }

  return (
    <div className="mt-10 text-center">
      <Icon
        iconSrc="/assets/images/quizTap/spaceman-like.png"
        alt="spaceman like"
        width="68px"
        height="68px"
      />
      <p className="text-lg font-semibold text-error">Ohh! Game Over.</p>

      <p className="mt-5 text-gray100">
        <strong className="text-white underline">21</strong>{" "}
        <span>people lost the game in the previous round.</span>
      </p>
      <p className="mt-3 text-sm text-gray90">Next Questions in 5 seconds...</p>
    </div>
  );
};

export default RestTime;
