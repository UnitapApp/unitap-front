"use client";

import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PrizeTapProvider, { usePrizeTapContext } from "./prizeTapProvider";
import TokenTapProvider, { useTokenTapContext } from "./tokenTapProvider";
import { Prize, Token } from "@/types";

export interface TaskProviderProps extends PropsWithChildren {
  raffles: Prize[];
  tokens: Token[];
}

export const TaskContext = createContext({
  tasks: [] as (Prize | Token)[],
  search: "",
  setSearch: (search: string) => {},
});

export const TaskProvider: FC<TaskProviderProps> = ({
  children,
  raffles,
  tokens,
}) => {
  return (
    <PrizeTapProvider raffles={raffles}>
      <TokenTapProvider tokens={tokens}>
        <TaskContextProvider>{children}</TaskContextProvider>
      </TokenTapProvider>
    </PrizeTapProvider>
  );
};

export const useTasks = () => {
  return useContext(TaskContext);
};

const TaskContextProvider = ({ children }: PropsWithChildren) => {
  const [search, setSearch] = useState("");
  const { rafflesList, changeSearchPhrase: setPrizeTapSearch } =
    usePrizeTapContext();
  const { tokensList, changeSearchPhrase: setTokenTapSearch } =
    useTokenTapContext();

  const tasks = useMemo(() => {
    const combinedList = [...rafflesList, ...tokensList];

    return combinedList.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [search, tokensList, rafflesList]);

  useEffect(() => {
    setPrizeTapSearch(search);
    setTokenTapSearch?.(search);
  }, [search, setPrizeTapSearch, setTokenTapSearch]);

  return (
    <TaskContext.Provider value={{ tasks, search, setSearch }}>
      {children}
    </TaskContext.Provider>
  );
};
