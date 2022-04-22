import * as React from 'react';
import styled from 'styled-components/'
import { DV } from './designVariables'


interface props {
    width?: string;
    height?: string;
    mr?: number;
  }

export const Button = styled.button<props>`
    border-radius: ${DV.sizes.baseRadius * 1.5}px;
    border: none;
    font-weight: bold;
    margin-right: ${props => (props.mr ? `${props.mr * DV.sizes.baseMargin}px` : `${DV.sizes.baseMargin}px`)};
    width: ${props => props.width || 'auto'};
    padding: ${DV.sizes.basePadding * 1.5}px ${DV.sizes.basePadding * 3}px;
`

export const PrimaryButton = styled(Button)`
    background-color: ${DV.colors.primary};
    color: ${DV.colors.black};
    
`

export const PrimaryOutlinedButton = styled(Button)`
    border: 1px solid ${DV.colors.primary};
    color: white;
    background-color: ${DV.colors.black};
`

export const BrightOutlinedButton = styled(Button)`
    border: 1px solid ${DV.colors.bright};
    color: ${DV.colors.bright};
    background-color: ${DV.colors.black};
`