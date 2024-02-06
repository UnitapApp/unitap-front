import { Settings } from "@/types";
import { axiosInstance } from "./base";
import { Chain, ClaimReceipt, Faucet, FuelChampion } from "@/types/gastap";

export const convertFaucetToChain = (faucet: Faucet) => {
  return {
    ...faucet.chain,
    ...faucet,
    chainPk: faucet.chain.pk,
  } as Chain;
};

export const snakeToCamel = (str: string) => {
  return str.replace(/_([a-z])/g, function (match, group) {
    return group.toUpperCase();
  });
};

export const parseFieldSetting = (value: string) => {
  if (value === "True") return true;
  if (value === "False") return false;

  if (!isNaN(value as any)) return Number(value);

  return value;
};

export async function getWeeklyChainClaimLimitAPI() {
  const response = await axiosInstance.get<{ index: string; value: string }[]>(
    "/api/gastap/settings/"
  );

  const result: Settings = response.data.reduce((prev, curr) => {
    (prev as any)[snakeToCamel(curr.index)] = parseFieldSetting(curr.value);
    return prev;
  }, {} as Settings);

  return result;
}

export async function getRemainingClaimsAPI(token: string) {
  const response = await axiosInstance.get(
    "/api/gastap/user/remainig-claims/",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
}

export async function getChainList() {
  const response = await axiosInstance.get<Faucet[]>(
    "/api/gastap/faucet/list/"
  );
  return response.data.map((item) => convertFaucetToChain(item));
}

export async function getOneTimeClaimedChainList(token: string) {
  const response = await axiosInstance.get<ClaimReceipt[]>(
    "/api/gastap/user/one-time-claims/",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data.map((item) => ({
    ...item,
    chain: convertFaucetToChain((item as any).faucet),
  }));
}

export async function getActiveClaimHistory(token: string) {
  const response = await axiosInstance.get<ClaimReceipt[]>(
    "/api/gastap/user/claims/",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data.map((item) => ({
    ...item,
    chain: convertFaucetToChain((item as any).faucet),
  }));
}

export async function claimMax(
  token: string,
  chainPk: number,
  address: string
) {
  const response = await axiosInstance.post<ClaimReceipt>(
    `/api/gastap/faucet/${chainPk}/claim-max/`,
    {
      address,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return {
    ...response.data,
    chain: convertFaucetToChain((response.data as any).faucet),
  };
}

export async function claimMaxNonEVMAPI(
  token: string,
  chainPk: number,
  address: string
) {
  const response = await axiosInstance.post<ClaimReceipt>(
    `/api/gastap/chain/${chainPk}/claim-max/`,
    { address: address },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
}

export async function submitDonationTxHash(
  txHash: string,
  chainPk: number,
  token: string
) {
  const response = await axiosInstance.post(
    "/api/gastap/user/donation/",
    {
      txHash,
      faucetPk: chainPk,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
}

export async function getUserDonation(token: string, page = 1) {
  const response = await axiosInstance.get(
    `api/v1/user/donation?chain_pk=9&page_size=${page}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  console.log(response.data);
}

export async function getFuelChampionList() {
  const response = await axiosInstance.get<FuelChampion[]>(
    "/api/gastap/fuel-champion"
  );

  return response.data;
}
