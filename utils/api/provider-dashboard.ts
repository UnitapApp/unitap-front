import { ConstraintProps } from "@/types";
import { axiosInstance } from "./base";

export async function createRaffleApi(token: string, raffleData: any) {
  const response = await axiosInstance.post<any>(
    `/api/prizetap/create-raffle/`,
    raffleData,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data",
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
  const response = await axiosInstance.get(
    `/api/tokentap/user-token-distributions/`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};

export async function getConstraintsApi() {
  const response = await axiosInstance.get<{
    [key: string]: ConstraintProps[];
  }>(`/api/prizetap/get-constraints/`);
  return response.data;
}

export async function createTokenDistribution(token: string, data: any) {
  const response = await axiosInstance.post<any>(
    `/api/tokentap/create-token-distribution/`,
    data,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export const getUserDonations = async (token: string) => {
  const response = await axiosInstance.get(
    `/api/gastap/user/donation/?page=1`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};
