"use client";

import { useEffect, useMemo, useState } from "react";
import ConstraintDetailsModal from "../../../../../ConstraintDetailsModal";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import Modal from "@/components/ui/Modal/modal";
import Icon from "@/components/ui/Icon";
import { uppercaseFirstLetter } from "@/utils";

const ModalBody = () => {
  const {
    selectedConstrains,
    handleBackToConstraintListModal,
    requirementList,
    insertRequirement,
    updateRequirement,
    allChainList,
  } = usePrizeOfferFormContext();

  const getModalBody = () => {
    if (selectedConstrains) {
      return (
        <ConstraintDetailsModal
          constraint={selectedConstrains}
          handleBackToConstraintListModal={handleBackToConstraintListModal}
          requirementList={requirementList}
          insertRequirement={insertRequirement}
          updateRequirement={updateRequirement}
          allChainList={allChainList!}
        />
      );
    } else {
      return <InitialBody />;
    }
  };
  return (
    <div className="claim-modal-wrapper flex max-h-[550px] flex-col pt-5">
      {getModalBody()}
    </div>
  );
};

export const InitialBody = () => {
  const { handleSelectConstraint, constraintsListApi } =
    usePrizeOfferFormContext();

  const [selectedApp, setSelectedApp] = useState("");

  return (
    <div className="flex flex-col gap-2 ">
      <div className="absolute top-5 z-[999] cursor-pointer">
        <Icon
          onClick={() => setSelectedApp("")}
          iconSrc="/assets/images/provider-dashboard/arrow-left.svg"
          className="z-[999999] cursor-pointer"
        />
      </div>
      {!!selectedApp && (
        <p className="text-sm font-medium text-white">
          {uppercaseFirstLetter(selectedApp)}
        </p>
      )}
      <div className="row-gap-2 grid w-full grid-cols-2 items-center justify-center gap-2.5 text-center">
        {selectedApp
          ? constraintsListApi![selectedApp].map((constraint, key) => (
              <div
                key={key}
                className="requireModal"
                onClick={() => handleSelectConstraint(constraint)}
              >
                {constraint.iconUrl && <Icon iconSrc={constraint.iconUrl} />}
                {constraint.title}
              </div>
            ))
          : Object.keys(constraintsListApi!).map((constraintKey, index) => (
              <div
                key={index}
                className="requireModal"
                onClick={() => setSelectedApp(constraintKey)}
              >
                {uppercaseFirstLetter(constraintKey)}
              </div>
            ))}
      </div>
    </div>
  );
};

const ConstraintListModal = () => {
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
        <ModalBody />
      </Modal>
    </>
  );
};

export default ConstraintListModal;
