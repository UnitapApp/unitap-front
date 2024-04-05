import Icon from "@/components/ui/Icon";
import Timer from "./components/timer";
import QuestionsList from "./components/questionsList";
import WaitingIdle from "./components/waitingIdle";

const QuizItemPage = () => {
  return (
    <div className="quiz-main-wrapper ">
      <main className="quiz-main-content h-full w-full flex-1 rounded-2xl p-3">
        <div className="flex items-center justify-between px-5">
          <p className="text-[#997EA4]">Quiz</p>
          <Timer />

          <button className="flex items-center rounded-xl border-2 border-gray70 bg-gray00 px-2 text-gray100">
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

        <WaitingIdle />
      </main>
    </div>
  );
};

export default QuizItemPage;
