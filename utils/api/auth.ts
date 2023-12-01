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
