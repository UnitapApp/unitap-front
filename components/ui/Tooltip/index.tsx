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
        className={`absolute bottom-full left-1/2 z-20 mb-1 w-full -translate-x-1/2 rounded-md border border-gray70 bg-gray10 p-2 text-center text-xs text-gray100 opacity-0 transition-opacity ${toolTipClassName} ${
          showTooltip
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none"
        }`}
      >
        <div className="absolute left-1/2 top-full -mt-1 h-2 w-2 -translate-x-1/2 -rotate-45 transform rounded-bl border-b border-l border-gray70 bg-gray10" />
        <div>
          {withoutImage || (
            <Image
              alt="tooltip"
              width={12}
              height={12}
              className="inline-block h-3 w-3"
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
