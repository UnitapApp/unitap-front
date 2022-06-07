import * as React from 'react';
import { IconWrapper } from './icon.style';

type props = {
  iconSrc: string;
  smWidth?: string;
  width?: string;
  height?: string;
  className?: string;
  mr?: number;
  mb?: number;
  smMb?: number;
  ml?: number;
  mt?: number;
  hoverable?: boolean;
};

const Icon = ({ iconSrc, width, smWidth, height, mr, mb, smMb, ml, mt, hoverable, className }: props) => (
  <IconWrapper
    className={className}
    width={width}
    smWidth={smWidth}
    height={height}
    mr={mr}
    smMb={smMb}
    ml={ml}
    mt={mt}
    mb={mb}
    hoverable={hoverable}
  >
    <img src={iconSrc} alt="" />
  </IconWrapper>
);

export default Icon;
