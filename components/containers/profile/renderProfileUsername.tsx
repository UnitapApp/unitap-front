"use client";

import { useUserProfileContext } from "@/context/userProfile";

const RenderProfileUsername = () => {
  const { userProfile } = useUserProfileContext();

  return <h5>@ {userProfile?.username ?? "CNA"}</h5>;
};

export default RenderProfileUsername;
