"use client";

import { useMemo, useState } from "react";
import ConstraintDetailsModal from "@/app/dashboard/_components/ConstraintDetailsModal";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import Modal from "@/components/ui/Modal/modal";
import Icon from "@/components/ui/Icon";
import ConstraintAppDetailModal from "@/app/dashboard/_components/constraintAppDetailModal";
import { SelectCoreIntegrations } from "@/app/dashboard/prize-tap/components/OfferPrizeForm/Requirements/components/ConstraintListModal";
import { Input } from "@/components/ui/input";
import { appInfos } from "@/app/dashboard/constants/integrations";

const RequirementModalBody = () => {
  const {
    selectedConstrains,
    handleBackToConstraintListModal,
    insertRequirement,
    updateRequirement,
    allChainList,
    requirementList,
    selectedApp,
    setSelectedApp,
  } = useTokenTapFromContext();

  return (
    <div className="claim-modal-wrapper flex max-h-[550px] flex-col pt-5">
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
        <InitialBody />
      )}
    </div>
  );
};

const InitialBody = () => {
  const {
    handleSelectConstraint,
    constraintsListApi,
    selectedApp,
    setSelectedApp,
  } = useTokenTapFromContext();

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
          value={searchBar}
          onChange={(e) => setSearchBar(e.target.value)}
          placeholder="Search Integration"
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
