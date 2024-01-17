"use client";

import { RequirementProps } from "@/types";

const useAddRequirement = (handleBackToConstraintListModal: any, insertRequirement:any, updateRequirement:any) => {
  const addRequirements = (
    existRequirement: RequirementProps | null,
    pk: number,
    name: string, 
    title: string,
    isNotSatisfy: boolean,
    requirementValues: any
  ) => {
      handleBackToConstraintListModal();
      if (!existRequirement) {
        insertRequirement(pk,
          name, 
          title,
          isNotSatisfy,
          requirementValues);
      } else {
        updateRequirement(existRequirement,
          isNotSatisfy,
          requirementValues);
      }
  };
  return addRequirements;
};

export default useAddRequirement;
