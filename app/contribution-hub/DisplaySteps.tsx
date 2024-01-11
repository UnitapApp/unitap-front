import Icon from "@/components/ui/Icon";
import Styles from "./content.module.scss";
import { DisplayStepsProps } from "@/types/provider-dashboard";

interface Prop {
  page: number;
  displaySteps: DisplayStepsProps[];
}

const DisplaySteps = ({ page, displaySteps }: Prop) => {
  return (
    <div
      className={`${Styles.offerPrizeSteps} offerPrize-Steps w-full md:max-w-[362px] py-[4em] px-10 flex flex-col gap-[3.1em] select-not`}
    >
      {displaySteps.map((item, index) => (
        <div
          className="flex items-center gap-3 relative text-[12px] text-white"
          key={index}
        >
          <div className="rounded-full bg-gray30 overflow-hidden w-[26px] h-[26px] z-[1]">
            <Icon
              width="26px"
              height="26px"
              iconSrc={
                index == page
                  ? item.activeIcon
                  : index > page
                  ? item.nextIcon
                  : item.prevIcon
              }
            />
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
                index < page ? "bg-dark-space-green" : "bg-gray70"
              }  top-0`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DisplaySteps;
