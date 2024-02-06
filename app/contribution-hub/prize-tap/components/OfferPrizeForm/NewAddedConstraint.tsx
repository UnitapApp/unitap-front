"use client";

import Icon from "@/components/ui/Icon";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { RequirementProps } from "@/types";

interface Props {
  requirement: RequirementProps;
}

const NewAddedConstraint = ({ requirement }: Props) => {
  const {
    handleSelectConstraint,
    openRequirementModal,
    deleteRequirement,
    constraintsListApi,
    isShowingDetails,
  } = usePrizeOfferFormContext();

  const constraint = constraintsListApi!.find(
    (item) => item.pk == requirement.pk
  );

  const isNotSatisfy = requirement.isNotSatisfy;

  const handleClick = () => {
    if (isShowingDetails) return;
    handleSelectConstraint(constraint!);
    openRequirementModal();
  };

  const handleDelete = (pk: number) => {
    if (isShowingDetails) return;
    deleteRequirement(pk);
  };

  return (
    <div className="m-0 p-0">
      <div className="bg-gray50 h-[44px] rounded-xl flex justify-between  items-center px-4 border-2 border-gray60">
        <div className="flex items-center gap-2">
          {constraint?.iconUrl && <Icon iconSrc={constraint.iconUrl} />}
          <p className={!isNotSatisfy ? "text-dark-space-green" : "text-error"}>
            {isNotSatisfy ? "Should not satisfy" : "Should satisfy"}
          </p>
          <p>{requirement!.title} requirement</p>
        </div>
        <div className="flex items-center gap-3">
          <div
            onClick={handleClick}
            className="cursor-pointer flex items-center justify-center p-[2px] text-gray90 text-[10px] w-[60px]  font-semibold bg-gray70 border border-gray80 rounded-lg"
          >
            Edit
          </div>

          <Icon
            onClick={() => handleDelete(requirement!.pk)}
            className="cursor-pointer"
            iconSrc="/assets/images/modal/exit.svg"
            height="14px"
            width="14px"
          />
        </div>
      </div>
      <p className="flex w-full items-center justify-center m-0 p-0">and</p>
    </div>
  );
};

export default NewAddedConstraint;
