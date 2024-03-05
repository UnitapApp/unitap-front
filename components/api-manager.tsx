"use client";

import { useUserProfileContext } from "@/context/userProfile";
import { axiosInstance } from "@/utils/api/base";
import { FC, useEffect } from "react";

const ApiManager: FC = () => {
  const { userToken } = useUserProfileContext();

  useEffect(() => {
    if (!userToken) {
      axiosInstance.defaults.headers.common["Authorization"] = null;
    } else {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `JWT ${userToken}`;
    }
  }, [userToken]);

  return null;
};

export default ApiManager;
