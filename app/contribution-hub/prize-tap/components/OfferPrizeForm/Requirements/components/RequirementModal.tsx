"use client";

import { useMemo } from "react";
import RenderInitialBody from "./RenderInitialBody";
import ConstraintModal from "./ConstraintModal";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import Modal from "@/components/ui/Modal/modal";

const RequirementModalBody = () => {
  const { selectedConstrains } = usePrizeOfferFormContext();

  const getRequirementModalBody = () => {
    if (selectedConstrains) {
      return <ConstraintModal constraint={selectedConstrains} />;
    } else {
      return <RenderInitialBody />;
    }
  };
  return (
    <div className="claim-modal-wrapper flex flex-col max-h-[550px] pt-5">
      {getRequirementModalBody()}
    </div>
  );
};

const RequirementModal = () => {
  const { closeRequirementModal, isModalOpen, selectedConstraintTitle } =
    usePrizeOfferFormContext();

  const isOpen = useMemo(() => {
    return isModalOpen;
  }, [isModalOpen]);

  return (
    <>
      <Modal
        title={`${
          selectedConstraintTitle
            ? "Add " + selectedConstraintTitle + " requirement"
            : "Add requirement"
        }`}
        size="small"
        closeModalHandler={closeRequirementModal}
        isOpen={isOpen}
        className="provider-dashboard__modal"
      >
        <RequirementModalBody />
      </Modal>
    </>
  );
};

export default RequirementModal;
