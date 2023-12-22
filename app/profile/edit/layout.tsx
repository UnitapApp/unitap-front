import WalletProvider from "@/context/walletProvider";
import { FC, PropsWithChildren } from "react";

const ProfileEditLayout: FC<PropsWithChildren> = ({ children }) => {
  return <WalletProvider>{children}</WalletProvider>;
};

export default ProfileEditLayout;
