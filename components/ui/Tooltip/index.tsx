"use client";

import { FC, PropsWithChildren, ReactNode, useState, MouseEvent } from "react";
import Image from "next/image";

const Tooltip: FC<
  PropsWithChildren & {
    text: string | ReactNode;
    className?: string;
    toolTipClassName?: string;
    onClick?: (e: MouseEvent) => void;
    imageUrl?: string;
    withoutImage?: boolean;
  }
> = ({
  text,
  children,
  className = "",
  toolTipClassName = "",
  withoutImage,
  imageUrl,
  ...props
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={"relative inline-block " + className}
      {...props}
    >
      <span>{children}</span>

      <div
        className={`absolute bottom-full mb-3 -translate-x-1/2 left-1/2 w-full p-2 bg-gray10 text-gray100 text-center border-gray70 border rounded-md text-xs transition-opacity opacity-0 ${toolTipClassName} ${
          showTooltip
            ? "opacity-100 pointer-events-auto"
            : "pointer-events-none"
        }`}
      >
        <div className="absolute top-full -mt-[0.3rem] transform -translate-x-1/2 left-1/2 rounded-bl bg-gray10 border-b border-l border-gray70 w-3 h-3 -rotate-45" />
        <div>
          {withoutImage || (
            <Image
              alt="tooltip"
              width={12}
              height={12}
              className="inline-block w-3 h-3"
              src={imageUrl ?? "/assets/images/tooltip.svg"}
            />
          )}

          <span className="ml-1">{text}</span>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
