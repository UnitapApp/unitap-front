import * as React from "react";
import { IconWrapper } from "./icon.style";

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  width?: string;
  height?: string;
  smWidth?: string;
  xsWidth?: string;
  mr?: number;
  mrAuto?: boolean;
  mb?: number;
  smMb?: number;
  ml?: number;
  mt?: number;
  hoverable?: boolean;
  iconSrc: string;
  alt?: string;
}

const Icon = ({ iconSrc, hoverable, className, ...props }: IconProps) => (
  <IconWrapper
    {...props}
    className={`${hoverable ? "cursor-pointer" : ""} ${className}`}
  >
    <img src={iconSrc} alt={props.alt} />
  </IconWrapper>
);

export default Icon;
