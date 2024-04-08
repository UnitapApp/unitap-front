"use client";

import { useQuizContext } from "@/context/quizProvider";
import { FC } from "react";

const QuizFinished: FC<{}> = () => {
  const { timer, previousQuestion, userAnswersHistory } = useQuizContext();

  return <div className="mt-10 text-center font-bold">Quiz is Finished</div>;
};

export default QuizFinished;
