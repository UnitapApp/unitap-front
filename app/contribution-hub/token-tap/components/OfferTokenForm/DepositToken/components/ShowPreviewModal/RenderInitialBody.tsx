"use client";

import { ProviderDashboardFormDataProp } from "@/types";
import FormYouFilled from "./FormYouFilled";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import { ProviderDashboardButtonSubmit } from "@/app/contribution-hub/Buttons";
import {
  useNetworkSwitcher,
  useWalletAccount,
  useWalletNetwork,
} from "@/utils/wallet";
import { useGlobalContext } from "@/context/globalProvider";
import { useCallback, useMemo } from "react";

interface Prop {
  data: ProviderDashboardFormDataProp;
}

const RenderInitialBody = ({ data }: Prop) => {
  const {
    handleCreateDistribution,
    createRaffleLoading,
    createRaffleResponse,
  } = useTokenTapFromContext();
  const { address, isConnected } = useWalletAccount();
  const { chain } = useWalletNetwork();

  const chainId = chain?.id;
  const { switchChain } = useNetworkSwitcher();
  const { setIsWalletPromptOpen } = useGlobalContext();

  const isRightChain = useMemo(() => {
    if (!isConnected || !chainId || !data.selectedChain) return false;
    return chainId === Number(data.selectedChain.chainId);
  }, [data.selectedChain, isConnected, chainId]);
  const handleCheckConnection = useCallback(async () => {
    if (!isConnected) {
      setIsWalletPromptOpen(true);
      return;
    }
    if (!chainId || !data.selectedChain || !address) return;
    if (!isRightChain) {
      await switchChain(Number(data.selectedChain.chainId));
      return;
    }
  }, [
    isConnected,
    chainId,
    data.selectedChain,
    address,
    isRightChain,
    switchChain,
    setIsWalletPromptOpen,
  ]);
  return (
    <div className="flex flex-col select-none">
      <div className="text-gray100 text-sm ">
        This is how your card will appear. If you are sure of the accuracy of
        the form you filled out, please submit your contribution.
      </div>
      <FormYouFilled data={data} />
      {address && !isRightChain && data.selectedChain ? (
        <div className="w-full flex items-end justify-end">
          <div className="w-[200px]">
            <ProviderDashboardButtonSubmit
              onClick={handleCheckConnection}
              $width="100%"
              className="text-sm md:text-xs lg:text-sm mt-5"
              data-testid="fund-action"
            >
              Switch Network
            </ProviderDashboardButtonSubmit>
          </div>
        </div>
      ) : !address ? (
        <div className="w-full flex items-end justify-end">
          <div className="w-[200px]">
            <ProviderDashboardButtonSubmit
              onClick={handleCheckConnection}
              height="2.8rem"
              className="!w-full  text-white max-w-[452px] "
              $fontSize="14px"
              data-testid="fund-action"
            >
              Connect Wallet
            </ProviderDashboardButtonSubmit>
          </div>
        </div>
      ) : (
        <div className="w-full flex items-end justify-end">
          <div className="w-[200px]">
            <ProviderDashboardButtonSubmit
              onClick={handleCreateDistribution}
              $width="100%"
              className="text-sm md:text-xs lg:text-sm mt-5"
              disabled={createRaffleLoading}
            >
              {createRaffleLoading ? (
                <p>Submit Contribution...</p>
              ) : createRaffleResponse?.state === "Retry" ? (
                <p>Retry</p>
              ) : (
                <p>Submit Contribution</p>
              )}
            </ProviderDashboardButtonSubmit>
          </div>
        </div>
      )}
    </div>
  );
};

export default RenderInitialBody;
