import { serverFetch } from ".";

export async function countUsersAPI() {
  const response = (await serverFetch("/api/auth/user/count/")) as {
    count: number;
  };

  return response.count;
}

export async function countGasClaimedAPI() {
  const response = (await serverFetch("/api/gastap/claims/count/")) as {
    count: number;
  };

  return response.count;
}
