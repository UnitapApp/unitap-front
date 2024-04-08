"use client";

import { Competition, Question, QuestionResponse } from "@/types";
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
  activeQuestionChoiceIndex: number | null;
  isRestTime: boolean;
  setIsRestTime: (value: boolean) => void;
  previousQuestion: QuestionResponse | null;
  answersHistory: (number | null)[];
  userAnswersHistory: (number | null)[];
  finished: boolean;
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
  previousQuestion: null,
  answersHistory: [],
  userAnswersHistory: [],
  finished: false,
});

export const statePeriod = 60000;
export const restPeriod = 5000;
const totalPeriod = restPeriod + statePeriod;

export const useQuizContext = () => useContext(QuizContext);

const QuizContextProvider: FC<
  PropsWithChildren & { quiz: Competition; userEnrollmentPk: number }
> = ({ children, quiz, userEnrollmentPk }) => {
  const [health, setHealth] = useState(1);
  const [hint, setHint] = useState(1);
  const [remainingPeople, setRemainingPeople] = useState(1);
  const [scoresHistory, setScoresHistory] = useState<number[]>([]);

  // remainPartisipantsCount: 2;
  // text: "Ali Teswt";
  // totalPartisipantsCount: 2;
  // wonAmountPerUser: 5;

  const [finished, setFinished] = useState(false);
  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [timer, setTimer] = useState(0);
  const [stateIndex, setStateIndex] = useState(-1);
  const [previousQuestion, setPreviousQuestion] =
    useState<QuestionResponse | null>(null);

  const [answersHistory, setAnswersHistory] = useState<(number | null)[]>(
    Array.from(new Array(quiz.questions.length).fill(null)),
  );

  const [userAnswersHistory, setUserAnswersHistory] = useState<
    (number | null)[]
  >(Array.from(new Array(quiz.questions.length).fill(null)));

  const [isRestTime, setIsRestTime] = useState(false);

  const startAt = useMemo(() => new Date(quiz.startAt), [quiz.startAt]);

  const answerQuestion = useCallback(
    (choiceIndex: number) => {
      userAnswersHistory[question!.number - 1] = choiceIndex;

      setUserAnswersHistory({
        ...userAnswersHistory,
      });
    },
    [question, userAnswersHistory],
  );

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
      userAnswersHistory[question.number - 1] !== -1 &&
      currentQuestionIndex !== -1
    ) {
      const answerRes = await submitAnswerApi(
        currentQuestionIndex!,
        userEnrollmentPk,
        userAnswersHistory[question.number - 1]!,
      );

      setUserAnswersHistory((userAnswerHistory) => {
        userAnswerHistory[question.number - 1] = answerRes.id;
        return [...userAnswerHistory];
      });

      fetchQuizQuestionApi(question.id).then((res) => {
        setAnswersHistory((answersHistory) => {
          res.choices.forEach((choice) => {
            if (choice.isCorrect) {
              answersHistory[question.number - 1] = choice.id;
            }
          });

          return [...answersHistory];
        });
      });
    }
  }, [
    getNextQuestionPk,
    question?.id,
    question?.isEligible,
    question?.number,
    stateIndex,
    userAnswersHistory,
    userEnrollmentPk,
  ]);

  const getQuestion = useCallback(
    async (stateIndex: number) => {
      const questionIndex = getNextQuestionPk(stateIndex);
      if (!questionIndex) {
        return;
      }

      const res = await fetchQuizQuestionApi(questionIndex);

      setQuestion((prev) => {
        if (prev) {
          setPreviousQuestion(prev);
        }

        return res;
      });
    },
    [getNextQuestionPk],
  );

  useEffect(() => {
    if (question) return;
    getQuestion(stateIndex);
  }, [getQuestion, question, stateIndex]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const newState = recalculateState();
      setStateIndex(newState);

      if (newState > quiz.questions.length) {
        setFinished((prev) => {
          if (!prev) {
            submitUserAnswer();
          }
          return true;
        });
        setTimer(0);
        return;
      }

      if (newState !== stateIndex) {
        setPreviousQuestion(question);
        setQuestion(null);
      }

      setTimer(() => {
        const now = new Date().getTime();

        let estimatedRemaining =
          newState <= 0
            ? startAt.getTime() - now
            : totalPeriod * newState + startAt.getTime() - now;

        if (
          totalPeriod * newState + startAt.getTime() - now >= statePeriod &&
          newState !== 1
        ) {
          setIsRestTime(true);
          estimatedRemaining -= statePeriod;
        } else {
          setIsRestTime(false);
        }

        return estimatedRemaining;
      });
    }, 20);

    return () => {
      clearInterval(timerInterval);
    };
  }, [
    getQuestion,
    question,
    quiz.questions.length,
    recalculateState,
    startAt,
    stateIndex,
  ]);

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
        activeQuestionChoiceIndex: question
          ? userAnswersHistory[question?.number - 1]
          : -1,
        isRestTime,
        setIsRestTime,
        previousQuestion,
        answersHistory,
        userAnswersHistory,
        finished,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContextProvider;
