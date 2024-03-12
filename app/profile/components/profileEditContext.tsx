"use client";

import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import DeleteWalletModal from "./deleteWalletModal";
import { NullCallback } from "@/utils";
import { Address } from "viem";
import { UserConnection } from "@/types";
import { useFastRefresh } from "@/utils/hooks/refresh";
import { getAllConnections } from "@/utils/serverApis";
import { useUserProfileContext } from "@/context/userProfile";

export const ProfileEditContext = createContext<{
  focusedWalletDeleteAddress: Address | null;
  setFocusedWalletDeleteAddress: (walletPk: Address | null) => void;
  connections: UserConnection;
  addConnection: (key: string, data: any) => void;
}>({
  focusedWalletDeleteAddress: null,
  setFocusedWalletDeleteAddress: NullCallback,
  connections: {},
  addConnection: NullCallback,
});

export const useProfileEditContext = () => useContext(ProfileEditContext);

const ProfileEditProvider: FC<
  PropsWithChildren & { initialConnections: UserConnection }
> = ({ children, initialConnections }) => {
  const [focusedWalletDeleteAddress, setFocusedWalletDeleteAddress] =
    useState<Address | null>(null);

  const [connections, setConnections] = useState(initialConnections ?? []);
  const { userToken } = useUserProfileContext();

  useFastRefresh(() => {
    if (!userToken) return;

    getAllConnections(userToken).then((res) => {
      setConnections(res);
    });
  }, [userToken]);

  return (
    <ProfileEditContext.Provider
      value={{
        focusedWalletDeleteAddress,
        setFocusedWalletDeleteAddress,
        connections,
        addConnection: (key: string, data: any) =>
          setConnections({ ...connections, [key]: data }),
      }}
    >
      {children}
      <DeleteWalletModal />
    </ProfileEditContext.Provider>
  );
};

export default ProfileEditProvider;
