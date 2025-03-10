"use client";

import { HaveBrightIdAccountModalState } from "@/types";
import Icon from "@/components/ui/Icon";
import { useGlobalContext } from "@/context/globalProvider";
import Modal from "@/components/ui/Modal/modal";

const CreateBrightIdAccountModalContent = () => {
  return (
    <div
      className="bright-connection-modal flex flex-col items-center justify-center pt-5"
      data-testid="brightid-modal"
    >
      <Icon
        data-testid="brightid-logo"
        className="bright-id-logo z-10 mb-5"
        iconSrc="/assets/images/modal/bright-id-flat-logo.svg"
      />
      <p className="mb-6 mr-auto text-sm text-gray100">
        Create a BrightID account easily by following this steps:
      </p>
      <p className="mb-4 mr-auto text-sm text-white">
        1- Download BrightID App
      </p>
      <div className="stores mb-7 flex w-full justify-evenly">
        <Icon
          onClick={() =>
            window.open(
              "https://play.google.com/store/apps/details?id=org.brightid&hl=en&gl=US&pli=1",
              "_blank",
            )
          }
          className="cursor-pointer"
          iconSrc="/assets/images/modal/google-play.svg"
          height="48px"
          width="auto"
        />
        <Icon
          onClick={() =>
            window.open(
              "https://apps.apple.com/us/app/brightid/id1428946820",
              "_blank",
            )
          }
          className="cursor-pointer"
          iconSrc="/assets/images/modal/app-store.svg"
          height="48px"
          width="auto"
        />
      </div>

      <p className="mb-32 mr-auto text-sm text-white">
        2- Join a{" "}
        <span
          onClick={() => window.open("https://meet.brightid.org/#/", "_blank")}
          className="cursor-pointer text-space-green underline"
        >
          Verification Meet
        </span>{" "}
        to get verified by BrightID
      </p>
      <p className="text-xs text-gray100">
        then come back and connect your BrightID to enjoy Unitap
      </p>
    </div>
  );
};

const CreateBrightIdAccountModal = () => {
  const { closeHaveBrightIdAccountModal, haveBrightIdAccountModalStatus } =
    useGlobalContext();

  return (
    <Modal
      title="Create BrightID Account"
      size="small"
      isOpen={
        haveBrightIdAccountModalStatus !== HaveBrightIdAccountModalState.CLOSED
      }
      closeModalHandler={() => closeHaveBrightIdAccountModal()}
    >
      <CreateBrightIdAccountModalContent />
    </Modal>
  );
};

export default CreateBrightIdAccountModal;
