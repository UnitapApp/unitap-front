"use client";

import { FC, useMemo, useState } from "react";
import ConstraintDetailsModal from "../../../../../components/ConstraintDetailsModal";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import Modal from "@/components/ui/Modal/modal";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/input";
import ConstraintAppDetailModal from "@/app/(base)/incentive-center/components/constraintAppDetailModal";
import { appInfos } from "@/app/(base)/incentive-center/constants/integrations";
import { ConstraintProps } from "@/types";

const ModalBody = () => {
  const {
    selectedConstrains,
    handleBackToConstraintListModal,
    requirementList,
    insertRequirement,
    updateRequirement,
    allChainList,
    selectedApp,
    setSelectedApp,
  } = usePrizeOfferFormContext();

  return (
    <div className="claim-modal-wrapper flex max-h-[550px] flex-col overflow-auto p-2 pt-5">
      {selectedConstrains ? (
        <ConstraintDetailsModal
          constraint={selectedConstrains}
          handleBackToConstraintListModal={handleBackToConstraintListModal}
          requirementList={requirementList}
          insertRequirement={insertRequirement}
          updateRequirement={updateRequirement}
          allChainList={allChainList!}
        />
      ) : selectedApp ? (
        <ConstraintAppDetailModal
          selectedApp={selectedApp}
          setSelectedApp={setSelectedApp}
          handleBackToConstraintListModal={handleBackToConstraintListModal}
          requirementList={requirementList}
          insertRequirement={insertRequirement}
          updateRequirement={updateRequirement}
          allChainList={allChainList!}
        />
      ) : (
        <ConstraintInitialBody />
      )}
    </div>
  );
};

export const SelectCoreIntegrations: FC<{
  constraintsListApi: {
    [key: string]: ConstraintProps[];
  };
  handleSelectConstraint: (constraint: ConstraintProps) => void;
}> = ({ constraintsListApi, handleSelectConstraint }) => {
  return (
    <div className="flex flex-col gap-2 ">
      <p className="text-sm text-white">General</p>
      <div className="mt-3 grid w-full grid-cols-2 items-center justify-center gap-2.5 p-1 text-center">
        {constraintsListApi?.general.map((constraint, key) => (
          <div
            key={key}
            className="requireModal"
            onClick={() => handleSelectConstraint(constraint)}
          >
            {constraint.iconUrl && (
              <Icon
                alt={constraint.title}
                width="32px"
                height="32px"
                iconSrc={constraint.iconUrl}
              />
            )}
            <p>{constraint.title}</p>
            <small className="text-2xs font-[400] text-gray90">
              {constraint.explanation}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ConstraintInitialBody = () => {
  const { handleSelectConstraint, constraintsListApi, setSelectedApp } =
    usePrizeOfferFormContext();
  const [searchBar, setSearchBar] = useState("");

  const availableIntegrations = Object.keys(constraintsListApi!).filter((key) =>
    key.toLowerCase().includes(searchBar.toLowerCase()),
  );

  return (
    <>
      {constraintsListApi && (
        <SelectCoreIntegrations
          handleSelectConstraint={handleSelectConstraint}
          constraintsListApi={constraintsListApi}
        />
      )}
      <p className="my-3 text-sm font-semibold text-white">Integrations</p>
      <div className="mt-2 gap-2">
        <Input
          data-testid="search-box"
          $icon="/assets/images/modal/search-icon.svg"
          $width="100%"
          $fontSize="12px"
          $iconWidth="20px"
          $iconHeight="20px"
          value={searchBar}
          onChange={(e) => setSearchBar(e.target.value)}
          placeholder="Search Integration"
          $pl={7}
          className="mb-0 !rounded-xl border border-gray50 bg-gray40 !py-4 placeholder:text-gray80"
        ></Input>
        <div className="w-full text-center">
          {availableIntegrations.map((constraintKey, index) =>
            constraintKey === "general" ? null : (
              <button
                key={index}
                className="mb-3 flex w-full items-center gap-4 rounded-xl border border-gray60 bg-gray30 p-2 text-gray100"
                onClick={() =>
                  setSelectedApp({
                    constraints: constraintsListApi![constraintKey],
                    label: appInfos[constraintKey].label,
                  })
                }
              >
                <Icon
                  iconSrc={appInfos[constraintKey].logo}
                  alt={appInfos[constraintKey].label}
                  width="28px"
                  height="28px"
                />
                <p>{appInfos[constraintKey].label}</p>
                <Icon
                  className="ml-auto -rotate-90"
                  iconSrc={"/assets/images/token-tap/angle-down.svg"}
                  alt={"angle-down"}
                  width="12px"
                />
              </button>
            ),
          )}

          {availableIntegrations.length === 0 ? (
            <p>No Integrations Found</p>
          ) : null}
        </div>
      </div>
    </>
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
