import Icon from "@/components/ui/Icon";

type DepositContentProp = {
  title: string;
  description: string;
  icon: string;
};

const DepositContent = ({ title, description, icon }: DepositContentProp) => {
  return (
    <div className="text-center">
      <Icon iconSrc={icon} className="mb-5" width="90px" height="90px" />
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-gray100 text-xs mt-2">{description}</p>
      </div>
    </div>
  );
};

export default DepositContent;
