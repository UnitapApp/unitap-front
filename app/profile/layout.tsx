import { FC, PropsWithChildren, ReactNode } from "react";
import DeleteWalletModal from "./components/deleteWalletModal";
import ProfileEditProvider from "./components/profileEditContext";
import { cookies } from "next/headers";
import { getAllConnections } from "@/utils/serverApis";
import { redirect } from "next/navigation";
import { UserConnection } from "@/types";

const ProfileEditLayout: FC<
  PropsWithChildren & { socialAccounts: ReactNode }
> = async ({ children, socialAccounts }) => {
  const cookiesStore = cookies();

  let connections: UserConnection;

  try {
    connections = await getAllConnections(cookiesStore.get("userToken")?.value);
  } catch (e) {
    redirect("/");
  }

  return (
    <ProfileEditProvider initialConnections={connections}>
      {children}
      {socialAccounts}
      <DeleteWalletModal />
    </ProfileEditProvider>
  );
};

export default ProfileEditLayout;
