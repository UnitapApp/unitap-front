"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { RequirementProps, ConstraintProps, Chain } from "@/types";
import useAddRequirement from "@/components/containers/provider-dashboard/hooks/useAddRequirement";
import Icon from "@/components/ui/Icon";
import ChainList from "@/app/contribution-hub/components/ChainList";
import SelectMethodInput from "@/app/contribution-hub/components/SelectMethodInput";
import { useWalletProvider } from "@/utils/wallet";
import { isAddress, zeroAddress } from "viem";
import {
  checkNftCollectionAddress,
  checkTokenContractAddress,
} from "@/components/containers/provider-dashboard/helpers/checkCollectionAddress";
import CsvFileInput from "./CsvFileInput";
import {
  FarcasterUserFinder,
  LensUserFinder,
  MinimumLensAction,
} from "./ConstraintDetailsModal";

type CreateModalParam = {
  constraint: ConstraintProps;
  setRequirementParamsList: any;
  requirementParamsList: any;
  constraintFile: any;
  allChainList: Chain[];
  setConstraintFile: (item: any) => void;
  requirementList: RequirementProps[];
  isCollectionValid: boolean;
  setIsCollectionValid: (e: boolean) => void;
  setErrorMessage: (message: string) => void;
  decimals: number | undefined;
  setDecimals: (decimal: number | undefined) => void;
};

type DetailsModal = {
  appDetail: { label: string; icon: string; constraints: ConstraintProps[] };
  handleBackToConstraintListModal: any;
  requirementList: RequirementProps[];
  insertRequirement: any;
  updateRequirement: any;
  allChainList: Chain[];
};

const ConstraintAppDetailModal: FC<DetailsModal> = ({
  handleBackToConstraintListModal,
  requirementList,
  insertRequirement,
  updateRequirement,
  allChainList,
  appDetail,
}) => {
  const addRequirements = useAddRequirement(
    handleBackToConstraintListModal,
    insertRequirement,
    updateRequirement,
  );

  const [existRequirement, setExistRequirement] =
    useState<RequirementProps | null>(null);

  const [requirementParamsList, setRequirementParamsList] = useState<any>();

  const [isNotSatisfy, setIsNotSatisfy] = useState<boolean>(false);

  const [constraintFile, setConstraintFile] = useState<any>();

  const [isCollectionValid, setIsCollectionValid] = useState<boolean>(false);

  const [decimals, setDecimals] = useState<number | undefined>();

  const [constraint, setConstraint] = useState<ConstraintProps | null>(null);

  const createRequirementParamsList = useCallback(() => {
    if (!constraint) return;

    if (constraint.params.length > 0) {
      setRequirementParamsList(
        constraint.params.reduce((obj: any, item: any, index: any) => {
          obj[item] = "";
          return obj;
        }, {}),
      );
    }
  }, [constraint]);

  const [errorMessage, setErrorMessage] = useState<string | null>();

  useEffect(() => {
    const requirement = requirementList.find(
      (item) => item.pk == constraint?.pk,
    );

    setExistRequirement(requirement ?? null);

    if (requirement) {
      setIsNotSatisfy(requirement.isNotSatisfy);
      setRequirementParamsList(requirement.params);
    } else {
      createRequirementParamsList();
    }
  }, [constraint, createRequirementParamsList, requirementList]);

  const checkingParamsValidation = () => {
    if (!requirementParamsList) return false;
    if (
      !requirementParamsList.ADDRESS ||
      !requirementParamsList.CHAIN ||
      !requirementParamsList.MINIMUM ||
      Number(requirementParamsList.MINIMUM) <= 0
    ) {
      !requirementParamsList.ADDRESS
        ? setErrorMessage("Please enter collection address.")
        : !requirementParamsList.CHAIN
          ? setErrorMessage("Please select chain.")
          : setErrorMessage("Please select minimum amount.");
      return false;
    }

    if (!isCollectionValid) return false;
    return true;
  };

  const checkCsvFileUploadedValidation = () => {
    if (!requirementParamsList) return false;
    if (!requirementParamsList.CSV_FILE) {
      setErrorMessage("Please upload a csv file.");
      return false;
    }
    return true;
  };

  const handleAddRequirement = () => {
    if (
      constraint.name === "core.HasNFTVerification" ||
      constraint.name === "core.HasTokenVerification"
    ) {
      const res = checkingParamsValidation();
      if (!res) return;
    }

    if (constraint.name === "core.AllowListVerification") {
      const res = checkCsvFileUploadedValidation();
      if (!res) return;
    }

    addRequirements(
      existRequirement,
      constraint.pk,
      constraint.name,
      constraint.title,
      isNotSatisfy,
      requirementParamsList,
      constraintFile,
      decimals,
    );
  };

  const handleSelectNotSatisfy = (isSatisfy: boolean) => {
    setIsNotSatisfy(isSatisfy);
  };

  return (
    <div className="mt-5 flex flex-col gap-2">
      <div
        className="absolute top-5 z-[999] cursor-pointer"
        onClick={handleBackToConstraintListModal}
      >
        <Icon
          iconSrc="/assets/images/provider-dashboard/arrow-left.svg"
          className="cursor-pointer"
        />
      </div>
      <div className="mb-2 flex h-[32px] w-full gap-4">
        <div
          onClick={() => handleSelectNotSatisfy(false)}
          className={`relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg text-white`}
        >
          <div
            className={`${
              !isNotSatisfy ? "bg-dark-space-green opacity-30" : "bg-gray50"
            } absolute h-full w-full`}
          ></div>
          <p className="absolute text-white">Should satisfy</p>
        </div>
        <div
          onClick={() => handleSelectNotSatisfy(true)}
          className={`relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg text-white`}
        >
          <div
            className={`${
              isNotSatisfy ? "bg-error opacity-50" : "bg-gray50"
            } absolute h-full w-full `}
          ></div>
          <p className="absolute text-white">Should not satisfy</p>
        </div>
      </div>

      <CreateParams
        constraint={constraint}
        setRequirementParamsList={setRequirementParamsList}
        requirementParamsList={requirementParamsList}
        constraintFile={constraintFile}
        setConstraintFile={setConstraintFile}
        allChainList={allChainList}
        requirementList={requirementList}
        isCollectionValid={isCollectionValid}
        setIsCollectionValid={setIsCollectionValid}
        setErrorMessage={setErrorMessage}
        decimals={decimals}
        setDecimals={setDecimals}
      />
      <div className="mb-4">{constraint.description}</div>
      <div className="min-h-[15px] text-2xs text-error">{errorMessage}</div>
      <div
        onClick={handleAddRequirement}
        className="mb-2 flex  h-[44px] cursor-pointer items-center justify-center rounded-xl border-2 border-gray70 bg-gray40 text-sm font-semibold text-white"
      >
        Add Requirement
      </div>
    </div>
  );
};

export default ConstraintAppDetailModal;
