"use client";

import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { ConstraintParamValues } from "@/types";

const useAddRequirement = () => {
  const { handleBackToRequirementModal, insertRequirement, updateRequirement } =
    usePrizeOfferFormContext();
  const addRequirements = (
    existRequirement: any,
    params: ConstraintParamValues | null,
    id: number,
    name: string,
    title: string,
    isNotSatisfy: boolean
  ) => {
    if (id) {
      handleBackToRequirementModal();
      if (!existRequirement) {
        insertRequirement(params, id, name, title, isNotSatisfy);
      } else {
        updateRequirement(id, params, isNotSatisfy);
      }
    }
  };
  return addRequirements;
};

export default useAddRequirement;
