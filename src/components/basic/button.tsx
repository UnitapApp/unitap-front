import * as React from 'react';
import styled from 'styled-components/'
import { DV } from './designVariables'


export const Button = styled.button`
    border-radius: ${DV.sizes.baseRadius}px;
    background-color: #ccc;
    border: none;
    padding: ${DV.sizes.basePadding}px ${DV.sizes.basePadding * 2}px
`