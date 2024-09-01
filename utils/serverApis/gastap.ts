import { ClaimReceipt, Faucet, FuelChampion } from "@/types";
import { convertFaucetToChain, serverFetch } from "../api";

export const getFaucetListServer = async () => {
  const data = await serverFetch("/api/gastap/faucet/list/");

  return data.map((item: Faucet) => convertFaucetToChain(item));
};

export const getClaimedReceiptsServer = async (token?: string) => {
  if (!token) return [];

  const res = await serverFetch("/api/gastap/user/claims/", {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (!Array.isArray(res)) return [];

  return res.map((item) => ({
    ...item,
    chain: convertFaucetToChain((item as any).faucet),
  }));
};

export const getOneTimeClaimedReceiptsServer = async (token?: string) => {
  if (!token) return [];

  const res = await serverFetch("/api/gastap/user/one-time-claims/", {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (!Array.isArray(res)) return [];

  return res.map((item) => ({
    ...item,
    chain: convertFaucetToChain((item as any).faucet),
  })) as ClaimReceipt[];
};

export async function getFuelChampionListServerSide() {
  const response = await serverFetch("/api/gastap/fuel-champion");

  return response as FuelChampion[];
}
