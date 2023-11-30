import { ClaimTokenResponse, ClaimedToken, Token } from "@/types/token-tap"
import { axiosInstance } from "."

export async function getTokensListAPI() {
  const response = await axiosInstance.get<Token[]>(
    "/api/tokentap/token-distribution-list/"
  )
  return response.data
}

export async function getClaimedTokensListAPI(token: string) {
  const response = await axiosInstance.get<ClaimedToken[]>(
    "/api/tokentap/claims-list/",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  )
  return response.data
}

export async function claimTokenAPI(
  token: string,
  tokenId: number,
  body?: any
) {
  const response = await axiosInstance.post<ClaimTokenResponse>(
    `/api/tokentap/token-distribution/${tokenId}/claim/`,
    body ?? {},
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  )
  return response.data.signature
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
  )
  return response.data
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
  )

  return response.data
}
