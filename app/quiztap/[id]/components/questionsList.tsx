import { FC } from "react";

const QuestionsList = () => {
  return (
    <div className="mt-10 flex rounded-xl border-2 border-gray50 bg-gray20 p-4">
      <QuestionItem index={1} />
      <Separator />
      <QuestionItem index={2} />
      <Separator />
      <QuestionItem index={3} />
      <Separator />
      <QuestionItem index={4} />
      <Separator />
      <QuestionItem index={5} />
      <Separator />
      <QuestionItem index={6} />
      <Separator />
      <QuestionItem index={7} />
      <Separator />
      <QuestionItem index={8} />
      <Separator />
      <QuestionItem index={9} />
      <Separator />
      <QuestionItem index={10} />
    </div>
  );
};

const Separator = () => {
  return <div className="mx-2 my-auto h-[2px] w-7 rounded-lg bg-gray100"></div>;
};

const QuestionItem: FC<{ index: number }> = ({ index }) => {
  return (
    <div className="grid h-9 w-9 place-content-center rounded-lg border-2 border-dark-space-green bg-gray20 text-gray100">
      {index}
    </div>
  );
};

export default QuestionsList;
