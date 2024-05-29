import { cookies } from "next/headers";
import { getAllConnections } from "@/utils/serverApis";
import { UserConnection } from "@/types";
import { redirect } from "next/navigation";
import { FC, PropsWithChildren } from "react";
import SocialAccountContent from "./content";

const SocialAccountsLayout: FC<PropsWithChildren> = async () => {
  const cookiesStore = cookies();

  let connections: UserConnection;

  try {
    connections = await getAllConnections(cookiesStore.get("userToken")?.value);
  } catch (e) {
    redirect("/");
  }

  return (
    <div className="mt-5 rounded-xl bg-gray20 p-5">
      <p>Social Accounts </p>

      <SocialAccountContent initialConnections={connections} />
    </div>
  );
};

export default SocialAccountsLayout;
