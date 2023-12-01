import { useContext, useMemo } from "react";
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
import Icon from "@/components/ui/Icon";
import { Text } from "@/components/ui/text.style";
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
        {/* <DropIconWrapper data-testid={`chain-claim-wrong-network`}>
					<Icon
						className="chain-logo z-10 mt-14 mb-10"
						width="auto"
						height="110px"
						iconSrc={selectedRaffleForEnroll!.isPrizeNft ? tokenImgLink : selectedRaffleForEnroll!.imageUrl}
						alt=""
					/>
				</DropIconWrapper> */}
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

  function renderSuccessBody() {
    const handleShareClaimTwitter = () => {
      // 	const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      // 		`I won ${selectedRaffleForEnroll?.name} from @Unitap_app among ${
      // 			selectedRaffleForEnroll?.numberOfOnchainEntries
      // 		} participants. 🤩🎉 (raffled off by @${selectedRaffleForEnroll?.twitterUrl.split('/').at(-1)})
      // 		Try your luck to win valuable prizes at `,
      // 	)}&url=${encodeURIComponent('unitap.app/prize-tap')}`;
      // 	window.open(twitterUrl, '_blank');
      // };
      // const handleShareEnrollTwitter = () => {
      // 	const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      // 		`Trying my chances to win ${
      // 			selectedRaffleForEnroll?.name
      // 		} at @unitap_app (raffled off by @${selectedRaffleForEnroll?.twitterUrl.split('/').at(-1)}) 💚💜
      // 			Feeling lucky? 😎 `,
      // 	)}&url=${encodeURIComponent('unitap.app/prize-tap')}`;
      // 	window.open(twitterUrl, '_blank');
    };

    return (
      <>
        <span className="flex justify-center items-center font-medium mb-3">
          {/* <Text className="!mb-0" width="100%" fontSize="14" color="space_green" textAlign="center">
								successfully enrolled in {selectedRaffleForEnroll?.name} raffle
							</Text> */}
          <Icon
            iconSrc="assets/images/modal/successful-state-check.svg"
            width="22px"
            height="auto"
            className="ml-2"
          />
        </span>

        <Text
          width="100%"
          fontSize="14"
          color="second_gray_light"
          className="underline cursor-pointer"
          mb={3}
          $textAlign="center"
          // onClick={() => window.open(getTxUrl(chain, claimOrEnrollWithMetamaskResponse!.txHash!), '_blank')}
        >
          view on explorer
        </Text>

        <div className="relative w-full">
          <button
            // onClick={handleShareEnrollTwitter}
            className={`gradient-outline-twitter-button w-full flex items-center justify-center bg-gray00 transition-all duration-75 hover:bg-gray20 rounded-xl border-gray00 px-3 py-4`}
          >
            <p className="text-sm font-semibold text-twitter">
              Share on Twitter
            </p>
          </button>
          <Icon
            iconSrc="/assets/images/gas-tap/twitter-share.svg"
            className="w-6 h-6 absolute right-4 top-1/2 z-10 pointer-events-none -translate-y-1/2"
            width="auto"
            height="26px"
          />
        </div>
      </>
    );
  }

  const getEnrollModalBody = () => {
    if (!userProfile) return <RenderBrightNotConnectedBody />;

    if (!isConnected) return <RenderWalletNotConnectedBody />;

    // if (createRaffleResponse?.state === 'Done') return renderSuccessBody();

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
