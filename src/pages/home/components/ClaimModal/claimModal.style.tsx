import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';

interface props {
  imgPositionLeft?: string,
  imgPositionTop: string
}

export const ClaimModalWrapper = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: ${DV.sizes.basePadding * 2}px;
`;

export const DropIconWrapper = styled.div<props>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  & > img {
    position: absolute;
    top: ${({imgPositionTop})=> imgPositionTop};
    left: ${({imgPositionLeft})=> imgPositionLeft || ''};
  }
`;
