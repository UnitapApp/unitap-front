import { Settings } from "@/types";
import { axiosInstance } from ".";
import { Chain, ClaimReceipt } from "@/types/gas-tap";

export async function getWeeklyChainClaimLimitAPI() {
  const response = await axiosInstance.get<Settings>("/api/v1/settings/");
  return response.data;
}

export async function getRemainingClaimsAPI(token: string) {
  const response = await axiosInstance.get("/api/v1/user/remainig-claims/", {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return response.data;
}

export async function getChainList() {
  const response = await axiosInstance.get<Chain[]>("/api/v1/chain/list/");
  return response.data;
}

export async function getActiveClaimHistory(token: string) {
  const response = await axiosInstance.get<ClaimReceipt[]>(
    "/api/v1/user/claims/",
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
    `/api/v1/chain/${chainPk}/claim-max/`,
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
    `/api/v1/chain/${chainPk}/claim-max/`,
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
    "/api/v1/user/donation/",
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
