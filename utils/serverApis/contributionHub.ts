import {
  UserRafflesProps,
  ConstraintProps,
  UserTokenDistribution,
} from "@/types";

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

export const getUserDistributionListServerSide = async (token?: string) => {
  if (!token) return [];
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL! +
      "/api/tokentap/user-token-distributions/",
    {
      cache: "no-store",
      headers: {
        Authorization: `token ${token}`,
      },
    }
  ).then((res) => res.json());

  if (!Array.isArray(res)) return [];

  return res as UserTokenDistribution[];
};

export const getConstraintListServer = async () => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/prizetap/get-constraints/",
    {
      cache: "no-store",
    }
  ).then((res) => res.json());

  if (typeof res !== "object") return {};

  return res as { [key: string]: ConstraintProps[] };
};

export const getTokenTapConstraintListServer = async () => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/tokentap/get-constraints/",
    {
      cache: "no-store",
    }
  ).then((res) => res.json());

  if (typeof res !== "object") return {};

  return res as { [key: string]: ConstraintProps[] };
};

export const getUserDonationsServer = async (token?: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL! +
      "/api/gastap/user/donation/?page=1&page_size=2",
    {
      cache: "no-store",
      headers: {
        Authorization: `token ${token}`,
      },
    }
  ).then((res) => res.json());
  return res;
};
