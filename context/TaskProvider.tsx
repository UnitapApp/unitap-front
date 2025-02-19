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
import { Chain, Prize, Token } from "@/types";

export interface TaskProviderProps extends PropsWithChildren {
  raffles: Prize[];
  tokens: Token[];
}

export const TaskContext = createContext({
  tasks: [] as (Prize | Token)[],
  search: "",
  setSearch: (search: string) => { },
  chains: [] as Chain[],
  selectedChain: null as number | null | undefined,
  setSelectedChain: (chain: number | null | undefined) => { },
  filter: "all" as "all" | "raffle" | "fcfs",
  setFilter: (filter: "all" | "raffle" | "fcfs") => { },
});

export const TaskProvider: FC<TaskProviderProps> = ({
  children,
  raffles,
  tokens,
}) => {
  const allChains = useMemo(() => {
    const chains = {} as Record<string, Chain>;

    [...raffles, ...tokens].forEach((item) => {
      chains[item.chain.pk] = item.chain;
    });

    return Object.values(chains);
  }, [raffles, tokens]);

  const [selectedChain, setSelectedChain] = useState<number | null | undefined>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "raffle" | "fcfs">("all");

  return (
    <PrizeTapProvider raffles={raffles}>
      <TokenTapProvider tokens={tokens}>
        <TaskContextProvider chains={allChains} selectedChain={selectedChain} setSelectedChain={setSelectedChain} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} >{children}</TaskContextProvider>
      </TokenTapProvider>
    </PrizeTapProvider>
  );
};

export const useTasks = () => {
  return useContext(TaskContext);
};

const TaskContextProvider = ({ children, chains, filter, search, selectedChain, setFilter, setSearch, setSelectedChain }: PropsWithChildren & { chains: Chain[]; selectedChain: number | null | undefined; setSelectedChain: (chain: number | null | undefined) => void; search: string; setSearch: (search: string) => void; filter: "all" | "raffle" | "fcfs"; setFilter: (filter: "all" | "raffle" | "fcfs") => void; }) => {
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
    <TaskContext.Provider value={{ tasks, search, setSearch, filter, setFilter, selectedChain, setSelectedChain, chains }}>
      {children}
    </TaskContext.Provider>
  );
};
