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
  totalParticipantsCount: number;
  amountWinPerUser: number;
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
  totalParticipantsCount: 0,
  amountWinPerUser: 0,
});

export const statePeriod = 14500;
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
  const [totalParticipantsCount, setTotalParticipantsCount] = useState(1);
  const [amountWinPerUser, setAmountWinPerUser] = useState(quiz.prizeAmount);
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

      setUserAnswersHistory([...userAnswersHistory]);
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
      const currentQuestion = currentQuestionIndex;
      const questionNumber = question.number - 1;

      const answerRes = await submitAnswerApi(
        currentQuestionIndex!,
        userEnrollmentPk,
        userAnswersHistory[questionNumber]!,
      );

      setTimeout(() => {
        if (!currentQuestion) return;

        fetchQuizQuestionApi(currentQuestion).then((res) => {
          setAnswersHistory((userAnswerHistory) => {
            userAnswerHistory[questionNumber] = res.choices.find(
              (choice) => choice.isCorrect,
            )?.id!;

            return [...userAnswerHistory];
          });
        });
      }, 500);
    }
  }, [
    getNextQuestionPk,
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

      setRemainingPeople(res.remainPartisipantsCount);
      setTotalParticipantsCount(res.totalPartisipantsCount);
      setAmountWinPerUser(res.wonAmountPerUser);

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
        setFinished(true);
        setTimer(0);
        return;
      }

      if (newState !== stateIndex) {
        setPreviousQuestion(question);
        setQuestion(null);
      }

      setTimer(() => {
        const now = new Date().getTime();

        if (newState <= 0) {
          return startAt.getTime() - now;
        }

        let estimatedRemaining =
          totalPeriod * newState + startAt.getTime() - now;

        if (estimatedRemaining < restPeriod) {
          setIsRestTime(true);
        } else {
          estimatedRemaining -= restPeriod;
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
    submitUserAnswer,
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
        totalParticipantsCount,
        amountWinPerUser,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContextProvider;
