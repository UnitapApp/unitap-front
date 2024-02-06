import Icon from "@/components/ui/Icon";

type DepositContentProp = {
  title: string;
  description: string;
  icon: string;
  isNFT: boolean;
};

const DepositContent = ({
  title,
  description,
  icon,
  isNFT,
}: DepositContentProp) => {
  return (
    <div className="text-center">
      <Icon
        iconSrc={icon}
        className="mb-5"
        height={isNFT ? "96px" : "90px"}
        width={isNFT ? "84x" : "90px"}
      />
      <div>
        <p className="text-[14px] font-semibold text-white">{title}</p>
        <p className="text-gray100 text-[12px] mt-2">{description}</p>
      </div>
    </div>
  );
};

export default DepositContent;
