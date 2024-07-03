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
  const [isCollapseOpen, setIsCollapseOpen] = useState(initState || false);

  return (
    <div
      className={`collapse-card collapse w-full overflow-y-hidden ${className}`}
    >
      <div
        onClick={() => {
          setIsCollapseOpen(!isCollapseOpen);
        }}
        className="collapse-content flex cursor-pointer items-center"
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
        className={`collapse__data ml-1 overflow-y-hidden text-justify md:ml-16 md:mr-6 md:text-left ${
          isCollapseOpen ? "open-collapse" : "close-collapse"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Collapse;
