import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';

type props = {
  fontSize?: string;
  smFontSize?: string;
  color?: string;
  width?: string;
  textAlign?: string;
  mr?: number;
  mb?: number;
};

export const Text = styled.p<props>`
  color: ${(props): string => {
    const xyz: string | undefined = Object.keys(DV.colors).find((x) => x === props.color);
    if (xyz) {
      return `${DV.colors[xyz]}!important`;
    } else return `white !important`;
  }};
  font-size: ${(props) => props.fontSize || '16'}px;
  padding: 0;
  margin: 0;
  width: ${(props) => props.width || 'auto'};
  margin-right: ${(props) => (props.mr ? `${props.mr * DV.sizes.baseMargin}px` : `0`)};
  margin-bottom: ${(props) => (props.mb ? `${props.mb * DV.sizes.baseMargin}px` : `1rem`)};
  text-align: ${(props) => props.textAlign || 'left'};

  @media only screen and (max-width: 1224px) {
    font-size: ${(props) => props.smFontSize || '15'}px;
  }
`;
