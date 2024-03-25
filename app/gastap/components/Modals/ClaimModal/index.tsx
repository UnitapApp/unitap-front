"use client";

import { FC, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import { BrightIdModalState, Chain, ClaimReceiptState } from "@/types";
import { getChainClaimIcon } from "@/utils/chain";
import { formatWeiBalance } from "@/utils/numbers";
import {
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

const ClaimModalBody: FC<{
  chain: Chain;
  setIsWalletChoosing: (value: boolean) => void;
  isWalletChoosing: boolean;
}> = ({ chain, isWalletChoosing, setIsWalletChoosing }) => {
  const { address } = useWalletAccount();

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

  const oneTimeReceipt = useMemo(
    () => oneTimeClaimedGasList.find((item) => item.chain.pk === chain.pk),
    [chain, oneTimeClaimedGasList],
  );

  if (!userProfile)
    return (
      <BrightIdNotConnectedBody
        chainPk={chain.pk}
        iconSrc={getChainClaimIcon(chain)}
      />
    );

  if (!userProfile.isMeetVerified) return <BrightConnectionModalBody />;

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
          className="chain-logo z-10 mb-6 mt-4"
          width="auto"
          height="110px"
          iconSrc={getChainClaimIcon(chain)}
          alt=""
        />
      </DropIconWrapper>
      <p className="mb-3 text-white">
        {`${formatWeiBalance(activeChain.maxClaimAmount)} ${
          activeChain.symbol
        }`}
      </p>
      <button
        onClick={() => setIsWalletChoosing(true)}
        className="mb-10 flex w-full items-center rounded-2xl bg-gray50 p-4 text-sm font-semibold text-gray100"
      >
        {shortenAddress(claimWalletAddress || address)}
        <Image
          className="ml-auto"
          src="/assets/images/provider-dashboard/arrow-down-dark.svg"
          alt="angle down"
          width={14}
          height={8}
        />
      </button>
      <button
        onClick={() => claim(chain.pk)}
        disabled={claimLoading}
        className="claim-button w-full rounded-3xl p-[1px] text-sm"
      >
        <div className="flex h-11 items-center justify-center rounded-3xl px-4">
          {claimLoading ? (
            <p className="bg-ut-grad-ltr bg-clip-text font-semibold text-transparent">
              Claiming...
            </p>
          ) : (
            <p className="bg-ut-grad-ltr bg-clip-text font-semibold text-transparent">
              Claim
            </p>
          )}
        </div>
      </button>
    </>
  );
};

const ClaimModal = () => {
  const { closeClaimModal, activeChain, isNonEvmActive } = useGasTapContext();
  const { brightidModalStatus } = useGlobalContext();
  const { userProfile } = useUserProfileContext();
  const [isWalletChoosing, setIsWalletChoosing] = useState(false);

  const isOpen = useMemo(() => {
    return !!activeChain && brightidModalStatus === BrightIdModalState.CLOSED;
  }, [activeChain, brightidModalStatus]);

  if (!activeChain || isNonEvmActive) return null;

  return (
    <>
      <Modal
        title={
          userProfile?.isMeetVerified
            ? isWalletChoosing
              ? "Select Wallet"
              : `Claim ${formatWeiBalance(activeChain.maxClaimAmount)} ${
                  activeChain.symbol
                }`
            : "Connect BrightID"
        }
        size="small"
        closeModalHandler={closeClaimModal}
        isOpen={isOpen}
      >
        <div
          className="flex flex-col items-center justify-center"
          data-testid={`chain-claim-modal-${activeChain.pk}`}
        >
          {!userProfile?.isMeetVerified ? (
            <div className="my-5 text-sm font-semibold text-error">
              You need to connect your brightID first before claiming gas
            </div>
          ) : null}

          <ClaimModalBody
            isWalletChoosing={isWalletChoosing}
            setIsWalletChoosing={setIsWalletChoosing}
            chain={activeChain}
          />
        </div>
      </Modal>
    </>
  );
};
export default ClaimModal;
