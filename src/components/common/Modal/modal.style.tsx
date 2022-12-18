import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';

interface props {
  size?: 'small' | 'medium' | 'large';
}

export const ModalWrapper = styled.div<props>`
  position: fixed;
  z-index: 1010;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.div<props>`
  ${({ size }) =>
    size === 'small'
      ? `width: min(420px, 90%);`
      : size === 'large'
      ? `width: min(1000px, 90%);`
      : `width: min(880px, 90%);`}
  margin: 0 5%;
  position: relative;
  padding: ${DV.sizes.basePadding * 2}px;
  overflow: hidden;
  z-index: -2;

  }
`;

export const ModalChildrenWrapper = styled.div<props>`
  background-color: ${DV.colors.transparent_black};
  ${({ size }) => (size === 'small' ? `background-color: ${DV.colors.black1};` : ``)}

  border-radius: ${DV.sizes.baseRadius * 2}px;
  z-index: 10;
  width: min(330px, 90%);

  ${({ size }) => (size === 'small' ? ` width: 100%;` : ``)}

  @media only screen and (max-width: 600px) {
    .spaceman-three {
      z-index: -1;
    }
  }
`;
