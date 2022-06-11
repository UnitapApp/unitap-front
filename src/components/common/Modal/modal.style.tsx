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
  background-color: ${DV.colors.black1};
  ${({ size }) =>
    size === 'small'
      ? `width: min(420px, 30vw);`
      : size === 'large'
      ? `width: min(1000px, 90%);`
      : `width: min(750px, 90%);`}
  margin: 0 5%;
  position: relative;
  border-radius: ${DV.sizes.baseRadius * 2}px;
  padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 3}px;
  overflow: hidden;
  z-index: -2;

  .close {
    position: absolute;
    right: ${DV.sizes.basePadding * 2}px;
    top: ${DV.sizes.basePadding * 1.5}px;
    padding: ${DV.sizes.basePadding}px ${DV.sizes.basePadding * 2}px;
    color: white;
    float: right;
    font-size: 28px;
    font-weight: bold;
    z-index: 10;

    &:hover {
      cursor: pointer;
    }
  }

  .modal-title {
    color: white;
    margin: 0;
    padding: 0;
  }

  .spaceman-one {
    position: absolute;
    right: 0rem;
    bottom: 0;
    width: 250px;
    z-index: -1;
    @media only screen and (max-width: ${DV.breakpoints.mobile}) {
      width: 200px;
    }
  }

  .spaceman-two {
    position: absolute;
    right: 0.5rem;
    top: 7rem;
    width: 7rem;
  }

  .spaceman-three {
    position: absolute;
    right: -5rem;
    top: 2rem;
    width: 23rem;
  }
`;

export const ModalChildrenWrapper = styled.div<props>`
  background-color: ${DV.colors.transparent_black};
  ${({ size }) => (size === 'small' ? `background-color: ${DV.colors.black1};` : ``)}
  margin: ${DV.sizes.baseMargin * 2}px auto;

  border-radius: ${DV.sizes.baseRadius * 2}px;
  z-index: 10;
  width: min(330px, 90%);
  ${({ size }) => (size === 'small' ? ` width: 100%;` : ``)}

  .spaceman-one {
  }

  @media only screen and (max-width: 600px) {
    .spaceman-three {
      z-index: -1;
    }
  }
`;
