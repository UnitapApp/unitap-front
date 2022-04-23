import * as React from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';

type props = {
  fontSize?: string;
  color?: string;
};

export const Text = styled.p<props>`
  color: ${(props): string => {
    const xyz: string | undefined = Object.keys(DV.colors).find((x) => x == props.color);
    if (xyz) {
      return `${DV.colors[xyz]}!important`;
    } else return `white !important`;
  }};
  font-size: ${(props) => props.fontSize || '16'}px;
  padding: 0;
  margin: 0;
  margin-bottom: 1rem;
`;

