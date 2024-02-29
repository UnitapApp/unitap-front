import TokenTapProvider from "@/context/providerDashboardTokenTapContext";
import { getUserDistributionListServerSide } from "@/utils/serverApis";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FC, PropsWithChildren } from "react";

const ProviderDashboardDetailsLayout: FC<
  PropsWithChildren & { params: { id: string } }
> = async ({ children, params }) => {
  const cookieStore = cookies();

  const distributions = await getUserDistributionListServerSide(
    cookieStore.get("userToken")!.value
  );

  const distribution = distributions.find(
    (item) => item.id === Number(params.id)
  );

  if (!distribution) {
    redirect("/contribution-hub/token-tap");
  }

  return (
    <TokenTapProvider distributionInit={distribution}>
      {children}
    </TokenTapProvider>
  );
};

export default ProviderDashboardDetailsLayout;
