import Icon from "@/components/ui/Icon";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";

const RenderInitialBody = () => {
  const { handleSelectConstraint, constraintsList } =
    usePrizeOfferFormContext();
  return (
    <div className="flex flex-col gap-2 ">
      <div className="absolute top-5 cursor-pointer z-[999]">
        <Icon
          iconSrc="/assets/images/provider-dashboard/arrow-left.svg"
          className="cursor-pointer z-[999999]"
        />
      </div>
      <p className="text-white text-[14px] font-medium">General</p>
      <div className="grid grid-cols-2 gap-2.5 row-gap-2 w-full items-center justify-center text-center">
        {constraintsList.map((constraint, index) => (
          <div
            key={index}
            className="requireModal"
            onClick={() => handleSelectConstraint(constraint)}
          >
            {constraint.iconUrl && <Icon iconSrc={constraint.iconUrl} />}
            {constraint.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenderInitialBody;
