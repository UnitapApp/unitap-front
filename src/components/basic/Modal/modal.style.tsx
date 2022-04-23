import * as React from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';

export const ModalWrapper = styled.div`
  position: fixed;
  z-index: 1;
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

export const ModalChildrenWrapper = styled.div`
  width: 37%;
  min-height: 3rem;

  margin: ${DV.sizes.baseMargin * 2}px auto;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${DV.colors.transparent_black};
  border-radius: ${DV.sizes.baseRadius * 2}px;
`;

export const ModalContent = styled.div`
  background-color: ${DV.colors.black1};
  width: 45%;
  position: relative;
  border-radius: ${DV.sizes.baseRadius * 2}px;
  padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 5}px;
  min-height: 50vh;
  overflow: hidden;

  .close {
    position: absolute;
    right: 0;
    top: 0;
    padding: ${DV.sizes.basePadding}px ${DV.sizes.basePadding * 2}px;
    color: white;
    float: right;
    font-size: 28px;
    font-weight: bold;

    &:hover {
      cursor: pointer;
    }
  }

  .modal-title {
    color: white;
    margin: 0;
    padding: 0;
  }

  .bottom-background {
    width: 100%;
    height: 100px;
    border-radius: 0 0 ${DV.sizes.baseRadius}px ${DV.sizes.baseRadius}px;
    position: absolute;
    bottom: 0;
    left: 0;
    background-image: url('./assets/images/modal-footer-bg.png');
    background-size: cover;
    -o-background-size: cover;
    -moz-background-size: cover;
    -webkit-background-size: cover;
  }

  .spaceman-one {
    position: absolute;
    right: -3rem;
    bottom: 0;
    width: 17rem;
  }

  .spaceman-two {
    position: absolute;
    right: 0.5rem;
    top: 7rem;
    width: 7rem;
  }
`;
