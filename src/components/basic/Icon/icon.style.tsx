import styled from 'styled-components';
import { DV } from 'components/basic/designVariables';

type props = {
  width?: string;
  height?: string;
  mr?: number;
  mb?: number;
  mt?: number;
  ml?: number;
};

export const IconWrapper = styled.div<props>`
  display: flex;
  justify-content: center;

  & > img {
    width: ${(props) => props.width};
    height: ${(props) => props.height || props.width};
    padding: 0;
    margin-right: ${(props) => (props.mr ? `${props.mr * DV.sizes.baseMargin}px` : `0`)};
    margin-bottom: ${(props) => (props.mb ? `${props.mb * DV.sizes.baseMargin}px` : `0`)};
    margin-left: ${(props) => (props.ml ? `${props.ml * DV.sizes.baseMargin}px` : `0`)};
    margin-top: ${(props) => (props.mt ? `${props.mt * DV.sizes.baseMargin}px` : `0`)};
  }
`;
