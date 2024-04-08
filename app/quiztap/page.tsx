import QuizTapListProvider from "@/context/quiztapListProvider";
import { fetchQuizzesApi } from "@/utils/api";
import { FC } from "react";

import QuizTapMain from "./components/main";

const QuizListPage: FC = async () => {
  const res = await fetchQuizzesApi();

  return (
    <QuizTapListProvider
      competitionInitialList={res.results}
      countInitial={res.count}
      nextInitial={res.next}
      previousInitial={res.previous}
    >
      <QuizTapMain />
    </QuizTapListProvider>
  );
};

export default QuizListPage;
