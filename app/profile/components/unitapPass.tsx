import Icon from "@/components/ui/Icon";

export const UnitapPass = () => {
  return (
    <div className="mt-10 rounded-2xl bg-gray20">
      <div className="flex items-center justify-between p-5">
        <h5 className="text-gray100">Lock Unitap Pass</h5>
        <p className="text-sm text-secondary-text">Coming soon...</p>
      </div>

      <div className="py-20 text-center">
        <Icon iconSrc="/quest/assets/images/up-profile/locked.svg" />
        <p className="mt-4 text-gray80">You have no Unitap Pass!</p>
      </div>
    </div>
  );
};

export default UnitapPass;
