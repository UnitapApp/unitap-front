import { UserProfile } from "@/types";
import { axiosInstance } from "./base";

export const ConnectBrightIdApi = async (
  address: string,
  signature: string,
  userToken: string
) => {
  const response = await axiosInstance.post<UserProfile>(
    `/api/auth/user/connect/brightid/`,
    {
      address,
      signature,
    },
    {
      headers: {
        Authorization: `token ${userToken}`,
      },
    }
  );

  return response.data;
};
