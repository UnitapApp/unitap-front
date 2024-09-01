import {
  UserRafflesProps,
  ConstraintProps,
  UserTokenDistribution,
} from "@/types";
import { serverFetch } from "../api";

export const getUserRaffleListServerSide = async (token?: string) => {
  if (!token) return [];
  const res = await serverFetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/prizetap/get-user-raffles/",
    {
      headers: {
        Authorization: `token ${token}`,
      },
    },
  );

  if (!Array.isArray(res)) return [];

  return res as UserRafflesProps[];
};

export const getUserDistributionListServerSide = async (token?: string) => {
  if (!token) return [];
  const res = await serverFetch("/api/tokentap/user-token-distributions/", {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (!Array.isArray(res)) return [];

  return res as UserTokenDistribution[];
};

export const getConstraintListServer = async () => {
  const res = await serverFetch("/api/prizetap/get-constraints/");

  if (typeof res !== "object") return {};

  return res as { [key: string]: ConstraintProps[] };
};

export const getTokenTapConstraintListServer = async () => {
  const res = await serverFetch("/api/tokentap/get-constraints/");

  if (typeof res !== "object") return {};

  return res as { [key: string]: ConstraintProps[] };
};

export const getUserDonationsServer = async (token?: string) => {
  const res = await serverFetch(
    "/api/gastap/user/donation/?page=1&page_size=2",
    {
      headers: {
        Authorization: `token ${token}`,
      },
    },
  );

  return res;
};
