import * as React from 'react';
import styled from 'styled-components/';
import { DV } from '../designVariables';

interface props {
  width?: string;
}

export const Input = styled.input<props>`
  padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 4}px;
  width: ${(props) => props.width || 'auto'};
  color: white;
  background: ${DV.colors.dark};
  border-radius: ${DV.sizes.baseRadius}px;
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  margin-bottom: 1rem;
  &::before {
    content: '';
    display: block;
    z-index: -1;
    position: absolute;
    background: ${DV.bgGradient.primary};
    inset: 0;
    margin: 0.1rem;
    border-radius: ${DV.sizes.baseRadius * 1.5 - 1}px;
  }
`;
