import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';


export const ClaimModalWrapper = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: ${DV.sizes.basePadding * 2}px;
`;

export const DropIconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  & > img {
    position: absolute;
    top: 43px;
  }

  .state-logo {
    position: absolute;
    right: -10px;
    top: 56px;
  }
`;
