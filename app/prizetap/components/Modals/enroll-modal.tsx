"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Chain } from "@/types";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import { useNetworkSwitcher } from "@/utils/wallet";
import Modal from "@/components/ui/Modal/modal";
import InitialBody from "./enroll-body/InitialBody";
import SuccessBody from "./enroll-body/SuccessBody";
import WrongNetworkBody from "./enroll-body/WrongNetworkBody";
import WinnersModal from "./winnersModal";
import { ModalSize } from "@/components/containers/token-tap/Modals/ClaimModal";
import PrizeRequirementModal from "./enroll-body/RaffleRequirementModal";
import RafflePermissions from "../permissions";

const EnrollModalBody = ({
  chain,
  setSize,
  size,
}: {
  chain: Chain;

  size: ModalSize;
  setSize: (value: ModalSize) => void;
}) => {
  // const { userProfile } = useUserProfileContext();

  const { selectedNetwork } = useNetworkSwitcher();

  const chainId = selectedNetwork?.id;

  const { selectedRaffleForEnroll, method, claimOrEnrollWalletResponse } =
    usePrizeTapContext();

  useEffect(() => {
    if (
      method === "Winners" ||
      !selectedRaffleForEnroll ||
      claimOrEnrollWalletResponse?.state === "Done" ||
      !chainId ||
      chainId.toString() !== selectedRaffleForEnroll?.chain.chainId ||
      (selectedRaffleForEnroll.userEntry?.txHash &&
        !selectedRaffleForEnroll.winnerEntries.length) ||
      method !== "Pre-Verify"
    ) {
      setSize("small");
    } else {
      setSize(680);
    }
  }, [method, selectedRaffleForEnroll, claimOrEnrollWalletResponse, chainId]);

  if (method === "Winners") {
    return <WinnersModal />;
  }

  if (!selectedRaffleForEnroll) return null;

  // if (!userProfile)
  //   return (
  //     <BrightNotConnectedBody
  //       method={method!}
  //       raffle={selectedRaffleForEnroll}
  //     />
  //   );

  if (claimOrEnrollWalletResponse?.state === "Done")
    return <SuccessBody method={method!} raffle={selectedRaffleForEnroll} />;

  if (method === "Pre-Verify") {
    return <PrizeRequirementModal prize={selectedRaffleForEnroll} />;
  }

  if (method === "Verify") {
    return <RafflePermissions raffle={selectedRaffleForEnroll} />;
  }

  if (!chainId || chainId.toString() !== selectedRaffleForEnroll?.chain.chainId)
    return (
      <WrongNetworkBody raffle={selectedRaffleForEnroll} method={method!} />
    );

  if (
    selectedRaffleForEnroll.userEntry?.txHash &&
    !selectedRaffleForEnroll.winnerEntries.length
  ) {
    return <SuccessBody method={method!} raffle={selectedRaffleForEnroll} />;
  }

  return <InitialBody method={method!} raffle={selectedRaffleForEnroll} />;
};

const EnrollModal = () => {
  const { selectedRaffleForEnroll, setSelectedRaffleForEnroll, method } =
    usePrizeTapContext();
  const [size, setSize] = useState<ModalSize>("small");

  const closeClaimTokenModal = useCallback(() => {
    setSelectedRaffleForEnroll(null);
  }, [setSelectedRaffleForEnroll]);

  const isOpen = useMemo(() => {
    return !!selectedRaffleForEnroll;
  }, [selectedRaffleForEnroll]);

  if (!selectedRaffleForEnroll) return null;

  // console.log(method);

  return (
    <Modal
      title={`${
        method === "Claim"
          ? "Claim prize"
          : method === "Winners"
            ? "Winners"
            : method === "Pre-Verify"
              ? "Requirements"
              : "Enroll"
      }`}
      size={size}
      closeModalHandler={closeClaimTokenModal}
      isOpen={isOpen}
    >
      <div className="claim-modal-wrapper flex flex-col items-center justify-center pt-5">
        <EnrollModalBody
          size={size}
          setSize={setSize}
          chain={selectedRaffleForEnroll.chain}
        />
      </div>
    </Modal>
  );
};
export default EnrollModal;
