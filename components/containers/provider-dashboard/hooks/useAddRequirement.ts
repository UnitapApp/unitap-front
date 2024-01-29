"use client";

import { RequirementProps } from "@/types";

const useAddRequirement = (
  handleBackToConstraintListModal: any,
  insertRequirement: any,
  updateRequirement: any
) => {
  const addRequirements = (
    existRequirement: RequirementProps | null,
    pk: number,
    name: string,
    title: string,
    isNotSatisfy: boolean,
    requirementValues: any,
    constraintFiles: any,
    decimals: number | undefined
  ) => {
    handleBackToConstraintListModal();
    if (!existRequirement) {
      insertRequirement(
        pk,
        name,
        title,
        isNotSatisfy,
        requirementValues,
        constraintFiles,
        decimals
      );
    } else {
      updateRequirement(
        existRequirement,
        isNotSatisfy,
        requirementValues,
        constraintFiles,
        decimals
      );
    }
  };
  return addRequirements;
};

export default useAddRequirement;
