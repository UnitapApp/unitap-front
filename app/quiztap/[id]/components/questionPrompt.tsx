import Icon from "@/components/ui/Icon";
import { useQuizContext } from "@/context/quizProvider";
import { FC } from "react";

const QuestionPrompt: FC = () => {
  const { stateIndex } = useQuizContext();

  return (
    <div className="mt-10">
      <h3 className="text-base font-normal">
        {stateIndex} - Why can{"'"}t wee use fork for eating soup?
      </h3>

      <div className="mt-10 grid grid-cols-2 gap-5 font-semibold">
        <QuestionChoice title="Yes" index={1} />
        <QuestionChoice index={2} title="No" />
        <QuestionChoice index={3} title="I don't know actually" />
        <QuestionChoice index={4} title="Maybe" />
      </div>
    </div>
  );
};

const indexesToABC: Record<number, string> = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
};

const QuestionChoice: FC<{ index: number; title: string }> = ({
  index,
  title,
}) => {
  return (
    <button className="relative rounded-xl border-2 border-gray40 bg-gray20 py-3 text-center text-white">
      <span>{title}</span>

      <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-gray70">
        <Icon
          iconSrc="/assets/images/quizTap/shift.png"
          width="16px"
          height="16px"
          alt="shift"
        />
        <span>{indexesToABC[index]}</span>
      </div>
    </button>
  );
};

export default QuestionPrompt;
