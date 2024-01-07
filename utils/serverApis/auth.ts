export const getUserHistory = async (token?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/auth/user/history-count/",
    {
      cache: "no-store",
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );

  const data = await res.json();

  return data as { gasClaim: number; tokenClaim: number; raffleWin: number };
};
