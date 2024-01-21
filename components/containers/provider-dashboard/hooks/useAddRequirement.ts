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
    constraintFiles: any
  ) => {
    handleBackToConstraintListModal();
    if (!existRequirement) {
      insertRequirement(
        pk,
        name,
        title,
        isNotSatisfy,
        requirementValues,
        constraintFiles
      );
    } else {
      updateRequirement(
        existRequirement,
        isNotSatisfy,
        requirementValues,
        constraintFiles
      );
    }
  };
  return addRequirements;
};

export default useAddRequirement;
