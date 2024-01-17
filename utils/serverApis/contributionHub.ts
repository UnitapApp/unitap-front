import { UserRafflesProps, ConstraintProps } from "@/types";

export const getUserRaffleListServerSide = async (token?: string) => {
  if (!token) return [];
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/prizetap/get-user-raffles/",
    {
      cache: "no-store",
      headers: {
        Authorization: `token ${token}`,
      },
    }
  ).then((res) => res.json());

  if (!Array.isArray(res)) return [];

  return res as UserRafflesProps[];
};

export const getConstraintListServer = async () => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/prizetap/get-constraints/",
    {
      cache: "no-store"
    }
  ).then((res) => res.json());

  if(!Array.isArray(res)) return [];

  return res as ConstraintProps[]

}