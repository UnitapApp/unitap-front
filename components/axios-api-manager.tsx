"use client";

import { useUserProfileContext } from "@/context/userProfile";
import { axiosInstance } from "@/utils/api/base";
import { useEffect } from "react";

const AxiosApiManager = () => {
  const { userToken } = useUserProfileContext();

  useEffect(() => {
    const token = userToken ?? localStorage.getItem("userToken");

    if (!token) {
      axiosInstance.defaults.headers.common["Authorization"] = null;
      return;
    }

    axiosInstance.defaults.headers.common["Authorization"] = `TOKEN ${token}`;
  }, [userToken]);

  return null;
};

export default AxiosApiManager;
