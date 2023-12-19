"use client";

import { useEffect, useState } from "react";
import {
  ConstraintParamValues,
  ConstraintParams,
  ConstraintProps,
} from "@/types";
import useAddRequirement from "@/components/containers/provider-dashboard/hooks/useAddRequirement";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import Icon from "@/components/ui/Icon";

interface CreateModalParam {
  constraint: ConstraintProps;
}

const ConstraintModal = ({ constraint }: CreateModalParam) => {
  const { handleBackToRequirementModal, requirementList } =
    usePrizeOfferFormContext();
  const addRequirements = useAddRequirement();
  const [params, setParams] = useState<ConstraintParamValues | null>(null);
  const [isNotSatisfy, setIsNotSatisfy] = useState<boolean>(false);
  const existRequirement: any = requirementList.find(
    (item) => item.pk == constraint.pk
  );
  useEffect(() => {
    if (existRequirement) {
      setParams(existRequirement);
      setIsNotSatisfy(existRequirement.isNotSatisfy);
    }
  }, []);

  const handleAddRequirement = () => {
    addRequirements(
      existRequirement,
      params,
      constraint.pk,
      constraint.name,
      constraint.title,
      isNotSatisfy
    );
  };

  interface CreateParamsProps {
    params: ConstraintParams[];
  }

  const handleSelectNotSatisfy = (isSatisfy: boolean) => {
    setIsNotSatisfy(isSatisfy);
  };

  const CreateParams = ({ params }: CreateParamsProps) => {
    return <div></div>;
  };

  return (
    <div className="flex flex-col gap-2 mt-5 ">
      <div
        className="absolute top-5 cursor-pointer z-[999]"
        onClick={handleBackToRequirementModal}
      >
        <Icon
          iconSrc="/assets/images/provider-dashboard/arrow-left.svg"
          className="cursor-pointer z-[999999]"
        />
      </div>
      <CreateParams params={constraint.params} />
      <div className="w-full flex gap-4 h-[32px] mb-2">
        <div
          onClick={() => handleSelectNotSatisfy(false)}
          className={`${
            !isNotSatisfy ? "bg-gray50 text-white" : "bg-gray40 text-gray100"
          } w-full flex items-center justify-center rounded-lg h-full cursor-pointer text-[14px]`}
        >
          Should satisfy
        </div>
        <div
          onClick={() => handleSelectNotSatisfy(true)}
          className={`${
            isNotSatisfy ? "bg-gray50 text-white" : "bg-gray40 text-gray100"
          } w-full flex items-center justify-center rounded-lg h-full cursor-pointer`}
        >
          Should not satisfy
        </div>
      </div>
      <div className="mb-5">{constraint.description}</div>
      <div
        onClick={handleAddRequirement}
        className="flex cursor-pointer  bg-gray40 text-[14px] font-semibold text-white h-[44px] border-2 border-gray70 rounded-xl items-center justify-center mb-2"
      >
        Add Requirement
      </div>
    </div>
  );
};

export default ConstraintModal;
