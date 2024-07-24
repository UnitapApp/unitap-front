"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Chain } from "@/types";
import ClaimLightningContent from "./ClaimLightningContent";

import TokenPermissions from "../Permissions";
import { useWalletNetwork } from "@/utils/wallet";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import { useUserProfileContext } from "@/context/userProfile";
import Modal from "@/components/ui/Modal/modal";
import MaxedOutBody from "./MaxedOutBody";
import BrightNotConnectedBody from "./BrightNotConnectedBody";
import SuccessBody from "./SuccessBody";
import WrongNetworkBody from "./WrongNetworkBody";
import InitialBody from "./InitialBody";
import TokenReservedBody from "./TokenReservedBody";
import { formatDate } from "../TokenCard";
import TokenRequirementModal from "./TokenRequirementModal";

export type ModalSize = number | "small" | "large" | "medium";

const ClaimTokenModalBody = ({
  chain,
  setSize,
  size,
}: {
  chain: Chain;

  size: ModalSize;
  setSize: (value: ModalSize) => void;
}) => {
  const { chain: activatedChain } = useWalletNetwork();

  const chainId = activatedChain?.id;

  const [isPermissionsVerified, setIsPermissionsVerified] = useState(false);

  const {
    selectedTokenForClaim,
    claimedTokensList,
    claimTokenLoading,
    claimTokenResponse,
    method,
  } = useTokenTapContext();

  const { userProfile, tokentapRoundClaimLimit } = useUserProfileContext();

  const collectedToken = claimedTokensList.find(
    (item) => item.tokenDistribution.id === selectedTokenForClaim!.id,
  );

  useEffect(() => {
    if (
      !selectedTokenForClaim ||
      !userProfile ||
      (userProfile.upBalance == 0 &&
        formattedDateValue !== -1 &&
        selectedTokenForClaim.remainingClaimForUnitapPassUser &&
        selectedTokenForClaim.maxNumberOfClaims -
          selectedTokenForClaim.numberOfClaims <
          selectedTokenForClaim.remainingClaimForUnitapPassUser) ||
      claimTokenResponse?.state === "Done" ||
      collectedToken?.status === "Verified" ||
      selectedTokenForClaim.isExpired ||
      method !== "requirements"
    ) {
      setSize("small");
    } else {
      setSize(650);
    }
  }, [userProfile, selectedTokenForClaim, chainId, collectedToken]);

  if (!selectedTokenForClaim) return null;

  if (!userProfile)
    return (
      <BrightNotConnectedBody
        chainPk={selectedTokenForClaim.chain.pk}
        imageUrl={selectedTokenForClaim.imageUrl}
      />
    );

  const formattedDateValue = formatDate(
    new Date(selectedTokenForClaim.claimDeadlineForUnitapPassUser),
  );

  if (
    userProfile.upBalance == 0 &&
    formattedDateValue !== -1 &&
    selectedTokenForClaim.remainingClaimForUnitapPassUser &&
    selectedTokenForClaim.maxNumberOfClaims -
      selectedTokenForClaim.numberOfClaims <
      selectedTokenForClaim.remainingClaimForUnitapPassUser
  )
    return <TokenReservedBody token={selectedTokenForClaim!} />;

  if (
    claimTokenResponse?.state === "Done" ||
    collectedToken?.status === "Verified"
  )
    return <SuccessBody token={selectedTokenForClaim} />;

  if (selectedTokenForClaim.isExpired)
    return <MaxedOutBody token={selectedTokenForClaim} />;

  if (method === "requirements") {
    return <TokenRequirementModal token={selectedTokenForClaim} />;
  }

  if (chainId?.toString() !== selectedTokenForClaim?.chain.chainId)
    return (
      <WrongNetworkBody
        chain={selectedTokenForClaim.chain}
        imageUrl={selectedTokenForClaim.imageUrl}
      />
    );

  if (
    claimTokenResponse?.state === "Pending" ||
    collectedToken?.status === "Pending"
  ) {
    return <InitialBody token={selectedTokenForClaim} />;
  }

  if (selectedTokenForClaim.isMaxedOut)
    return <MaxedOutBody token={selectedTokenForClaim} />;

  if (!isPermissionsVerified)
    return (
      <TokenPermissions
        token={selectedTokenForClaim}
        onClose={() => setIsPermissionsVerified(true)}
      />
    );

  return <InitialBody token={selectedTokenForClaim} />;
};

const ClaimTokenModal = () => {
  const { selectedTokenForClaim, setSelectedTokenForClaim, method } =
    useTokenTapContext();

  const [size, setSize] = useState<ModalSize>("small");

  const closeClaimTokenModal = useCallback(() => {
    setSelectedTokenForClaim(null);
  }, [setSelectedTokenForClaim]);

  const isOpen = useMemo(() => {
    return !!selectedTokenForClaim;
  }, [selectedTokenForClaim]);

  if (!selectedTokenForClaim) return null;

  const tokenAmount =
    selectedTokenForClaim.chain.chainName === "Lightning"
      ? selectedTokenForClaim.amount
      : selectedTokenForClaim.amount /
        10 **
          (selectedTokenForClaim.decimals ??
            selectedTokenForClaim.chain.decimals);

  return (
    <Modal
      title={`Claim ${tokenAmount} ${selectedTokenForClaim.token}`}
      size={size}
      closeModalHandler={closeClaimTokenModal}
      isOpen={isOpen}
    >
      <div className="claim-modal-wrapper flex flex-col items-center justify-center pt-5">
        {selectedTokenForClaim.chain.chainName === "Lightning" ? (
          <ClaimLightningContent chain={selectedTokenForClaim.chain} />
        ) : (
          <ClaimTokenModalBody
            size={size}
            setSize={setSize}
            chain={selectedTokenForClaim.chain}
          />
        )}
      </div>
    </Modal>
  );
};
export default ClaimTokenModal;
