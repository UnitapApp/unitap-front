import * as React from 'react';
import { IconWrapper } from './icon.style';

type props = {
  iconSrc: string;
  width: string;
  height?: string;
};

const Icon = ({ iconSrc, width, height}: props) => (
  <IconWrapper width={width} height={height}>
    <img src={iconSrc} alt="" />
  </IconWrapper>
);

export default Icon;
