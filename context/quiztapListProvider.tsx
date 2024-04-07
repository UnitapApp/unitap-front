"use client";

import { Competition } from "@/types";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

export const QuizTapListContext = createContext<{
  quizList: Competition[];
  pageIndex: number;
  next?: string;
  previous?: string;
  count: number;
}>({
  quizList: [],
  pageIndex: 1,
  count: 0,
});

export const useQuizTapListContext = () => useContext(QuizTapListContext);

const QuizTapListProvider: FC<
  PropsWithChildren & {
    competitionInitialList: Competition[];
    previousInitial?: string;
    nextInitial?: string;
    countInitial: number;
  }
> = ({
  children,
  competitionInitialList,
  nextInitial,
  previousInitial,
  countInitial,
}) => {
  const [competitionList, setCompetitionList] = useState(
    competitionInitialList,
  );

  const [paginateStatus, setPaginateStatus] = useState({
    previous: previousInitial,
    next: nextInitial,
    count: countInitial,
    currentPage: 1,
  });

  const refreshCompetitionList = (currentPage: number) => {};

  return (
    <QuizTapListContext.Provider
      value={{
        count: paginateStatus.count,
        pageIndex: paginateStatus.currentPage,
        quizList: competitionList,
        next: paginateStatus.next,
        previous: paginateStatus.previous,
      }}
    >
      {children}
    </QuizTapListContext.Provider>
  );
};

export default QuizTapListProvider;
