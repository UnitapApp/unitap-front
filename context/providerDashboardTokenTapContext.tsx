"use client";

import { NullCallback } from "@/utils";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const ProviderDashboardTokenTapContext = createContext<{
  name: string;
  setName: (name: string) => void;
  age: number;
  setAge: (age: number) => void;
  filledPages: boolean[];
  setFilledPages: (age: boolean[]) => void;
}>({
  name: "",
  setName: NullCallback,
  age: 0,
  setAge: NullCallback,
  filledPages: [false, false, false, false],
  setFilledPages: NullCallback,
});

const ProviderDashboardTokenTapProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [name, setName] = useState("");
  const [filledPages, setFilledPages] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [age, setAge] = useState(0);

  useEffect(() => {
    // TODO:
  }, []);

  return (
    <ProviderDashboardTokenTapContext.Provider
      value={{
        name,
        setName,
        age,
        setAge,
        filledPages,
        setFilledPages,
      }}
    >
      {children}
    </ProviderDashboardTokenTapContext.Provider>
  );
};

export const useTokenTapFromContext = () => {
  return useContext(ProviderDashboardTokenTapContext);
};

export default ProviderDashboardTokenTapProvider;
