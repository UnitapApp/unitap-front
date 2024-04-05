import Icon from "@/components/ui/Icon";
import { FC } from "react";

const QuizTapSidebar: FC = () => {
  return (
    <aside className="quiz-sidebar flex w-60 flex-col rounded-2xl p-1">
      <div className="flex items-center justify-between rounded-lg bg-gray10 p-5">
        <p className="text-gray100">Health</p>

        <div className="flex items-center gap-4">
          <span className="text-lg">1</span>

          <Icon
            width="30px"
            height="30px"
            iconSrc="/assets/images/quizTap/quiz-health.png"
            alt="health"
          />
        </div>
      </div>

      <div className="mt-1 flex justify-between rounded-lg bg-gray10 p-5">
        <div className="text-gray100">
          <p>In game people</p>

          <p className="mt-2">
            <strong className="text-white">100</strong> / 150
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Icon
            width="35px"
            height="35px"
            iconSrc="/assets/images/quizTap/people.png"
            alt="health"
          />
        </div>
      </div>
      <div className="mt-1 flex justify-between rounded-lg bg-gray10 p-5">
        <div className="text-gray100">
          <p>Your Prize so Far</p>

          <p className="mt-2">
            <strong className="text-white">12.00</strong>{" "}
            <span className="text-space-green">USDT</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Icon
            width="35px"
            height="35px"
            iconSrc="/assets/images/quizTap/prize.png"
            alt="health"
          />
        </div>
      </div>

      <div className="mt-20 justify-self-end rounded-2xl bg-gray10 p-3">
        <Icon
          className="mx-auto w-48"
          iconSrc="/assets/images/quizTap/sponsored.png"
          alt="health"
        />
        <div className="mt-4 flex items-center justify-center gap-3">
          <Icon
            className="h-5 w-5"
            iconSrc="/assets/images/quizTap/polygon.png"
            alt="polygon"
          />
          <Icon
            className="h-5 w-5"
            iconSrc="/assets/images/quizTap/gnosis.png"
            alt="gnosis"
          />
          <Icon
            className="h-5 w-5"
            iconSrc="/assets/images/quizTap/vector.png"
            alt="vector"
          />
          <Icon
            className="h-5 w-5"
            iconSrc="/assets/images/quizTap/ethereum.png"
            alt="ethereum"
          />
          <Icon
            className="h-5 w-5"
            iconSrc="/assets/images/quizTap/celo.png"
            alt="celo"
          />
        </div>
      </div>
    </aside>
  );
};

export default QuizTapSidebar;
