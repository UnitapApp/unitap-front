import * as React from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';

type props = {
    fontSize?: string;
}

export const Text = styled.p<props>`
    color: white;
    padding: 0;
    margin: 0;
    margin-bottom: 1rem;
    font-size: ${(props) => (props.fontSize) || '16'}px;
`;