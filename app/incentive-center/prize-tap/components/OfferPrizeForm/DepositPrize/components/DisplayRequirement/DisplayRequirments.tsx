"use client";

import Icon from "@/components/ui/Icon";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { RequirementProps } from "@/types";

interface Props {
  requirement: RequirementProps;
}

const DisplayRequirement = ({ requirement }: Props) => {
  const { constraintsListApi } = usePrizeOfferFormContext();

  const constraint = constraintsListApi
    ? Object.values(constraintsListApi)
        .flat(1)
        .find((element) => {
          return element.pk === requirement.pk;
        })
    : undefined;

  // const isNotSatisfy = requirement.isNotSatisfy;

  return (
    <div className="mb-3 text-xs">
      <div className="flex h-[44px] items-center justify-between rounded-xl bg-gray30 px-4">
        <div className="flex items-center gap-2">
          {constraint?.iconUrl && (
            <Icon iconSrc={constraint.iconUrl} width="23px" />
          )}
          {/* <p className={!isNotSatisfy ? "text-dark-space-green" : "text-error"}>
            {isNotSatisfy ? "Should not satisfy" : "Should satisfy"}
          </p> */}
          <p>{requirement!.title} requirement</p>
        </div>
      </div>
    </div>
  );
};

export default DisplayRequirement;
