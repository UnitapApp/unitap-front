import Icon from "@/components/ui/Icon";
import React, { useState } from "react";

interface CollapseProps {
  title: string;
  icon: string;
  className?: string;
  children?: React.ReactNode;
  initState?: boolean;
}

const Collapse = ({
  className,
  title,
  icon,
  children,
  initState,
}: CollapseProps) => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  return (
    <div className="mt-3">
      <div
        onClick={() => {
          setIsCollapseOpen(!isCollapseOpen);
        }}
        className="collapse-content flex h-[60px] cursor-pointer items-center rounded-xl bg-gray20 px-4"
      >
        <Icon
          className="mr-7 md:ml-3"
          iconSrc={icon}
          height="28px"
          width="22px"
        />
        <p className="title"> {title} </p>
        <Icon
          className={`ml-auto transition-all duration-300 ${
            isCollapseOpen && "rotate-180"
          }`}
          iconSrc="assets/images/nft/nft-collapse-arrow.svg"
          width="14px"
          height="auto"
        />
      </div>
      <div
        className={`grid grid-rows-[0fr] transition-all duration-300 ${isCollapseOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} `}
      >
        <div className="mt-3 overflow-hidden">{children}</div>
      </div>
    </div>
  );
};

export default Collapse;
