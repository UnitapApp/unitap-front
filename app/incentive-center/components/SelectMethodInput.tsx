import Icon from "@/components/ui/Icon";
import { RequirementProps } from "@/types";
import { useOutsideClick } from "@/utils/hooks/dom";
import { fromWei, toWei } from "@/utils/numbersBigNumber";
import React, { useEffect, useRef, useState } from "react";
import Big from "big.js";

export enum SelectMethod {
  Minimum = "Minimum",
  Maximum = "Maximum",
}

interface MethodProp {
  minimum: string;
  maximum: string;
}

interface Prop {
  setRequirementParamsList: (e: any) => void;
  requirementParamsList: any;
  isNft: boolean;
  requirement: RequirementProps | undefined;
  isDisabled: boolean;
  decimals: number | undefined;
}

const SelectMethodInput = ({
  setRequirementParamsList,
  requirementParamsList,
  requirement,
  isNft,
  isDisabled,
  decimals,
}: Prop) => {
  const [selectedMethod, setSelectedMethod] = useState<string | undefined>();
  const [showItems, setShowItems] = useState<boolean>(false);

  const handleSelectMethod = () => {
    setSelectedMethod("Minimum Amount");
    setShowItems(false);
  };

  const [methodValues, setMethodValues] = useState<MethodProp>({
    minimum: "0",
    maximum: "0",
  });

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    if (showItems) setShowItems(false);
  });

  const handleChangeMethodValues = (e: string) => {
    const value =
      e === "increase"
        ? Number(methodValues.minimum!) + 1
        : Math.max(0, Number(methodValues.minimum) - 1);
    handleChange(value.toString());
  };

  const handleChange = (e: string) => {
    setMethodValues({
      ...methodValues,
      minimum: isNft ? e.replace(/[^0-9]/g, "") : e,
    });
    setRequirementParamsList({
      ...requirementParamsList,
      ["MINIMUM"]: isNft
        ? e.replace(/[^0-9]/g, "")
        : e
          ? new Big(toWei(e, decimals)).toFixed()
          : "",
    });
  };

  useEffect(() => {
    if (!methodValues.minimum) return;
    handleChange(methodValues.minimum);
  }, [decimals]);

  useEffect(() => {
    if (!requirement) return;
    handleSelectMethod();
    setMethodValues({
      ...methodValues,
      minimum: isNft
        ? requirement.params.MINIMUM
        : new Big(
            fromWei(
              requirement.params.MINIMUM,
              requirement.decimals ? requirement.decimals : 18,
            ),
          ).toFixed(),
    });
  }, []);

  const handleShowItems = () => {
    if (isDisabled) return;
    setShowItems(!showItems);
  };

  return (
    <div ref={ref} className="relative ">
      <div
        onClick={() => handleShowItems()}
        className="bored flex h-[43px] w-full cursor-pointer items-center justify-between rounded-xl border-gray50 bg-gray40 px-3"
      >
        <div
          className={`${
            selectedMethod ? "text-white" : "text-gray80"
          }  text-sm`}
        >
          {selectedMethod ? selectedMethod : "Select Method"}
        </div>
        <Icon
          iconSrc="/assets/images/fund/arrow-down.png"
          width="14px"
          height="8px"
        />
      </div>

      {showItems && (
        <div className="absolute top-12 w-full overflow-y-scroll rounded-xl border border-gray50 bg-gray40">
          <div
            onClick={handleSelectMethod}
            className="flex h-[45px] cursor-pointer items-center rounded-lg pl-3 text-white hover:bg-gray70"
          >
            Minimum
          </div>
        </div>
      )}

      {selectedMethod && (
        <div className="mt-3 flex h-[43px] w-full items-center overflow-hidden rounded-lg border border-gray50 bg-gray40 px-3">
          <input
            className="h-full w-full bg-inherit px-2 "
            name={SelectMethod.Minimum}
            type="number"
            min={0}
            value={methodValues.minimum}
            onChange={(e) => handleChange(e.target.value)}
          />
          <div className="flex flex-col gap-3">
            <Icon
              onClick={() => handleChangeMethodValues("increase")}
              className="cursor-pointer"
              iconSrc="/assets/images/provider-dashboard/arrow-top-dark.svg"
            />
            <Icon
              onClick={() => handleChangeMethodValues("decrease")}
              className="cursor-pointer"
              iconSrc="/assets/images/provider-dashboard/arrow-down-dark.svg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectMethodInput;

export const MinimumWeb3AmountRequirementField = ({
  setRequirementParamsList,
  requirementParamsList,
  requirement,
  isNft,
  isDisabled,
  decimals,
}: Prop) => {
  const [minValue, setValue] = useState<string>("");

  useEffect(() => {
    if (!requirement) return;
    setValue(
      isNft
        ? requirement.params.MINIMUM
        : new Big(
            fromWei(
              requirement.params.MINIMUM,
              requirement.decimals ? requirement.decimals : 18,
            ),
          ).toFixed(),
    );
  }, []);

  const handleChange = (e: string) => {
    setValue(isNft ? e.replace(/[^0-9]/g, "") : e);
    setRequirementParamsList({
      ...requirementParamsList,
      ["MINIMUM"]: isNft
        ? e.replace(/[^0-9]/g, "")
        : e
          ? new Big(toWei(e, decimals)).toFixed()
          : "",
    });
  };

  useEffect(() => {
    if (!requirement || decimals === requirement.decimals || isNft) return;
    handleChange(
      new Big(
        fromWei(
          requirement.params.MINIMUM,
          requirement.decimals ? requirement.decimals : 18,
        ),
      ).toFixed(),
    );
  }, [decimals]);

  const handleChangeValue = (e: string) => {
    const finaleValue =
      e === "increase"
        ? Number(minValue) + 1
        : Math.max(0, Number(minValue) - 1);
    handleChange(finaleValue.toString());
  };

  return (
    <div className="flex h-[44px] rounded-lg bg-gray50 px-4">
      <input
        className="h-full w-full bg-inherit"
        placeholder="Minimum Amount"
        name="Minimum"
        type="number"
        min={0}
        onChange={(e) => handleChange(e.target.value)}
        value={minValue}
      />
      <div className="flex h-full flex-col items-center justify-center gap-2 text-2xs ">
        <Icon
          onClick={() => handleChangeValue("increase")}
          className="cursor-pointer"
          iconSrc="/assets/images/provider-dashboard/arrow-top-dark.svg"
        />
        <Icon
          onClick={() => handleChangeValue("decrease")}
          className="cursor-pointer"
          iconSrc="/assets/images/provider-dashboard/arrow-down-dark.svg"
        />
      </div>
    </div>
  );
};

export const MinimumNumberRequirementField = ({
  setRequirementParamsList,
  requirementParamsList,
  requirement,
  isNft,
  isDisabled,
  decimals,
}: Prop) => {
  const [minValue, setValue] = useState<string>("");

  useEffect(() => {
    if (!requirement) return;
    setValue(requirement.params.MINIMUM);
  }, []);

  const handleChange = (e: string) => {
    setValue(isNft ? e.replace(/[^0-9]/g, "") : e);
    setRequirementParamsList({
      ...requirementParamsList,
      ["MINIMUM"]: e.replace(/[^0-9]/g, ""),
    });
  };

  const handleChangeValue = (e: string) => {
    const finaleValue =
      e === "increase"
        ? Number(minValue) + 1
        : Math.max(0, Number(minValue) - 1);
    handleChange(finaleValue.toString());
  };

  return (
    <div className="flex h-[44px] rounded-lg bg-gray50 px-4">
      <input
        className="h-full w-full bg-inherit"
        placeholder="Minimum Amount"
        name="Minimum"
        type="number"
        min={0}
        onChange={(e) => handleChange(e.target.value)}
        value={minValue}
      />
      <div className="flex h-full flex-col items-center justify-center gap-2 text-2xs ">
        <Icon
          onClick={() => handleChangeValue("increase")}
          className="cursor-pointer"
          iconSrc="/assets/images/provider-dashboard/arrow-top-dark.svg"
        />
        <Icon
          onClick={() => handleChangeValue("decrease")}
          className="cursor-pointer"
          iconSrc="/assets/images/provider-dashboard/arrow-down-dark.svg"
        />
      </div>
    </div>
  );
};

export const CountRequirementField = ({
  setRequirementParamsList,
  requirementParamsList,
  requirement,
  isNft,
  isDisabled,
}: Prop) => {
  const [minValue, setValue] = useState<string>("");

  useEffect(() => {
    if (!requirement) return;
    setValue(requirement.params.COUNT);
  }, []);

  const handleChange = (e: string) => {
    setValue(isNft ? e.replace(/[^0-9]/g, "") : e);
    setRequirementParamsList({
      ...requirementParamsList,
      ["COUNT"]: e.replace(/[^0-9]/g, ""),
    });
  };

  const handleChangeValue = (e: string) => {
    const finaleValue =
      e === "increase"
        ? Number(minValue) + 1
        : Math.max(0, Number(minValue) - 1);
    handleChange(finaleValue.toString());
  };

  return (
    <div className="flex h-[44px] rounded-lg bg-gray50 px-4">
      <input
        className="h-full w-full bg-inherit"
        placeholder="COUNT"
        name="count"
        type="number"
        min={0}
        onChange={(e) => handleChange(e.target.value)}
        value={minValue}
      />
      <div className="flex h-full flex-col items-center justify-center gap-2 text-2xs ">
        <Icon
          onClick={() => handleChangeValue("increase")}
          className="cursor-pointer"
          iconSrc="/assets/images/provider-dashboard/arrow-top-dark.svg"
        />
        <Icon
          onClick={() => handleChangeValue("decrease")}
          className="cursor-pointer"
          iconSrc="/assets/images/provider-dashboard/arrow-down-dark.svg"
        />
      </div>
    </div>
  );
};

export const RoundRequirementField = ({
  setRequirementParamsList,
  requirementParamsList,
  requirement,
  isNft,
  isDisabled,
}: Prop) => {
  const [minValue, setValue] = useState<string>("");

  useEffect(() => {
    if (!requirement) return;
    setValue(requirement.params.ROUND);
  }, []);

  const handleChange = (e: string) => {
    setValue(isNft ? e.replace(/[^0-9]/g, "") : e);
    setRequirementParamsList({
      ...requirementParamsList,
      ["ROUND"]: e.replace(/[^0-9]/g, ""),
    });
  };

  const handleChangeValue = (e: string) => {
    const finaleValue =
      e === "increase"
        ? Number(minValue) + 1
        : Math.max(0, Number(minValue) - 1);
    handleChange(finaleValue.toString());
  };

  return (
    <div className="flex h-[44px] rounded-lg bg-gray50 px-4">
      <input
        className="h-full w-full bg-inherit"
        placeholder="ROUND"
        name="round"
        type="number"
        min={0}
        onChange={(e) => handleChange(e.target.value)}
        value={minValue}
      />
    </div>
  );
};

export const AddressDelegationFields = ({
  setRequirementParamsList,
  requirementParamsList,
  requirement,
  isNft,
  isDisabled,
  decimals,
}: Prop) => {
  const [minValue, setValue] = useState<string>("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!requirement || isNft) return;
    handleChange(
      new Big(
        fromWei(
          requirement.params.MINIMUM,
          requirement.decimals ? requirement.decimals : 18,
        ),
      ).toFixed(),
    );

    setAddress(requirement.params.ADDRESS);
  }, [requirement, decimals, isNft]);

  const handleChange = (e: string) => {
    setValue(isNft ? e.replace(/[^0-9]/g, "") : e);
    setRequirementParamsList({
      ...requirementParamsList,
      ["MINIMUM"]: e.replace(/[^0-9]/g, ""),
    });
  };

  const handleAddressChange = (e: string) => {
    setRequirementParamsList({
      ...requirementParamsList,
      ["ADDRESS"]: e,
    });
    setAddress(e);
  };

  const handleChangeValue = (e: string) => {
    const finaleValue =
      e === "increase"
        ? Number(minValue) + 1
        : Math.max(0, Number(minValue) - 1);
    handleChange(finaleValue.toString());
  };

  return (
    <>
      <div className="flex h-[44px] rounded-lg bg-gray50 px-4">
        <input
          className="h-full w-full bg-inherit"
          placeholder="Minimum Amount"
          name="Minimum"
          type="number"
          min={0}
          onChange={(e) => handleChange(e.target.value)}
          value={minValue}
        />
        <div className="flex h-full flex-col items-center justify-center gap-2 text-2xs ">
          <Icon
            onClick={() => handleChangeValue("increase")}
            className="cursor-pointer"
            iconSrc="/assets/images/provider-dashboard/arrow-top-dark.svg"
          />
          <Icon
            onClick={() => handleChangeValue("decrease")}
            className="cursor-pointer"
            iconSrc="/assets/images/provider-dashboard/arrow-down-dark.svg"
          />
        </div>
      </div>

      <div className="flex h-[44px] rounded-lg bg-gray50 px-4">
        <input
          className="h-full w-full bg-inherit"
          placeholder="Address"
          name="address"
          type="text"
          onChange={(e) => handleAddressChange(e.target.value)}
          value={address}
        />
      </div>
    </>
  );
};
