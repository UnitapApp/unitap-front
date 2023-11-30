import { PrizeInfoDescription } from "./PrizeInfo";
import { TimeEnrollLimitationDescription } from "./TimeEnrollLimitation";
import { RequirementDescription } from "./Requirements";
import { socialMediaDescription } from "./ContactInformation";
import { DepositDescription } from "./DepositPrize";
import { InformationVerificationDes } from "./InformationVerification";
import Icon from "@/components/ui/Icon";

const displaySteps = [
  PrizeInfoDescription,
  TimeEnrollLimitationDescription,
  RequirementDescription,
  socialMediaDescription,
  DepositDescription,
  InformationVerificationDes,
];

interface DisplayStepsProp {
  page: number;
}

const DisplaySteps = ({ page }: DisplayStepsProp) => {
  return (
    <div className="offerPrize-Steps w-full md:max-w-[362px] py-[4em] px-10 flex flex-col gap-[3.1em] select-not">
      {displaySteps.map((item, index) => (
        <div
          className="flex items-center gap-3 relative text-[12px] text-white"
          key={index}
        >
          <div className="prizeForm-current-step-icon z-[1]">
            <Icon
              iconSrc={
                index == page
                  ? item.activeIcon
                  : index > page
                  ? item.nextIcon
                  : item.prevIcon
              }
            />{" "}
          </div>
          <div
            className={`${
              index == page
                ? "text-white"
                : index > page
                ? "opacity-[.4]"
                : "text-[#4CE6A1] opacity-[.4]"
            } `}
          >
            <p className={`font-semibold`}>{item.title}</p>{" "}
            <p
              className={`${index >= page ? "text-gray100" : "text-[#4CE6A1]"}`}
            >
              {item.description}
            </p>
          </div>
          {index < 5 && (
            <div
              className={`absolute w-[2px] left-3 top-7 bottom-[-4.6em] ${
                index < page ? "bg-[#274641]" : "bg-gray70"
              }  top-0`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DisplaySteps;
