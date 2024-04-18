"use client";

import { useCallback, useMemo } from "react";
import { Chain } from "@/types";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import { useNetworkSwitcher, useWalletAccount } from "@/utils/wallet";
import { useUserProfileContext } from "@/context/userProfile";
import Modal from "@/components/ui/Modal/modal";
import InitialBody from "./enroll-body/InitialBody";
import BrightNotConnectedBody from "./enroll-body/BrightNotConnectedBody";
import SuccessBody from "./enroll-body/SuccessBody";
import WrongNetworkBody from "./enroll-body/WrongNetworkBody";
import WinnersModal from "./winnersModal";

const EnrollModalBody = ({ chain }: { chain: Chain }) => {
  const { userProfile } = useUserProfileContext();

  const { selectedNetwork } = useNetworkSwitcher();

  const chainId = selectedNetwork?.id;

  const { selectedRaffleForEnroll, method, claimOrEnrollWalletResponse } =
    usePrizeTapContext();

  if (method === "Winners") {
    return <WinnersModal />;
  }

  if (!selectedRaffleForEnroll) return null;

  if (!userProfile)
    return (
      <BrightNotConnectedBody
        method={method!}
        raffle={selectedRaffleForEnroll}
      />
    );

  if (claimOrEnrollWalletResponse?.state === "Done")
    return <SuccessBody method={method!} raffle={selectedRaffleForEnroll} />;

  if (!chainId || chainId.toString() !== selectedRaffleForEnroll?.chain.chainId)
    return <WrongNetworkBody raffle={selectedRaffleForEnroll} />;

  // if (selectedRaffleForEnroll.userEntry?.txHash) {
  //   return <SuccessBody method={method!} raffle={selectedRaffleForEnroll} />;
  // }

  return <InitialBody method={method!} raffle={selectedRaffleForEnroll} />;
};

const EnrollModal = () => {
  const { selectedRaffleForEnroll, setSelectedRaffleForEnroll, method } =
    usePrizeTapContext();

  const closeClaimTokenModal = useCallback(() => {
    setSelectedRaffleForEnroll(null);
  }, [setSelectedRaffleForEnroll]);

  const isOpen = useMemo(() => {
    return !!selectedRaffleForEnroll;
  }, [selectedRaffleForEnroll]);

  if (!selectedRaffleForEnroll) return null;

  return (
    <Modal
      title={`${
        method === "Verify" ? "Requirements" : selectedRaffleForEnroll.name
      }`}
      size="small"
      closeModalHandler={closeClaimTokenModal}
      isOpen={isOpen}
    >
      <div className="claim-modal-wrapper flex flex-col items-center justify-center pt-5">
        <EnrollModalBody chain={selectedRaffleForEnroll.chain} />
      </div>
    </Modal>
  );
};
export default EnrollModal;
