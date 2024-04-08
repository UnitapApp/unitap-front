"use client";

import { FAST_INTERVAL } from "@/constants";
import { Competition } from "@/types";
import { NullCallback } from "@/utils";
import { fetchUsersQuizEnrollments } from "@/utils/api";
import { useFastRefresh, useRefreshWithInitial } from "@/utils/hooks/refresh";
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
  enrollmentsList: { id: number; competition: Competition }[];
  addEnrollment: (value: { id: number; competition: Competition }) => void;
}>({
  quizList: [],
  pageIndex: 1,
  count: 0,
  enrollmentsList: [],
  addEnrollment: NullCallback,
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

  const [enrollmentsList, setEnrollmentsList] = useState<
    {
      id: number;
      competition: Competition;
    }[]
  >([]);

  const [paginateStatus, setPaginateStatus] = useState({
    previous: previousInitial,
    next: nextInitial,
    count: countInitial,
    currentPage: 1,
  });

  const refreshCompetitionList = (currentPage: number) => {};

  useRefreshWithInitial(
    () => {
      fetchUsersQuizEnrollments().then((res) => {
        setEnrollmentsList(res);
      });
    },
    FAST_INTERVAL,
    [],
  );

  return (
    <QuizTapListContext.Provider
      value={{
        count: paginateStatus.count,
        pageIndex: paginateStatus.currentPage,
        quizList: competitionList,
        next: paginateStatus.next,
        previous: paginateStatus.previous,
        enrollmentsList,
        addEnrollment: (value) =>
          setEnrollmentsList([...enrollmentsList, value]),
      }}
    >
      {children}
    </QuizTapListContext.Provider>
  );
};

export default QuizTapListProvider;
