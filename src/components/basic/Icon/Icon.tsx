import * as React from 'react';
import { IconWrapper } from './icon.style';

type props = {
  iconSrc: string;
  width?: string;
  height?: string;
  className?: string;
};

const Icon = ({ iconSrc, width, height, className}: props) => (
  <IconWrapper className={className} width={width} height={height}>
    <img src={iconSrc} alt="" />
  </IconWrapper>
);

export default Icon;
