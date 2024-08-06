import { FC, PropsWithChildren } from "react";
import { cookies } from "next/headers";
import { getFaucetListServer } from "@/utils/serverApis";
import { Chain } from "@/types";

const HackaThonLayout: FC<PropsWithChildren> = async ({ children }) => {
  const cookieStore = cookies();

  return <>{children}</>;
};

export default HackaThonLayout;
