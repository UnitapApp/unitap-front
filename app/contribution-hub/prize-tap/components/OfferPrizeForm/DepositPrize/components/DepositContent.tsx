import Icon from "@/components/ui/Icon";

type DepositContentProp = {
  title: string;
  description: string;
  icon: string;
};

const DepositContent = ({ title, description, icon }: DepositContentProp) => {
  return (
    <div className="text-center">
      <Icon iconSrc={icon} className="mb-5" />
      <div>
        <p className="text-[14px] font-semibold text-white">{title}</p>
        <p className="text-gray100 text-[12px] mt-2">{description}</p>
      </div>
    </div>
  );
};

export default DepositContent;
