import { cookies } from "next/headers";
import { getAllConnections } from "@/utils/serverApis";
import { UserConnection } from "@/types";
import { redirect } from "next/navigation";
import { FC, PropsWithChildren } from "react";
import SocialAccountsPage from "./page";

const SocialAccountsLayout: FC<PropsWithChildren> = async () => {
  const cookiesStore = cookies();

  let connections: UserConnection;

  try {
    connections = await getAllConnections(cookiesStore.get("userToken")?.value);
    console.log(cookiesStore.get("userToken"));
  } catch (e) {
    redirect("/");
  }

  return (
    <div className="mt-5 bg-gray20 rounded-xl p-5">
      <p>Social Accounts </p>

      <SocialAccountsPage initialConnections={connections} />
    </div>
  );
};

export default SocialAccountsLayout;
