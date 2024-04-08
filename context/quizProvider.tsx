"use client";

import { Choice, Competition, Question, QuestionResponse } from "@/types";
import { NullCallback } from "@/utils";
import { fetchQuizQuestionApi, submitAnswerApi } from "@/utils/api";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type QuestionWithChoices = Question & { choices: Choice[] };

export type QuizContextProps = {
  remainingPeople: number;
  quiz?: Competition;
  health: number;
  hint: number;
  question: QuestionResponse | null;
  scoresHistory: number[];
  answerQuestion: (answerIndex: number) => void;
  timer: number;
  stateIndex: number;
  activeQuestionChoiceIndex: number;
  isRestTime: boolean;
  setIsRestTime: (value: boolean) => void;
  correctAnswerIndex: number | null;
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
  activeQuestionChoiceIndex: -1,
  isRestTime: false,
  setIsRestTime: NullCallback,
  correctAnswerIndex: -1,
});

export const statePeriod = 60000;
export const restPeriod = 5000;
const totalPeriod = restPeriod + statePeriod;

export const useQuizContext = () => useContext(QuizContext);

const refreshState = (setTimer: any, previousState: number) => {
  setTimer((prev: number) => {});
};

const QuizContextProvider: FC<
  PropsWithChildren & { quiz: Competition; userEnrollmentPk: number }
> = ({ children, quiz, userEnrollmentPk }) => {
  const [health, setHealth] = useState(1);
  const [hint, setHint] = useState(1);
  const [remainingPeople, setRemainingPeople] = useState(1);
  const [finished, setFinished] = useState(false);
  const [scoresHistory, setScoresHistory] = useState<number[]>([]);
  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [activeQuestionChoice, setActiveQuestionChoice] = useState<number>(-1);
  const [timer, setTimer] = useState(0);
  const [stateIndex, setStateIndex] = useState(-1);
  const [previousQuestion, setPreviousQuestion] =
    useState<QuestionResponse | null>(null);

  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(
    null,
  );
  const [isRestTime, setIsRestTime] = useState(false);

  const startAt = useMemo(() => new Date(quiz.startAt), [quiz.startAt]);

  const answerQuestion = (choiceIndex: number) => {
    setActiveQuestionChoice(choiceIndex);
  };

  const askForHint = () => {};

  const getNextQuestionPk = useCallback(
    (index: number) => {
      const result = quiz.questions.find((item) => item.number === index)?.pk;

      return result;
    },
    [quiz.questions],
  );

  const recalculateState = useCallback(() => {
    const now = new Date();

    if (startAt > now) {
      return -1;
    }

    const timePassed = now.getTime() - startAt.getTime();

    const newState = Math.floor(timePassed / (restPeriod + statePeriod)) + 1;

    return newState;
  }, [startAt]);

  const submitUserAnswer = useCallback(async () => {
    const currentQuestionIndex = getNextQuestionPk(stateIndex);

    if (!question?.isEligible) return;

    if (
      activeQuestionChoice &&
      activeQuestionChoice !== -1 &&
      currentQuestionIndex
    ) {
      const answerRes = await submitAnswerApi(
        currentQuestionIndex!,
        userEnrollmentPk,
        activeQuestionChoice,
      );
      setActiveQuestionChoice(-1);
    }
  }, [
    activeQuestionChoice,
    getNextQuestionPk,
    question?.isEligible,
    stateIndex,
    userEnrollmentPk,
  ]);

  const getQuestion = useCallback(
    async (stateIndex: number) => {
      const questionIndex = getNextQuestionPk(stateIndex);
      if (!questionIndex) {
        return;
      }

      const res = await fetchQuizQuestionApi(questionIndex);

      setQuestion(res);
    },
    [getNextQuestionPk],
  );

  useEffect(() => {
    if (question) return;

    getQuestion(stateIndex);
    setPreviousQuestion(question);
  }, [getQuestion, question, stateIndex]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const newState = recalculateState();
      setStateIndex(newState);

      if (newState !== stateIndex) {
        setQuestion(null);
      }

      setTimer(() => {
        const now = new Date().getTime();

        if (totalPeriod * newState + startAt.getTime() - now >= statePeriod) {
          setIsRestTime(true);
        } else {
          setIsRestTime(false);
        }

        const estimatedRemaining =
          newState <= 0
            ? startAt.getTime() - now
            : totalPeriod * newState + startAt.getTime() - now;

        return estimatedRemaining;
      });
    }, 20);

    return () => {
      clearInterval(timerInterval);
    };
  }, [getQuestion, recalculateState, startAt, stateIndex]);

  useEffect(() => {
    if (!isRestTime) return;

    submitUserAnswer();
  }, [isRestTime, submitUserAnswer]);

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
        activeQuestionChoiceIndex: activeQuestionChoice,
        isRestTime,
        setIsRestTime,
        correctAnswerIndex,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContextProvider;
