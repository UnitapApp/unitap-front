import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { ConstraintParamValues } from "@/types";

const useAddRequirement = () => {
  const { handleBackToRequirementModal, insertRequirement, updateRequirement } =
    usePrizeOfferFormContext();
  const addRequirements = (
    existRequirement: any,
    params: ConstraintParamValues | null,
    id: number,
    name: string
  ) => {
    if (id) {
      handleBackToRequirementModal();
      if (!existRequirement) {
        insertRequirement(params, id, name);
      } else {
        updateRequirement(id, params);
      }
    }
  };
  return addRequirements;
};

export default useAddRequirement;
