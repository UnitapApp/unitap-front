import * as React from 'react';
import styled from 'styled-components/';
import { DV } from './designVariables';

interface props {
  width?: string;
  height?: string;
  mr?: number;
  color?: string;
}

// export const Xp = styled.p`
//     color: ${(props) => DV.colors[props.color]};
// `

export const Text = styled.p<props>`
  color: ${(props): string => {
    const xyz: string | undefined = Object.keys(DV.colors).find((x) => x == props.color);
    if (xyz) {
      return `${DV.colors[xyz]}!important`;
    } else return `${DV.colors.black}!important`;
  }};
`;

export const Button = styled.button<props>`
  border-radius: ${DV.sizes.baseRadius * 1.5}px;
  border: none;
  font-weight: bold;
  margin-right: ${(props) => (props.mr ? `${props.mr * DV.sizes.baseMargin}px` : `${DV.sizes.baseMargin}px`)};
  width: ${(props) => props.width || 'auto'};
  padding: ${DV.sizes.basePadding * 1.5}px ${DV.sizes.basePadding * 3}px;
`;

export const PrimaryButton = styled(Button)`
  background: ${DV.bgGradient.primary};
  color: white;
`;

export const PrimaryOutlinedButton = styled(Button)`
  /* border: 1px solid ${DV.colors.primary}; */
  color: white;
  background: ${DV.bgGradient.primary};
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  &::before {
    content: '';
    display: block;
    z-index: -1;
    position: absolute;
    background: ${DV.bgGradient.dark};
    inset: 0;
    margin: 0.1rem;
    border-radius: ${DV.sizes.baseRadius * 1.5 - 1}px;
  }
`;

export const SecondaryButton = styled(Button)``;

export const BrightOutlinedButton = styled(Button)`
  border: 1px solid ${DV.colors.bright};
  color: ${DV.colors.bright};
  background-color: ${DV.colors.black};
`;
