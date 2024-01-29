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
    console.log(decimals);
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
    console.log("++++");
    handleSelectMethod();
    setMethodValues({
      ...methodValues,
      minimum: isNft
        ? requirement.params.MINIMUM
        : new Big(
            fromWei(
              requirement.params.MINIMUM,
              requirement.decimals ? requirement.decimals : 18
            )
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
        className="flex w-full items-center justify-between bored border-gray50 bg-gray40 rounded-xl px-3 h-[43px] cursor-pointer"
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
        <div className="absolute w-full top-12 bg-gray40 rounded-xl border border-gray50 overflow-y-scroll">
          <div
            onClick={handleSelectMethod}
            className="flex pl-3 cursor-pointer items-center hover:bg-gray70 text-white rounded-lg h-[45px]"
          >
            Minimum
          </div>
        </div>
      )}

      {selectedMethod && (
        <div className="flex items-center bg-gray40 border border-gray50 px-3 h-[43px] w-full mt-3 rounded-lg overflow-hidden">
          <input
            className="bg-inherit h-full px-2 w-full "
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
