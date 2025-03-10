"use client";

import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import { ClaimButton } from "@/components/ui/Button/button";
import { BrightIdModalState, Chain, ClaimReceiptState } from "@/types";
import { getChainClaimIcon } from "@/utils/chain";
import { formatWeiBalance } from "@/utils/numbers";
import {
  WalletNotConnectedBody,
  ClaimSuccessBody,
  ClaimPendingBody,
  ClaimFailedBody,
  BrightIdNotConnectedBody,
  ChooseWalletBody,
} from "./ModalStatusesBody";
import { useGasTapContext } from "@/context/gasTapProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { DropIconWrapper } from "../../../../../components/containers/modals/claimModal.style";
import { useGlobalContext } from "@/context/globalProvider";
import { shortenAddress } from "@/utils";
import ClaimNotAvailable from "../ClaimNotRemaining";
import { useWalletAccount } from "@/utils/wallet";
import Modal from "@/components/ui/Modal/modal";
import Image from "next/image";
import { BrightConnectionModalBody } from "@/components/containers/modals/brightConnectionModal";

const ClaimModalBody = ({ chain }: { chain: Chain }) => {
  const { address, isConnected } = useWalletAccount();

  const {
    claim,
    closeClaimModal,
    activeClaimReceipt,
    claimLoading,
    activeChain,
    oneTimeClaimedGasList,
    claimWalletAddress,
  } = useGasTapContext();

  const { userProfile, remainingClaims } = useUserProfileContext();
  const { setIsWalletPromptOpen } = useGlobalContext();

  const [isWalletChoosing, setIsWalletChoosing] = useState(false);

  const oneTimeReceipt = useMemo(
    () => oneTimeClaimedGasList.find((item) => item.chain.pk === chain.pk),
    [chain, oneTimeClaimedGasList],
  );

  useEffect(() => {
    if (userProfile) return;

    setIsWalletPromptOpen(true);
  }, [setIsWalletPromptOpen, userProfile]);

  if (!userProfile?.isMeetVerified) return <BrightConnectionModalBody />;

  if (!isConnected) return <WalletNotConnectedBody chainPk={chain.pk} />;

  if (!activeClaimReceipt && (!remainingClaims || remainingClaims <= 0))
    return <ClaimNotAvailable />;

  if (activeClaimReceipt?.status === ClaimReceiptState.VERIFIED)
    return (
      <ClaimSuccessBody activeClaimReceipt={activeClaimReceipt} chain={chain} />
    );

  if (oneTimeReceipt)
    return (
      <ClaimSuccessBody activeClaimReceipt={oneTimeReceipt} chain={chain} />
    );

  if (activeClaimReceipt?.status === ClaimReceiptState.PENDING)
    return (
      <ClaimPendingBody
        activeClaimReceipt={activeClaimReceipt}
        chain={chain}
        closeClaimModal={closeClaimModal}
      />
    );

  if (activeClaimReceipt?.status === ClaimReceiptState.REJECTED)
    return (
      <ClaimFailedBody
        chain={chain}
        claim={claim}
        claimLoading={claimLoading}
      />
    );

  if (!activeChain) return null;

  if (isWalletChoosing)
    return <ChooseWalletBody setIsWalletChoosing={setIsWalletChoosing} />;

  return (
    <>
      <DropIconWrapper data-testid={`chain-claim-initial-${chain.pk}`}>
        <Icon
          className="chain-logo z-10 mb-10 mt-14"
          width="auto"
          height="110px"
          iconSrc={getChainClaimIcon(chain)}
          alt=""
        />
      </DropIconWrapper>
      <button
        onClick={() => setIsWalletChoosing(true)}
        className="mb-10 flex w-full items-center rounded-xl bg-gray50 p-4 text-base font-semibold text-gray100"
      >
        Selected Wallet: {shortenAddress(claimWalletAddress || address)}
        <Image
          className="ml-auto"
          src="/assets/images/provider-dashboard/arrow-down-dark.svg"
          alt="angle down"
          width={14}
          height={8}
        />
      </button>
      <ClaimButton
        onClick={() => claim(chain.pk)}
        $width="100%"
        $fontSize="16px"
        className="!w-full"
        data-testid={`chain-claim-action-${chain.pk}`}
      >
        {claimLoading ? (
          <p>Claiming...</p>
        ) : (
          <p>{`Claim ${formatWeiBalance(activeChain.maxClaimAmount)} ${
            activeChain.symbol
          }`}</p>
        )}
      </ClaimButton>
    </>
  );
};

const ClaimModal = () => {
  const { closeClaimModal, activeChain, isNonEvmActive } = useGasTapContext();
  const { brightidModalStatus } = useGlobalContext();
  const { userProfile } = useUserProfileContext();

  const isOpen = useMemo(() => {
    return !!activeChain && brightidModalStatus === BrightIdModalState.CLOSED;
  }, [activeChain, brightidModalStatus]);

  if (!activeChain || isNonEvmActive) return null;

  return (
    <>
      <Modal
        title={
          userProfile?.isMeetVerified
            ? `Claim ${formatWeiBalance(activeChain.maxClaimAmount)} ${
                activeChain.symbol
              }`
            : "Connect BrightID"
        }
        size="small"
        closeModalHandler={closeClaimModal}
        isOpen={isOpen}
      >
        <div
          className="claim-modal-wrapper flex flex-col items-center justify-center pt-5"
          data-testid={`chain-claim-modal-${activeChain.pk}`}
        >
          {!userProfile?.isMeetVerified ? (
            <div className="my-5 text-sm font-semibold text-error">
              You need to connect your brightID first before claiming gas
            </div>
          ) : null}

          <ClaimModalBody chain={activeChain} />
        </div>
      </Modal>
    </>
  );
};
export default ClaimModal;
