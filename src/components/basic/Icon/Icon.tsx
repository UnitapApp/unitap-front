import * as React from 'react';
import { IconWrapper } from './icon.style';

type props = {
  iconSrc: string;
  width?: string;
  height?: string;
  className?: string;
  mr?: number;
  hoverable?: boolean;
};

const Icon = ({ iconSrc, width, height, mr, hoverable, className}: props) => (
  <IconWrapper className={className} width={width} height={height} mr={mr} hoverable={hoverable}>
    <img src={iconSrc} alt="" />
  </IconWrapper>
);

export default Icon;
