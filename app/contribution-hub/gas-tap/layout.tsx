import { getUserDonationsServer } from "@/utils/serverApis";
import { cookies } from "next/headers";
import { FC, PropsWithChildren } from "react";

const ProviderDashboardGasTapLayout: FC<PropsWithChildren> = async ({
  children,
}) => {
  const cookieStore = cookies();
  const token = cookieStore.get("userToken");
  const userDonationList = await getUserDonationsServer(token!.value);
  console.log(userDonationList);
  return <>{children}</>;
};

export default ProviderDashboardGasTapLayout;
