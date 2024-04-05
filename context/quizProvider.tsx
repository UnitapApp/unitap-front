"use client";

import { Choice, Competition, Question } from "@/types";
import { NullCallback } from "@/utils";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  timer: number;
  stateIndex: number;
};

export const QuizContext = createContext<QuizContextProps>({
  health: -1,
  hint: -1,
  question: null,
  remainingPeople: -1,
  scoresHistory: [],
  answerQuestion: NullCallback,
  timer: 0,
  stateIndex: -1,
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
  const [activeQuestionChoice, setActiveQuestionChoice] = useState<
    number | null
  >(null);
  const [timer, setTimer] = useState(0);
  const [stateIndex, setStateIndex] = useState(-1);

  const answerQuestion = (choiceIndex: number) => {};

  const askForHint = () => {};

  const handleNextCallback = useCallback(() => {
    console.log("Handle Next Callback Has been Called");
    const startAt = new Date(quiz.startAt);
    const now = new Date();

    if (startAt > now) {
      setStateIndex(-1);
      setTimer(startAt.getTime() - now.getTime());
    } else {
      const timePassed = now.getTime() - startAt.getTime();
      setStateIndex(Math.floor(timePassed / 10000));
    }
  }, [quiz]);

  useEffect(() => {
    if (timer <= 0) {
      handleNextCallback();
      return;
    }

    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(timerInterval);

          return 0;
        }

        return prev - 10;
      });
    }, 10);

    return () => {
      clearInterval(timerInterval);
    };
  }, [handleNextCallback, timer]);

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
        timer,
        stateIndex,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContextProvider;
