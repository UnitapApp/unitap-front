import { axiosInstance } from "./base";

export async function countUsersAPI() {
  const response = await axiosInstance.get<{ count: number }>(
    "/api/auth/user/count/"
  );

  return response.data.count;
}

export async function countGasClaimedAPI() {
  const response = await axiosInstance.get<{ count: number }>(
    "/api/gastap/claims/count/"
  );

  return response.data.count;
}
