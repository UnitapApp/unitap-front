import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';

interface props {
  warning?: boolean;
}

export const BrightConnectionModalWrapper = styled.div<props>`
  & > img {
    width: 2rem;
    margin-bottom: 1rem;
  }

  ${({ warning }) => warning ? `border: 2px solid ${DV.colors.warningRed}` : ''};
`;

export const CopyLink = styled.div`

  & > img {
    height: 1.5rem;
    width: auto;
    margin: 0 0.5rem 0 0;
  } 
`;
