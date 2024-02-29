import { useMemo } from "react";
import { Chain } from "@/types";
import { RenderWalletNotConnectedBody } from "./RenderWalletNotConnectedBody";
import { RenderBrightNotConnectedBody } from "./RenderBrightNotConnectedBody";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { useUserProfileContext } from "@/context/userProfile";
import {
  useNetworkSwitcher,
  useWalletAccount,
  useWalletNetwork,
} from "@/utils/wallet";
import { ClaimButton } from "@/components/ui/Button/button";
import Modal from "@/components/ui/Modal/modal";

const CreateRaffleModalBody = ({ chain }: { chain: Chain }) => {
  const { address, isConnected } = useWalletAccount();
  const { chain: activeChain } = useWalletNetwork();
  const chainId = activeChain?.id;
  const { switchChain } = useNetworkSwitcher();

  const { handleCreateRaffle, createRaffleLoading, createRaffleResponse } =
    usePrizeOfferFormContext();

  const { userProfile } = useUserProfileContext();

  function renderWrongNetworkBody(chain: Chain) {
    return (
      <>
        <p className="text-sm font-medium text-white mt-2 mb-12 text-center px-4 leading-6">
          You need to switch to the <strong>{chain.chainName}</strong> network.
        </p>

        <ClaimButton
          onClick={() => switchChain(Number(chain.chainId))}
          $width="100%"
          className="!w-full"
          $fontSize="16px"
          data-testid={`chain-claim-action-${chain.pk}`}
        >
          <p>Switch Network</p>
        </ClaimButton>
      </>
    );
  }

  function renderInitialBody() {
    return (
      <>
        <p>Please don{"'"}t close your page</p>

        <ClaimButton
          onClick={handleCreateRaffle}
          $width="100%"
          $fontSize="16px"
          className="!w-full"
          data-testid={`chain-claim-action-${chain.pk}`}
        >
          {createRaffleLoading ? (
            <p>Submit ...</p>
          ) : createRaffleResponse?.state === "Retry" ? (
            <p>Retry</p>
          ) : (
            <p>Submit</p>
          )}
        </ClaimButton>
      </>
    );
  }

  const getEnrollModalBody = () => {
    if (!userProfile) return <RenderBrightNotConnectedBody />;

    if (!isConnected) return <RenderWalletNotConnectedBody />;

    if (!chainId || chainId.toString() !== chain.chainId)
      return renderWrongNetworkBody(chain);

    return renderInitialBody();
  };

  return (
    <div
      className="claim-modal-wrapper flex flex-col items-center justify-center pt-5"
      data-testid={`chain-claim-modal-${chain.pk}`}
    >
      {getEnrollModalBody()}
    </div>
  );
};

const CreateRaffleModal = ({ chain }: { chain: Chain }) => {
  const { closeCreateRaffleModal, isCreateRaffleModalOpen } =
    usePrizeOfferFormContext();

  const isOpen = useMemo(() => {
    return isCreateRaffleModalOpen;
  }, [isCreateRaffleModalOpen]);

  return (
    <Modal
      title="Create Raffle"
      size="small"
      closeModalHandler={closeCreateRaffleModal}
      isOpen={isOpen}
    >
      <CreateRaffleModalBody chain={chain} />
    </Modal>
  );
};
export default CreateRaffleModal;
