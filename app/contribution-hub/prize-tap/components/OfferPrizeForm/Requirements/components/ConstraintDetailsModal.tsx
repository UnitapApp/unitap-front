"use client";

import { useEffect, useState } from "react";
import { RequirementProps, ConstraintProps } from "@/types";
import useAddRequirement from "@/components/containers/provider-dashboard/hooks/useAddRequirement";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import Icon from "@/components/ui/Icon";
import ChainList from "../../../../../ChainList";
import SelectMethodInput from "@/app/contribution-hub/SelectMethodInput";
import { isValidContractAddress } from "@/components/containers/provider-dashboard/helpers/isValidContractAddress";
import { useWalletProvider } from "@/utils/wallet";
import { isAddress } from "viem";

interface CreateModalParam {
  constraint: ConstraintProps;
  setRequirementParamsList: any;
  requirementParamsList: any;
}

interface DetailsModal {
  constraint: ConstraintProps;
}

const ConstraintDetailsModal = ({ constraint }: DetailsModal) => {
  const {
    handleBackToConstraintListModal,
    requirementList,
    insertRequirement,
    updateRequirement,
  } = usePrizeOfferFormContext();

  const provider = useWalletProvider();

  const addRequirements = useAddRequirement(
    handleBackToConstraintListModal,
    insertRequirement,
    updateRequirement
  );

  const [existRequirement, setExistRequirement] =
    useState<RequirementProps | null>(null);

  const [requirementParamsList, setRequirementParamsList] = useState<any>();

  const [isNotSatisfy, setIsNotSatisfy] = useState<boolean>(false);

  const createRequirementParamsList = () => {
    if (constraint.params.length > 0) {
      setRequirementParamsList(
        constraint.params.reduce((obj: any, item: any, index: any) => {
          obj[item] = "";
          return obj;
        }, {})
      );
    }
  };

  useEffect(() => {
    const requirement = requirementList.find(
      (item) => item.pk == constraint.pk
    );
    setExistRequirement(requirement ? requirement : null);
    if (requirement) {
      setIsNotSatisfy(requirement.isNotSatisfy);
      setRequirementParamsList(requirement.params);
    } else {
      createRequirementParamsList();
    }
  }, []);

  const handleAddRequirement = async () => {
    if (
      constraint.name === "core.HasNFTVerification" &&
      !requirementParamsList
    ) {
      return;
    }
    if (constraint.name === "core.HasNFTVerification") {
      if (requirementParamsList.COLLECTION_ADDRESS) {
        const step1Check = await isValidContractAddress(
          requirementParamsList.COLLECTION_ADDRESS,
          provider
        );
        const step2Check = isAddress(requirementParamsList.COLLECTION_ADDRESS);
        console.log(step1Check, step2Check);
        if (!step1Check || !step2Check) return;
      }
    }
    addRequirements(
      existRequirement,
      constraint.pk,
      constraint.name,
      constraint.title,
      isNotSatisfy,
      requirementParamsList
    );
  };

  const handleSelectNotSatisfy = (isSatisfy: boolean) => {
    setIsNotSatisfy(isSatisfy);
  };

  return (
    <div className="flex flex-col gap-2 mt-5 ">
      <div
        className="absolute top-5 cursor-pointer z-[999]"
        onClick={handleBackToConstraintListModal}
      >
        <Icon
          iconSrc="/assets/images/provider-dashboard/arrow-left.svg"
          className="cursor-pointer z-[999999]"
        />
      </div>
      <div className="w-full flex gap-4 h-[32px] mb-2">
        <div
          onClick={() => handleSelectNotSatisfy(false)}
          className={`w-full flex items-center justify-center rounded-lg h-full cursor-pointer text-white relative overflow-hidden`}
        >
          <div
            className={`${
              !isNotSatisfy ? "bg-dark-space-green opacity-30" : "bg-gray50"
            } absolute w-full h-full`}
          ></div>
          <p className="absolute text-white">Should satisfy</p>
        </div>
        <div
          onClick={() => handleSelectNotSatisfy(true)}
          className={`w-full flex items-center justify-center rounded-lg h-full cursor-pointer text-white relative overflow-hidden`}
        >
          <div
            className={`${
              isNotSatisfy ? "bg-error opacity-50" : "bg-gray50"
            } absolute w-full h-full `}
          ></div>
          <p className="absolute text-white">Should not satisfy</p>
        </div>
      </div>
      <CreateParams
        constraint={constraint}
        setRequirementParamsList={setRequirementParamsList}
        requirementParamsList={requirementParamsList}
      />
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

const CreateParams = ({
  constraint,
  setRequirementParamsList,
  requirementParamsList,
}: CreateModalParam) => {
  const [reqNftAddress, setReqNftAddress] = useState("");

  const { allChainList } = usePrizeOfferFormContext();

  useEffect(() => {
    if (!requirementParamsList) return;
    setReqNftAddress(requirementParamsList.COLLECTION_ADDRESS);
  }, [requirementParamsList]);

  const handleChangeCollection = (address: string) => {
    setReqNftAddress(address);
    setRequirementParamsList({
      ...requirementParamsList,
      ["COLLECTION_ADDRESS"]: address,
    });
  };

  if (constraint.params.length === 0) return;
  if (constraint.name === "core.HasNFTVerification") {
    return (
      <div className="flex flex-col gap-3">
        <ChainList
          setRequirementParamsList={setRequirementParamsList}
          requirementParamsList={requirementParamsList}
          allChainList={allChainList}
        />
        <div className="nftAddress_requirement_input overflow-hidden pl-4 flex rounded-2xl bg-gray40 border items-center h-[43px] border-gray50">
          <input
            name="nftAddressRequirement"
            placeholder="Paste NFT address"
            className="bg-inherit w-full h-full"
            value={reqNftAddress ?? ""}
            onChange={(e) => handleChangeCollection(e.target.value)}
          />
        </div>
        <SelectMethodInput
          setRequirementParamsList={setRequirementParamsList}
          requirementParamsList={requirementParamsList}
        />
      </div>
    );
  }
  return <></>;
};

export default ConstraintDetailsModal;
