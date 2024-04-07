import QuizTapListProvider from "@/context/quiztapListProvider";
import { fetchQuizzesApi } from "@/utils/api";
import { Metadata } from "next";
import { FC, PropsWithChildren } from "react";
import Header from "./components/header";

import "./styles.scss";

export const metadata: Metadata = {
  title: "Unitap | Quiz Tap ❓❔",
  description: "",
};

const QuizListLayout: FC<PropsWithChildren> = async ({ children }) => {
  const res = await fetchQuizzesApi();

  return (
    <QuizTapListProvider
      competitionInitialList={res.results}
      countInitial={res.count}
      nextInitial={res.next}
      previousInitial={res.previous}
    >
      {children}
    </QuizTapListProvider>
  );
};

export default QuizListLayout;
