import { FC, PropsWithChildren } from "react";
import TokenTapProvider from "@/context/providerDashboardTokenTapContext";
import { cookies } from "next/headers";
import { getUserDistributionListServerSide } from "@/utils/serverApis";
import { redirect } from "next/navigation";

const ProviderDashboardVerificationLayout: FC<
  PropsWithChildren & { params: Promise<{ id: string }> }
> = async (props) => {
  const params = await props.params;

  const { children } = props;

  const cookieStore = await cookies();

  const distributions = await getUserDistributionListServerSide(
    cookieStore.get("userToken")!.value,
  );

  const distribution = distributions.find(
    (item) => item.id === Number(params.id),
  );

  if (!distribution) {
    redirect("/dashboard/token-tap");
  }
  return (
    <TokenTapProvider distributionInit={distribution}>
      {children}
    </TokenTapProvider>
  );
};

export default ProviderDashboardVerificationLayout;
