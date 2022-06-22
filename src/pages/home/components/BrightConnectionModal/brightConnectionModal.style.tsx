import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';

interface props {
  warning?: boolean;
}

export const BrightConnectionModalWrapper = styled.div<props>`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: ${DV.sizes.basePadding * 2}px;

  & > img {
    width: 2rem;
    margin-bottom: 1rem;
  }

  & .qr-code {
    width: 70%;
    z-index: 10;
  }
  border-radius: 18px;


  ${({ warning }) => warning ? `border: 2px solid ${DV.colors.warningRed}` : ''};
`;

export const CopyLink = styled.div`
  display: flex;
  color: ${DV.colors.green};

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  & > img {
    height: 1.5rem;
    width: auto;
    margin: 0 0.5rem 0 0;
  }

  z-index: 10;
`;
