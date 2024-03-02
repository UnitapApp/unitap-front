"use client";

import { useEffect, useMemo, useState } from "react";
import ConstraintDetailsModal from "@/app/contribution-hub/ConstraintDetailsModal";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import Modal from "@/components/ui/Modal/modal";
import Icon from "@/components/ui/Icon";

const RequirementModalBody = () => {
  const {
    selectedConstrains,
    handleBackToConstraintListModal,
    insertRequirement,
    updateRequirement,
    allChainList,
    requirementList,
  } = useTokenTapFromContext();

  const getRequirementModalBody = () => {
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
    <div className="claim-modal-wrapper flex flex-col max-h-[550px] pt-5">
      {getRequirementModalBody()}
    </div>
  );
};

const InitialBody = () => {
  const { handleSelectConstraint, constraintsListApi } =
    useTokenTapFromContext();

  const [selectedApp, setSelectedApp] = useState("");

  return (
    <div className="flex flex-col gap-2 ">
      <div className="absolute top-5 cursor-pointer z-[999]">
        <Icon
          iconSrc="/assets/images/provider-dashboard/arrow-left.svg"
          className="cursor-pointer z-[999999]"
          onClick={() => setSelectedApp("")}
        />
      </div>
      <p className="text-white text-sm font-medium">General</p>
      <div className="grid grid-cols-2 gap-2.5 row-gap-2 w-full items-center justify-center text-center">
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
                {constraintKey}
              </div>
            ))}
      </div>
    </div>
  );
};

const ConstraintListModal = () => {
  const { closeRequirementModal, isModalOpen, selectedConstraintTitle } =
    useTokenTapFromContext();

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

export default ConstraintListModal;
