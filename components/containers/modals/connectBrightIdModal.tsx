"use client";

import { Text } from "@/components/ui/text.style";

import {
  ClaimButton,
  WhiteOutlinedButton,
} from "@/components/ui/Button/button";

import { BrightIdModalState } from "@/types";
import BrightStatusModal from "./brightStatusModal";

import Icon from "@/components/ui/Icon";
import { useUserProfileContext } from "@/context/userProfile";
import { useGlobalContext } from "@/context/globalProvider";
import Modal from "@/components/ui/Modal/modal";

const ConnectBrightIdModalContent = () => {
  const { userProfile, loading } = useUserProfileContext();
  const tried = false;
  const {
    closeBrightIdModal,
    openHaveBrightIdAccountModal,
    openBrightIdConnectionModal,
  } = useGlobalContext();

  const handleHaveBrightIdClicked = () => {
    closeBrightIdModal();
    openHaveBrightIdAccountModal();
  };

  const handleBrightIdConnectClicked = () => {
    closeBrightIdModal();
    openBrightIdConnectionModal();
  };

  if (userProfile?.isMeetVerified) {
    return <BrightStatusModal success={true}></BrightStatusModal>;
  }

  return (
    <div
      className="bright-connection-modal flex flex-col items-center justify-center pt-2"
      data-testid="brightid-modal"
    >
      <Icon
        data-testid="brightid-logo"
        className="bright-logo z-10 mb-5 !w-4/12"
        iconSrc="/quest/assets/images/modal/bright-id-logo.svg"
      />
      <p className="mb-2 text-sm font-bold text-white">Login with BrightID</p>
      <p className="mb-5 px-4 text-center text-xs font-medium leading-6 text-gray100">
        BrightID is a social identity network that allows users to prove that
        they are only using one account.
      </p>
      {loading && <Text data-testid={`loading`}>Loading...</Text>}
      <WhiteOutlinedButton
        data-testid="setup-bright-id-qr-code"
        className="mb-4 !w-full bg-gray30"
        onClick={handleBrightIdConnectClicked}
      >
        I have a BrightID
      </WhiteOutlinedButton>

      <ClaimButton
        data-testid={`bright-id-connection-refresh-button${
          tried ? "-try-again" : ""
        }`}
        onClick={handleHaveBrightIdClicked}
        className="mb-4 !w-full"
      >
        <p className="font-semibold">Create my BrightID</p>
      </ClaimButton>

      <p className="text-xs font-light text-gray100">
        you can create a BrightID account and get verified in 2 simple steps
      </p>
    </div>
  );
};

const ConnectBrightIdModal = () => {
  const { brightidModalStatus, closeBrightIdModal } = useGlobalContext();

  return (
    <Modal
      title=""
      size="small"
      isOpen={brightidModalStatus !== BrightIdModalState.CLOSED}
      closeModalHandler={closeBrightIdModal}
    >
      <ConnectBrightIdModalContent />
    </Modal>
  );
};

export default ConnectBrightIdModal;
