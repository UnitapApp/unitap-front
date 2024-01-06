import { Settings } from "@/types";
import { axiosInstance } from ".";
import { Chain, ClaimReceipt } from "@/types/gas-tap";

export async function getWeeklyChainClaimLimitAPI() {
  const response = await axiosInstance.get<Settings>("/api/gastap/settings/");
  return response.data;
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
  const response = await axiosInstance.get<Chain[]>("/api/gastap/chain/list/");
  return response.data;
}

export async function getOneTimeClaimedChainList(token: string) {
  const response = await axiosInstance.get(
    "/api/gastap/user/one-time-claims/",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
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

  return response.data;
}

export async function claimMax(token: string, chainPk: number) {
  const response = await axiosInstance.post<ClaimReceipt>(
    `/api/gastap/chain/${chainPk}/claim-max/`,
    null,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
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
      chainPk,
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
