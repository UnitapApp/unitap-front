import { UserProfile } from "@/types";
import { axiosInstance } from ".";

export async function getUserProfile(address: string, signature: string) {
  const response = await axiosInstance.post<UserProfile>(
    `/api/auth/user/login/`,
    {
      username: address,
      password: signature,
    }
  );
  return response.data;
}

export async function createUserProfile(address: string) {
  const response = await axiosInstance.post<UserProfile>(
    `/api/gastap/user/create/`,
    { address }
  );
  return response.data;
}

export async function checkUserExists(walletAddress: string): Promise<boolean> {
  const response = await axiosInstance.post<{ exists: boolean }>(
    "/api/auth/user/check-exists/",
    {
      walletAddress,
    }
  );

  return response.data.exists;
}

export async function loginOrRegister(
  walletAddress: string,
  signature: string,
  message: string
) {
  const response = await axiosInstance.post<UserProfile>(
    "/api/auth/user/wallet-login/",
    {
      walletAddress,
      signature,
      message,
    }
  );

  return response.data;
}

export async function getUserProfileWithTokenAPI(token: string) {
  const response = await axiosInstance.get<UserProfile>(
    `/api/auth/user/info/`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
}

export async function sponsorAPI(address: string) {
  const response = await axiosInstance.post("/api/auth/user/sponsor/", {
    address: address,
  });
  return response.data;
}

export async function setWalletAPI(
  token: string,
  wallet: string,
  walletType: string
) {
  const response = await axiosInstance.post(
    "/api/auth/user/set-wallet/",
    { walletType: walletType, address: wallet },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
}

export const setUsernameApi = async (username: string, userToken: string) => {
  const response = await axiosInstance.post(
    "/api/auth/user/set-username/",
    {
      username,
    },
    {
      headers: {
        Authorization: `Token ${userToken}`,
      },
    }
  );

  return response.data;
};
