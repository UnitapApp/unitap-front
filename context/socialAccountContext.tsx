import { UserConnection } from "@/types";
import { NullCallback } from "@/utils";
import { useContext, createContext } from "react";

export const useSocialACcountContext = () => useContext(SocialAccountContext);

export const SocialAccountContext = createContext<{
  connections: UserConnection;
  addConnection: (key: string, data: any) => void;
}>({
  connections: {},
  addConnection: NullCallback,
});
