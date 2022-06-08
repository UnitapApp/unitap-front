import styled from 'styled-components';
import { DV } from 'components/basic/designVariables';

type props = {
  width?: string;
  smWidth?: string;
  height?: string;
  mr?: number;
  mb?: number;
  smMb?: number;
  mt?: number;
  ml?: number;
  hoverable?: boolean;
};

export const IconWrapper = styled.span<props>`
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

  ${(props) => (props.hoverable ? `&:hover {cursor: pointer;}` : ``)}

  @media only screen and (max-width: 1224px) {
    & > img {
      width: ${(props) => props.smWidth};
      margin-bottom: ${(props) =>
        props.smMb ? `${props.smMb * DV.sizes.baseMargin}px` : props.mb ? `${props.mb * DV.sizes.baseMargin}px` : `0`};
    }
  }
`;
