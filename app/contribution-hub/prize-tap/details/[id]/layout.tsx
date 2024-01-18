import ProviderDashboard from "@/context/providerDashboardContext";
import { getUserRaffleListServerSide } from "@/utils/serverApis";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FC, PropsWithChildren } from "react";

const ProviderDashboardPrizeTapLayout: FC<
  PropsWithChildren & { params: { id: string } }
> = async ({ children, params }) => {
  const cookieStore = cookies();
  const raffles = await getUserRaffleListServerSide(
    cookieStore.get("userToken")!.value
  );

  const raffle = raffles.find((item) => item.pk === Number(params.id));

  if (!raffle) {
    redirect("/contribution-hub");
  }

  return (
    <ProviderDashboard rafflesInitial={raffle}>{children}</ProviderDashboard>
  );
};

export default ProviderDashboardPrizeTapLayout;
