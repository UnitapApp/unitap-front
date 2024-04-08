"use client";

import Icon from "@/components/ui/Icon";
import Timer from "./components/timer";
import QuestionsList from "./components/questionsList";
import WaitingIdle from "./components/waitingIdle";
import { useQuizContext } from "@/context/quizProvider";
import QuestionPrompt from "./components/questionPrompt";
import RestTime from "./components/restTime";
import QuizFinished from "./components/finished";

const QuizItemPage = () => {
  const { stateIndex, hint } = useQuizContext();

  return (
    <div className="quiz-main-wrapper relative w-full">
      <main className="quiz-main-content h-full w-full flex-1 rounded-2xl p-3">
        <div className="mt-5 flex items-center justify-between px-5">
          <p className="text-[#997EA4]">Quiz</p>
          <Timer />

          <button
            disabled={hint <= 0 || stateIndex <= 0}
            className="flex items-center rounded-xl border-2 border-gray70 bg-gray00 px-2 text-gray100 disabled:opacity-60"
          >
            <Icon
              alt="hint"
              className="py-1"
              iconSrc="/assets/images/quizTap/hint.png"
              width="20px"
              height="20px"
            />
            <span className="py-1">Hint</span>
            <span className="ml-4 border-l-2 border-gray70 py-1 pl-2">1</span>
          </button>
        </div>

        <QuestionsList />

        <RenderQuizItemBody />
      </main>
    </div>
  );
};

const RenderQuizItemBody = () => {
  const { stateIndex, isRestTime, finished } = useQuizContext();

  if (finished) return <QuizFinished />;

  if (stateIndex <= 0) {
    return <WaitingIdle />;
  }

  if (isRestTime) return <RestTime />;

  return <QuestionPrompt />;
};

export default QuizItemPage;
