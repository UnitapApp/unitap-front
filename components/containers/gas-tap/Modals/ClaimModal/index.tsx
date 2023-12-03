"use client";

import { useMemo } from "react";
import { Text } from "@/components/ui/text.style";
import Icon from "@/components/ui/Icon";
import { ClaimButton } from "@/components/ui/Button/button";
import { BrightIdModalState, Chain, ClaimReceiptState } from "@/types";
import { getChainClaimIcon } from "@/utils/chain";
import { formatWeiBalance } from "@/utils/numbers";
import {
  BrightIdNotVerifiedBody,
  WalletNotConnectedBody,
  ClaimSuccessBody,
  ClaimPendingBody,
  ClaimFailedBody,
  BrightIdNotConnectedBody,
} from "./ModalStatusesBody";
import { useGasTapContext } from "@/context/gasTapProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { DropIconWrapper } from "./claimModal.style";
import WalletAddress from "./walletAddress";
import { useGlobalContext } from "@/context/globalProvider";
import { shortenAddress } from "@/utils";
import ClaimNotAvailable from "../ClaimNotRemaining";
import { useWalletAccount } from "@/utils/wallet";
import Modal from "@/components/ui/Modal/modal";

const ClaimModalBody = ({ chain }: { chain: Chain }) => {
  const { address, isConnected } = useWalletAccount();

  const {
    claim,
    closeClaimModal,
    activeClaimReceipt,
    claimLoading,
    activeChain,
    oneTimeClaimedGasList,
  } = useGasTapContext();

  const { userProfile, remainingClaims } = useUserProfileContext();

  const oneTimeReceipt = useMemo(
    () => oneTimeClaimedGasList.find((item) => item.chain.pk === chain.pk),
    [chain, oneTimeClaimedGasList]
  );

  if (!userProfile)
    return (
      <BrightIdNotConnectedBody
        chainPk={chain.pk}
        iconSrc={getChainClaimIcon(chain)}
      />
    );

  if (!userProfile.isMeetVerified) return <BrightIdNotVerifiedBody />;

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

  return (
    <>
      <DropIconWrapper data-testid={`chain-claim-initial-${chain.pk}`}>
        <Icon
          className="chain-logo z-10 mt-14 mb-10"
          width="auto"
          height="110px"
          iconSrc={getChainClaimIcon(chain)}
          alt=""
        />
      </DropIconWrapper>
      <Text width="100%" fontSize="14">
        Wallet Address
      </Text>
      <WalletAddress fontSize="12">
        {isConnected ? shortenAddress(address) : ""}
      </WalletAddress>
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
          <p>{`Claim ${formatWeiBalance(
            activeChain.maxClaimAmount.toString()
          )} ${activeChain.symbol}`}</p>
        )}
      </ClaimButton>
    </>
  );
};

const ClaimModal = () => {
  const { closeClaimModal, activeChain, isNonEvmActive } = useGasTapContext();
  const { brightidModalStatus } = useGlobalContext();

  const isOpen = useMemo(() => {
    return !!activeChain && brightidModalStatus === BrightIdModalState.CLOSED;
  }, [activeChain, brightidModalStatus]);

  if (!activeChain || isNonEvmActive) return null;

  return (
    <>
      <Modal
        title={`Claim ${formatWeiBalance(
          activeChain.maxClaimAmount.toString()
        )} ${activeChain.symbol}`}
        size="small"
        closeModalHandler={closeClaimModal}
        isOpen={isOpen}
      >
        <div
          className="claim-modal-wrapper flex flex-col items-center justify-center pt-5"
          data-testid={`chain-claim-modal-${activeChain.pk}`}
        >
          <ClaimModalBody chain={activeChain} />
        </div>
      </Modal>
    </>
  );
};
export default ClaimModal;
