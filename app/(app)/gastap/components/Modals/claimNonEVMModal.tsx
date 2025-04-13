"use client";

import { useEffect } from "react";

import Icon from "@/components/ui/Icon";
import { ClaimBoxState, ClaimReceiptState } from "@/types";

import { formatChainBalance } from "@/utils/numbers";
import { Text } from "@/components/ui/text.style";
import {
  ClaimButton,
  LightOutlinedButtonNew,
  SecondaryGreenColorButton,
} from "@/components/ui/Button/button";
import { getChainClaimIcon, getTxUrl } from "@/utils/chain";
import lottie from "lottie-web";
import animation from "@/assets/animations/GasFee-delivery2.json";
import { useGasTapContext } from "@/context/gasTapProvider";
import { useGlobalContext } from "@/context/globalProvider";
import { useUserProfileContext } from "@/context/userProfile";
import ClaimNotAvailable from "./ClaimNotRemaining";
import Modal from "@/components/ui/Modal/modal";
import { lightingChainId } from "@/constants/chains";

const ClaimNonEVMModalContent = () => {
  const {
    isNonEvmActive,
    activeClaimReceipt,
    claimNonEVM,
    closeClaimModal,
    claimLoading,
    activeChain,
  } = useGasTapContext();

  const { openBrightIdModal } = useGlobalContext();

  const {
    userProfile,
    nonEVMWalletAddress,
    setNonEVMWalletAddress,
    remainingClaims,
  } = useUserProfileContext();

  const handleClaimNonEVMClicked = () => {
    if (isNonEvmActive && activeChain) {
      claimNonEVM(activeChain, nonEVMWalletAddress);
    }
  };

  useEffect(() => {
    if (activeClaimReceipt?.status === ClaimReceiptState.PENDING) {
      const animationElement = document.querySelector("#animation");
      if (animationElement) {
        animationElement.innerHTML = "";
      }
      lottie.loadAnimation({
        container: document.querySelector("#animation") as HTMLInputElement,
        animationData: animation,
        loop: true,
        autoplay: true,
      });
    }
  }, [activeClaimReceipt]);

  function renderBrightNotConnectedBody() {
    if (!isNonEvmActive || !activeChain) return null;

    return (
      <>
        <Icon
          data-testid="chain-logo"
          className="chain-logo z-10 mb-10 mt-14"
          iconSrc={getChainClaimIcon(activeChain!) || activeChain!.logoUrl}
          width="auto"
          height="110px"
        />
        <p className="mb-5 mt-11 text-sm text-white">
          You need to connect your BrightID to claim your tokens
        </p>

        <ClaimButton
          onClick={openBrightIdModal}
          $width="100%"
          className="!w-full"
          $fontSize="16px"
          data-testid={`chain-claim-action-${activeChain.pk}`}
        >
          <p>Connect BrightID</p>
        </ClaimButton>
      </>
    );
  }

  function renderBrightNotVerifiedBody() {
    return (
      <>
        <div
          className="bright-connection-modal flex flex-col items-center justify-center pt-2"
          data-testid="brightid-modal"
        >
          <Icon
            data-testid="brightid-logo"
            className="bright-logo z-10 mb-5 !w-4/12"
            iconSrc="assets/images/modal/bright-id-logo-checked.svg"
          />
          <p className="mb-2 text-sm font-bold text-error">
            You are not verified on BrightID
          </p>
          <p className="mb-12 px-4 text-center text-xs font-medium leading-6 text-gray100">
            BrightID is a social identity network that allows users to prove
            that they are only using one account.
          </p>

          <span className="relative w-full">
            <LightOutlinedButtonNew
              className="!w-full"
              onClick={() =>
                window.open("https://meet.brightid.org/", "_blank")
              }
            >
              Verify on BrightID{" "}
              <Icon
                className="arrow-icon ml-1.5 mt-0.5 w-2 cursor-pointer"
                iconSrc="assets/images/arrow-icon.svg"
              />
            </LightOutlinedButtonNew>
            <Icon
              iconSrc="assets/images/modal/bright-id-check.svg"
              className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2"
            />
          </span>

          <p
            className="mt-4 cursor-pointer text-xs text-white hover:underline"
            onClick={() => location.reload()}
          >
            If you verified your BrightID click here.
          </p>
        </div>
      </>
    );
  }

  function renderInitialBody() {
    return (
      <>
        <Icon
          data-testid="chain-logo"
          className="chain-logo z-10 mb-10 mt-14"
          iconSrc={getChainClaimIcon(activeChain!) || activeChain!.logoUrl}
          width="auto"
          height="110px"
        />

        <div className="address-input my-6 flex w-full items-center rounded-xl bg-gray30 p-2.5">
          <input
            className="address-input__input mx-1.5 w-full bg-transparent text-sm text-white placeholder:text-gray80"
            type="text"
            placeholder={
              activeChain?.chainId === lightingChainId
                ? "Paste your lightning invoice "
                : "Your Non-EVM Wallet Address..."
            }
            value={nonEVMWalletAddress}
            onChange={(e) => setNonEVMWalletAddress(e.target.value)}
          />
          <button
            className="address-input__paste-button btn btn--sm btn--primary-light font-semibold tracking-wide"
            onClick={() =>
              navigator.clipboard
                .readText()
                .then((text) => setNonEVMWalletAddress(text))
            }
          >
            PASTE
          </button>
        </div>

        <button
          className={`btn ${
            !nonEVMWalletAddress || claimLoading
              ? "btn--disabled"
              : "btn--primary-outlined"
          } w-full`}
          onClick={() => handleClaimNonEVMClicked()}
        >
          {claimLoading ? (
            <p>
              {" "}
              Claiming{" "}
              {formatChainBalance(
                activeChain!.maxClaimAmount,
                activeChain!.symbol,
              )}{" "}
              {activeChain!.symbol}{" "}
            </p>
          ) : (
            <p>
              {" "}
              Claim{" "}
              {formatChainBalance(
                activeChain!.maxClaimAmount,
                activeChain!.symbol,
              )}{" "}
              {activeChain!.symbol}{" "}
            </p>
          )}
        </button>
      </>
    );
  }

  function renderPendingBody() {
    if (!isNonEvmActive) return null;

    return (
      <>
        <div
          data-testid={`chain-claim-pending-${activeChain!.pk}`}
          id="animation"
          style={{ width: "200px" }}
        ></div>
        <Text
          width="100%"
          fontSize="14"
          color="space_green"
          $textAlign="center"
        >
          Claim transaction submitted
        </Text>
        <Text
          width="100%"
          fontSize="14"
          color="second_gray_light"
          className="mb-3"
          $textAlign="center"
        >
          The claim transaction will be compeleted soon
        </Text>
        <SecondaryGreenColorButton
          onClick={closeClaimModal}
          $width={"100%"}
          data-testid={`chain-claim-action-${activeChain!.pk}`}
        >
          Close
        </SecondaryGreenColorButton>
      </>
    );
  }

  function renderSuccessBody() {
    const handleClick = () => {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `I've just claimed ${formatChainBalance(
          activeChain!.maxClaimAmount,
          activeChain!.symbol,
        )} ${activeChain!.chainName} from @Unitap_app 🔥\n Claim yours:`,
      )}&url=${encodeURIComponent(
        "unitap.app/gas-tap?hc=" + activeChain!.chainName,
      )}`;

      window.open(twitterUrl, "_blank");
    };

    return (
      <>
        <Icon
          data-testid="chain-logo"
          className="chain-logo z-10 mb-10 mt-14"
          iconSrc={getChainClaimIcon(activeChain!) || activeChain!.logoUrl}
          width="auto"
          height="110px"
        />
        <Text
          width="100%"
          fontSize="14"
          color="space_green"
          $textAlign="center"
        >
          {formatChainBalance(activeChain!.maxClaimAmount, activeChain!.symbol)}{" "}
          {activeChain!.symbol} Claimed
        </Text>
        <Text
          width="100%"
          fontSize="14"
          color="second_gray_light"
          className="mb-3"
          $textAlign="center"
        >
          we successfully transferred{" "}
          {formatChainBalance(activeChain!.maxClaimAmount, activeChain!.symbol)}{" "}
          {activeChain!.symbol} to your wallet
        </Text>
        <Text
          width="100%"
          fontSize="14"
          color="second_gray_light"
          className="cursor-pointer underline"
          mb={3}
          $textAlign="center"
          onClick={() =>
            window.open(
              getTxUrl(activeChain!, activeClaimReceipt!.txHash!),
              "_blank",
            )
          }
        >
          view on explorer
        </Text>

        <div className="relative w-full">
          <button
            onClick={handleClick}
            className={`gradient-outline-twitter-button flex w-full items-center justify-center rounded-xl border-gray00 bg-gray00 px-3 py-4 transition-all duration-75 hover:bg-gray20`}
          >
            <p className="text-sm font-semibold text-twitter">
              Share on Twitter
            </p>
          </button>
          <Icon
            iconSrc="/assets/images/gas-tap/twitter-share.svg"
            className="pointer-events-none absolute right-4 top-1/2 z-10 h-6 w-6 -translate-y-1/2"
            width="auto"
            height="26px"
          />
        </div>
      </>
    );
  }

  function renderFailedBody() {
    if (!activeChain) return null;

    return (
      <>
        <Icon
          data-testid="chain-logo"
          className="chain-logo z-10 mb-10 mt-14"
          iconSrc={getChainClaimIcon(activeChain!) || activeChain!.logoUrl}
          width="auto"
          height="110px"
        />
        <span className="mb-3 flex items-center justify-center font-medium">
          <Text
            className="!mb-0"
            width="100%"
            fontSize="14"
            color="warningRed"
            $textAlign="center"
          >
            Claim Failed!
          </Text>
          <Icon
            iconSrc="assets/images/modal/failed-state-x.svg"
            width="22px"
            height="auto"
            className="ml-2"
          />
        </span>
        <Text
          width="100%"
          fontSize="14"
          color="second_gray_light"
          mb={3}
          $textAlign="center"
        >
          An error occurred while processing your request
        </Text>
        <div className="address-input my-6 flex w-full items-center rounded-xl bg-gray30 p-2.5">
          <input
            className="address-input__input mx-1.5 w-full bg-transparent text-sm text-white placeholder:text-gray80"
            type="text"
            placeholder={
              activeChain?.chainId === lightingChainId
                ? "Paste your lightning invoice "
                : "Your Non-EVM Wallet Address..."
            }
            value={nonEVMWalletAddress}
            onChange={(e) => setNonEVMWalletAddress(e.target.value)}
          />
          <button
            className="address-input__paste-button btn btn--sm btn--primary-light font-semibold tracking-wide"
            onClick={() =>
              navigator.clipboard
                .readText()
                .then((text) => setNonEVMWalletAddress(text))
            }
          >
            PASTE
          </button>
        </div>
        <ClaimButton
          $fontSize="16px"
          onClick={handleClaimNonEVMClicked}
          $width={"100%"}
          className="!w-full"
          data-testid={`chain-claim-action-${activeChain.pk}`}
        >
          {claimLoading ? <p> Claiming... </p> : <p>Try Again</p>}
        </ClaimButton>
      </>
    );
  }

  const getClaimNonEVMModalBody = () => {
    if (!userProfile) return renderBrightNotConnectedBody();

    if (!userProfile.isMeetVerified) return renderBrightNotVerifiedBody();

    if (!activeClaimReceipt) {
      if (remainingClaims && remainingClaims > 0) return renderInitialBody();

      return <ClaimNotAvailable />;
    }

    if (activeClaimReceipt.status === ClaimReceiptState.VERIFIED)
      return renderSuccessBody();

    if (activeClaimReceipt.status === ClaimReceiptState.PENDING)
      return renderPendingBody();

    if (activeClaimReceipt.status === ClaimReceiptState.REJECTED)
      return renderFailedBody();
  };

  return (
    <div
      className="claim-non-evm-modal flex flex-col items-center justify-center pt-2"
      data-testid="claim-non-evm-modal"
    >
      {getClaimNonEVMModalBody()}
    </div>
  );
};

const ClaimNonEVMModal = () => {
  const { activeChain, claimBoxStatus, closeClaimModal, isNonEvmActive } =
    useGasTapContext();

  if (!isNonEvmActive || !activeChain) return null;

  return (
    <Modal
      title={`Claim ${formatChainBalance(
        activeChain.maxClaimAmount,
        activeChain.symbol,
      )} ${activeChain.symbol}`}
      size="small"
      isOpen={true}
      closeModalHandler={closeClaimModal}
    >
      <ClaimNonEVMModalContent />
    </Modal>
  );
};

export default ClaimNonEVMModal;
