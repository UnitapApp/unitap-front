"use client";

import { useUserProfileContext } from "@/context/userProfile";
import { axiosInstance } from "@/utils/api/base";
import { useEffect } from "react";

const AxiosApiManager = () => {
  const { userToken } = useUserProfileContext();

  useEffect(() => {
    if (!userToken) {
      axiosInstance.defaults.headers.common["Authorization"] = null;
      return;
    }

    axiosInstance.defaults.headers.common["Authorization"] =
      `TOKEN ${userToken}`;
  }, [userToken]);

  return null;
};

export default AxiosApiManager;
