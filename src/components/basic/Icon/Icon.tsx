import * as React from 'react';
import { IconWrapper } from './icon.style';

type props = {
  iconSrc: string;
  width?: string;
  height?: string;
  className?: string;
  mr?: number;
  mb?: number;
  ml?: number;
  mt?: number;
  hoverable?: boolean;
};

const Icon = ({ iconSrc, width, height, mr, mb, ml, mt, hoverable, className }: props) => (
  <IconWrapper
    className={className}
    width={width}
    height={height}
    mr={mr}
    ml={ml}
    mt={mt}
    mb={mb}
    hoverable={hoverable}
  >
    <img src={iconSrc} alt="" />
  </IconWrapper>
);

export default Icon;
