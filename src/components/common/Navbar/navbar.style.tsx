import styled from 'styled-components';
import { DV } from 'components/basic/designVariables';

export const DesktopNav = styled.div`
  display: none;
  @media only screen and (min-width: ${DV.breakpoints.tablet}) {
    display: flex;
    display: flex;
    align-items: center;
  }
`;

export const MobileNav = styled.div`
  display: none;
  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    display: block;
  }

  .checkbox {
    position: absolute;
    display: block;
    height: 32px;
    width: 32px;
    top: 20px;
    right: 20px;
    z-index: 1002;
    opacity: 0;
    cursor: pointer;
  }

  .hamburger-lines {
    height: 26px;
    width: 32px;
    padding-left: ${DV.sizes.basePadding * -2}px;
    position: absolute;
    top: ${DV.sizes.basePadding * 2}px;
    right: 20px;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .line {
      display: block;
      height: 4px;
      width: 100%;
      border-radius: 10px;
      background: white;
    }

    .line1 {
      transform-origin: 0% 0%;
      transition: transform 0.4s ease-in-out;
    }

    .line2 {
      transition: transform 0.2s ease-in-out;
    }

    .line3 {
      transform-origin: 0% 100%;
      transition: transform 0.4s ease-in-out;
    }
  }

  .menu-items {
    position: fixed;
    z-index: 1000;
    box-sizing: border-box;
    inset: 0;
    padding: ${DV.sizes.basePadding * 8}px ${DV.sizes.basePadding * 4}px;
    background-color: rgba(5, 5, 5, 0.65);
    /* height: 100vh; */
    width: 100%;
    transform: translate(-100%);
    display: flex;
    justify-content: center;
    flex-direction: column;
    transition: transform 0.5s ease-in-out;
    text-align: center;
  }

  input[type='checkbox']:checked ~ .hamburger-lines .line1 {
    transform: rotate(45deg);
  }

  input[type='checkbox']:checked ~ .hamburger-lines .line2 {
    transform: scaleY(0);
  }

  input[type='checkbox']:checked ~ .hamburger-lines .line3 {
    transform: rotate(-45deg);
  }

  input[type='checkbox']:checked ~ .menu-items {
    transform: translateX(0);
  }
`;
