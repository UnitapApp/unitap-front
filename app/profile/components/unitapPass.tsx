import Icon from "@/components/ui/Icon";

export const UnitapPass = () => {
  return (
    <div className="bg-gray20 mt-10 rounded-2xl">
      <div className="flex p-5 items-center justify-between">
        <h5 className="text-gray100">Lock Unitap Pass</h5>
        <p className="text-secondary-text text-sm">Coming soon...</p>
      </div>

      <div className="py-20 text-center">
        <Icon iconSrc="/assets/images/up-profile/locked.svg" />
        <p className="text-gray80 mt-4">You have no Unitap Pass!</p>
      </div>
    </div>
  );
};

export default UnitapPass;
