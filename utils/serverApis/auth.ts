import { UserConnection } from "@/types";
import { serverFetch } from "../api";

export const getUserHistory = async (token?: string) => {
  const res = await serverFetch("/api/auth/user/history-count/", {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  const data = await res.json();

  return data as { gasClaim: number; tokenClaim: number; raffleWin: number };
};

export const getAllConnections = async (token?: string) => {
  const data = (await serverFetch("/api/auth/user/all-connections/", {
    headers: {
      Authorization: `token ${token}`,
    },
  })) as UserConnection[];

  const transformedData = data.reduce((prev, curr) => {
    const name = Object.keys(curr)[0];

    if (!curr[name].isConnected) return prev;

    prev[name] = curr[name];
    return prev;
  }, {} as UserConnection);

  return transformedData;
};
