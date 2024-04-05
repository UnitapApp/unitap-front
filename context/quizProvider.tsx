"use client";

import { Choice, Competition, Question } from "@/types";
import { NullCallback } from "@/utils";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

type QuestionWithChoices = Question & { choices: Choice[] };

export type QuizContextProps = {
  remainingPeople: number;
  quiz?: Competition;
  health: number;
  hint: number;
  question: QuestionWithChoices | null;
  scoresHistory: number[];
  answerQuestion: (answerIndex: number) => void;
};

export const QuizContext = createContext<QuizContextProps>({
  health: -1,
  hint: -1,
  question: null,
  remainingPeople: -1,
  scoresHistory: [],
  answerQuestion: NullCallback,
});

export const useQuizContext = () => useContext(QuizContext);

const QuizContextProvider: FC<PropsWithChildren & { quiz: Competition }> = ({
  children,
  quiz,
}) => {
  const [health, setHealth] = useState(1);
  const [hint, setHint] = useState(1);
  const [remainingPeople, setRemainingPeople] = useState(1);
  const [scoresHistory, setScoresHistory] = useState<number[]>([]);
  const [question, setQuestion] = useState<QuestionWithChoices | null>(null);

  const [timer, setTimer] = useState(0);

  const answerQuestion = (choiceIndex: number) => {};

  return (
    <QuizContext.Provider
      value={{
        health,
        hint,
        question,
        remainingPeople,
        scoresHistory,
        quiz,
        answerQuestion,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContextProvider;
