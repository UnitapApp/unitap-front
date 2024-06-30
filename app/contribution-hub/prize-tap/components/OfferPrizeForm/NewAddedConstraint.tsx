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

  const constraint = constraintsListApi
    ? Object.values(constraintsListApi)
        .flat(1)
        .find((element) => {
          return element.pk === requirement.pk;
        })
    : undefined;

  const isNotSatisfy = requirement.isNotSatisfy;

  const handleClick = () => {
    if (isShowingDetails || !constraint) return;
    handleSelectConstraint(constraint);
    openRequirementModal();
  };

  const handleDelete = (pk: number) => {
    if (isShowingDetails) return;
    deleteRequirement(pk);
  };

  return (
    <div className="m-0 p-0">
      <div className="flex h-[44px] items-center justify-between rounded-xl  border-2 border-gray60 bg-gray50 px-4">
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
            className="flex w-[60px] cursor-pointer items-center justify-center rounded-lg border border-gray80  bg-gray70 p-[2px] text-2xs font-semibold text-gray90"
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
      <p className="m-0 flex w-full items-center justify-center p-0">and</p>
    </div>
  );
};

export default NewAddedConstraint;
