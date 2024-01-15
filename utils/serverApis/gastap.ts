import { ClaimReceipt, Faucet, FuelChampion } from "@/types";
import { convertFaucetToChain } from "../api";

export const getFaucetListServer = async () => {
  const chainsApi = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/gastap/faucet/list/",
    {
      cache: "no-store",
    }
  );

  const data = await chainsApi.json();

  return data.map((item: Faucet) => convertFaucetToChain(item));
};

export const getClaimedReceiptsServer = async (token?: string) => {
  if (!token) return [];

  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/gastap/user/claims/",
    {
      cache: "no-store",
      headers: {
        Authorization: `token ${token}`,
      },
    }
  ).then((res) => res.json());

  if (!Array.isArray(res)) return [];

  return res.map((item) => ({
    ...item,
    chain: convertFaucetToChain((item as any).faucet),
  }));
};

export const getOneTimeClaimedReceiptsServer = async (token?: string) => {
  if (!token) return [];

  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/gastap/user/one-time-claims/",
    {
      cache: "no-store",
      headers: {
        Authorization: `token ${token}`,
      },
    }
  ).then((res) => res.json());

  if (!Array.isArray(res)) return [];

  return res.map((item) => ({
    ...item,
    chain: convertFaucetToChain((item as any).faucet),
  })) as ClaimReceipt[];
};

export async function getFuelChampionListServerSide() {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + "/api/gastap/fuel-champion",
    {
      cache: "no-store",
    }
  ).then((res) => res.json());

  return response as FuelChampion[];
}
