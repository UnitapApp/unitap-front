import Icon from "@/components/ui/Icon";
import Styles from "../content.module.scss";
import { DisplayStepsProps } from "@/types/provider-dashboard";

interface Prop {
  page: number;
  displaySteps: DisplayStepsProps[];
}

const DisplaySteps = ({ page, displaySteps }: Prop) => {
  return (
    <div
      className={`${Styles.offerPrizeSteps} flex w-full select-none flex-col gap-[3.1em] px-10 py-[4em] md:max-w-[362px]`}
    >
      {displaySteps.map((item, index) => (
        <div
          className="relative flex items-center gap-3 text-xs text-white"
          key={index}
        >
          <div className="z-[1] h-6 w-6 overflow-hidden rounded-full bg-gray30">
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
                  ? "opacity-40"
                  : "text-space-green opacity-40"
            } `}
          >
            <p className={`font-semibold`}>{item.title}</p>{" "}
            <p
              className={`${index >= page ? "text-gray100" : "text-space-green"}`}
            >
              {item.description}
            </p>
          </div>
          {index < 5 && (
            <div
              className={`absolute bottom-[-4.6em] left-3 top-7 w-[2px] ${
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
