import { ConstraintProps } from "@/types";
import { axiosInstance } from "./base";

export async function createRaffleApi(token: string, raffleData: any) {
  const response = await axiosInstance.post<any>(
    `/api/prizetap/create-raffle/`,
    raffleData,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

export async function updateCreateRaffleTx(
  token: string,
  raffleID: number | undefined,
  txHash: string
) {
  const response = await axiosInstance.post<any>(
    `api/prizetap/set-raffle-tx/${raffleID}/`,
    { txHash },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
}

export async function getProviderDashboardValidChain() {
  const response = await axiosInstance.get(`/api/prizetap/get-valid-chains/`);
  return response.data.data;
}

export async function getTokenTapValidChain() {
  const response = await axiosInstance.get(`/api/tokentap/get-valid-chains/`);
  return response.data.data;
}

export async function getUserRaffles(token: string) {
  const response = await axiosInstance.get(`/api/prizetap/get-user-raffles/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  return response.data;
}



export const getUserDistributions = async (token: string) => {
  const response = await axiosInstance.get(`/api/tokentap/token-distribution-list/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  return response.data;
};

export async function getConstraintsApi() {
  const response = await axiosInstance.get<ConstraintProps[]>(
    `/api/prizetap/get-constraints/`
  );
  return response.data;
}


export async function createTokenDistribution(token: string, data: any) {
  const response = await axiosInstance.post<any>(
    `/api/tokentap/create-token-distribution/`,
    data,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}