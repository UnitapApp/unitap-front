import {
  ClaimTokenResponse,
  ClaimedToken,
  ShieldSignatureResponse,
  Token,
} from "@/types/tokentap";
import { axiosInstance } from "./base";

export async function getTokensListAPI() {
  const response = await axiosInstance.get<Token[]>(
    "/api/tokentap/token-distribution-list/"
  );

  return response.data.filter((item) => item.status === "VERIFIED");
}

export async function tokenClaimSignatureApi(
  claimId: number,
  distributionId: number,
  contractAddress: string
) {
  const res = await axiosInstance.get<ShieldSignatureResponse>(
    `https://shield.unitap.app/v1/?app=${
      process.env.NEXT_PUBLIC_IS_STAGE === "1" ? "stage_unitap" : "unitap"
    }&method=claim-token&params[claimId]=${claimId}&distributionId=${distributionId}&contract=${contractAddress}`
  );

  return res.data;
}

export async function getClaimedTokensListAPI(token: string) {
  const response = await axiosInstance.get<ClaimedToken[]>(
    "/api/tokentap/claims-list/",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
}

export async function claimTokenAPI(
  token: string,
  tokenId: number,
  address: string,
  body?: any
) {
  const response = await axiosInstance.post<ClaimTokenResponse>(
    `/api/tokentap/token-distribution/${tokenId}/claim/`,
    body
      ? { ...body, userWalletAddress: address }
      : { userWalletAddress: address },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data.signature;
}

export async function updateClaimFinished(
  token: string,
  claimId: number,
  txHash: string
) {
  const response = await axiosInstance.post<any>(
    `/api/tokentap/claims-list/${claimId}/update/`,
    { txHash },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
}

export async function getTokenConstraintsVerifications(
  tokenPk: number,
  token: string
) {
  const response = await axiosInstance.get(
    "/api/tokentap/get-token-constraints/" + tokenPk + "/",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
}
