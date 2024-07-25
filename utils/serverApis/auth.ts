import { UserConnection } from "@/types";

export const getUserHistory = async (token?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/auth/user/history-count/",
    {
      cache: "no-store",
      headers: {
        Authorization: `token ${token}`,
      },
    },
  );

  const data = await res.json();

  return data as { gasClaim: number; tokenClaim: number; raffleWin: number };
};

export const getAllConnections = async (token?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/auth/user/all-connections/",
    {
      cache: "no-store",
      headers: {
        Authorization: `token ${token}`,
      },
    },
  );

  const data = (await res.json()) as UserConnection[];

  const transformedData = data.reduce((prev, curr) => {
    const name = Object.keys(curr)[0];

    if (!curr[name].isConnected) return prev;

    prev[name] = curr[name];
    return prev;
  }, {} as UserConnection);

  return transformedData;
};
