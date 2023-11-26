import { axiosInstance } from "."

export async function countUsersAPI() {
  const response = await axiosInstance.get<{ count: number }>(
    "/api/auth/user/count/"
  )

  return response.data.count
}

export async function countGasClaimedAPI() {
  const response = await axiosInstance.get<{ count: number }>(
    "/api/v1/claims/count/"
  )

  return response.data.count
}
