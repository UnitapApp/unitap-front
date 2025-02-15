import { FC, PropsWithChildren } from "react";
import PrizeTapProvider from "./prizeTapProvider";
import TokenTapProvider from "./tokenTapProvider";
import { Prize, Token } from "@/types";

export interface TaskProviderProps extends PropsWithChildren {
  raffles: Prize[];
  tokens: Token[];
}

export const TaskProvider: FC<TaskProviderProps> = ({
  children,
  raffles,
  tokens,
}) => {
  return (
    <PrizeTapProvider raffles={raffles}>
      <TokenTapProvider tokens={tokens}>{children}</TokenTapProvider>
    </PrizeTapProvider>
  );
};
