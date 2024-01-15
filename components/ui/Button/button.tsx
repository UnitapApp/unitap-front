"use client";

import styled from "styled-components";
import tw from "tailwind-styled-components";

import { DV } from "../designVariables";

interface props {
  $width?: string;
  $minWidth?: string;
  $iconWidth?: number;
  $smIconWidth?: number;
  $iconHeight?: number;
  $smIconHeight?: number;
  $iconMarginLeft?: number;
  $smIconMarginLeft?: number;
  $iconLeftWidth?: number;
  $smIconLeftWidth?: number;
  $iconLeftHeight?: number;
  $smIconLeftHeight?: number;
  $iconLeftMarginLeft?: number;
  $smIconLeftMarginLeft?: number;
  height?: string;
  $mlAuto?: boolean;
  $mr?: number;
  $smMr?: number;
  $mb?: number;
  $smMb?: number;
  color?: string;
  disabled?: boolean;
  $icon?: string;
  $iconLeft?: string;
  $fontSize?: string;
  smFontSize?: string;
  fontWeight?: string;
  size?: "small" | "large";
}

export const Text = styled.p<props>`
  color: ${({ color }): string => {
    const xyz: string | undefined = Object.keys(DV.colors).find(
      (x) => x === color
    );
    if (xyz) {
      return `${DV.colors[xyz]}!important`;
    } else return `${DV.colors.black}!important`;
  }};
`;

export const ButtonNative = styled.button<props>`
  position: relative;
  font-weight: ${({ fontWeight }) => fontWeight || "bold"};
  margin-bottom: ${({ $mb: mb }) =>
    mb ? `${mb * DV.sizes.baseMargin}px` : ""};
  margin-left: ${({ $mlAuto: mlAuto }) => (mlAuto ? "auto" : "")};
  width: ${({ $width: width }) => width || "auto"};
  min-width: ${({ $minWidth: minWidth }) => minWidth || "auto"};
  height: ${({ height }) => height || "auto"};
  font-size: ${({ $fontSize: fontSize }) => fontSize || "auto"};
  cursor: ${({ disabled }) => (disabled ? "" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  ${({ size }) =>
    size === "large" ? `padding: 1em 2.5em;` : `padding: .75em 1.25em;`}
  &::before {
    display: ${({ $iconLeft: iconLeft }) =>
      iconLeft ? "inline-block" : "none"};
    content: " ";
    background-image: ${({ $iconLeft: iconLeft }) =>
      iconLeft ? `url(${iconLeft})` : "none"};
    position: relative;
    top: 2px;
    background-size: ${({
      $iconLeftWidth: iconLeftWidth,
      $iconLeftHeight: iconLeftHeight,
    }) => `${iconLeftWidth}px ${iconLeftHeight}px` || "0 0"};
    width: ${({ $iconLeftWidth: iconLeftWidth }) =>
      `${iconLeftWidth}px` || "auto"};
    height: ${({ $iconLeftHeight: iconLeftHeight }) =>
      `${iconLeftHeight}px` || "auto"};
    margin-right: ${({ $iconLeftMarginLeft: iconLeftMarginLeft }) =>
      iconLeftMarginLeft ? iconLeftMarginLeft : "12"}px;
    margin-left: -12px;
    margin-top: -2px;
  }

  &::after {
    display: ${({ $icon: icon }) => (icon ? "inline-block" : "none")};
    content: " ";
    background-image: ${({ $icon: icon }) => `url(${icon})` || "none"};
    position: relative;
    top: 2px;
    background-size: ${({ $iconWidth: iconWidth, $iconHeight: iconHeight }) =>
      `${iconWidth}px ${iconHeight}px` || "0 0"};
    width: ${({ $iconWidth: iconWidth }) => `${iconWidth}px` || "auto"};
    height: ${({ $iconHeight: iconHeight }) => `${iconHeight}px` || "auto"};
    margin-left: ${({ $iconMarginLeft: iconMarginLeft }) =>
      iconMarginLeft ? iconMarginLeft : "12"}px;
  }

  ${({ disabled }) => (disabled ? `` : `&:hover {cursor: pointer;}`)}

  @media only screen and(${DV.breakpoints.smallDesktop}) {
    font-size: ${({ smFontSize, $fontSize: fontSize }) =>
      smFontSize || fontSize || "auto"};
    margin-right: ${({ $smMr: smMr, $mr: mr }) =>
      smMr
        ? `${smMr * DV.sizes.baseMargin}px`
        : mr
        ? `${mr * DV.sizes.baseMargin}px`
        : `0`};
    margin-bottom: ${({ $smMb: smMb, $mb: mb }) =>
      smMb
        ? `${smMb * DV.sizes.baseMargin}px`
        : mb
        ? `${mb * DV.sizes.baseMargin}px`
        : `0`};

    &::before {
      background-size: ${({
        $smIconLeftWidth: smIconLeftWidth,
        $smIconLeftHeight: smIconLeftHeight,
      }) => `${smIconLeftWidth}px ${smIconLeftHeight}px` || "0 0"};
      width: ${({
        $smIconLeftWidth: smIconLeftWidth,
        $iconLeftWidth: iconLeftWidth,
      }) => `${smIconLeftWidth}px` || `${iconLeftWidth}px` || "auto"};
      height: ${({
        $smIconLeftHeight: smIconLeftHeight,
        $iconLeftHeight: iconLeftHeight,
      }) => `${smIconLeftHeight}px` || `${iconLeftHeight}px` || "auto"};
      margin-left: ${({
        $smIconLeftMarginLeft: smIconLeftMarginLeft,
        $iconLeftMarginLeft: iconLeftMarginLeft,
      }) => `${smIconLeftMarginLeft}px` || `${iconLeftMarginLeft}px` || "12px"};
    }

    &::after {
      background-size: ${({
        $smIconWidth: smIconWidth,
        $smIconHeight: smIconHeight,
      }) => `${smIconWidth}px ${smIconHeight}px` || "0 0"};
      width: ${({ $smIconWidth: smIconWidth, $iconWidth: iconWidth }) =>
        `${smIconWidth}px` || `${iconWidth}px` || "auto"};
      height: ${({ $smIconHeight: smIconHeight, $iconHeight: iconHeight }) =>
        `${smIconHeight}px` || `${iconHeight}px` || "auto"};
      margin-left: ${({
        $smIconMarginLeft: smIconMarginLeft,
        $iconMarginLeft: iconMarginLeft,
      }) => `${smIconMarginLeft}px` || `${iconMarginLeft}px` || "12px"};
    }
  }
`;

export const Button = tw(ButtonNative)`rounded-xl`;

export const PrimaryButton = styled(Button)`
  background: ${({ disabled }) =>
    disabled ? `${DV.bgGradient.primaryDisabled}` : `${DV.bgGradient.primary}`};
  color: ${({ disabled }) => (disabled ? `${DV.colors.gray}` : "white")};
`;

export const PrimaryOutlinedButtonNative = styled(Button)`
  // border: 1px solid ${DV.colors.primary};
  // color: ${({ disabled }) => (disabled ? "#C0AFC7" : "white")};
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    display: block;
    z-index: -1;
    position: absolute;
    inset: 0;
    margin: 0.1rem;
  }
`;

export const PrimaryOutlinedButton = tw(
  PrimaryOutlinedButtonNative
)`bg-g-primary before:rounded-xl before:bg-g-primary`;

export const LightOutlinedButton = styled(Button)`
  background: transparent;
  color: white;
  border: 2px solid ${DV.colors.gray90};
  border-radius: ${DV.sizes.baseRadius}px;
`;

export const LightOutlinedButtonNew = styled(Button)`
  background: transparent;
  color: white;
  border: 2px solid white;
  border-radius: ${DV.sizes.baseRadius * 1.5}px;
`;

export const WhiteOutlinedButton = styled(Button)`
  color: white;
  border: 2px solid #ffffff;
  border-radius: ${DV.sizes.baseRadius * 1.5}px;
`;

export const GradientOutlinedButton = styled(Button)`
  color: ${({ disabled }) => (disabled ? "#C0AFC7" : "white")};
  background: ${DV.bgGradient.primary};
  position: relative;
  z-index: 1;
  border-radius: ${DV.sizes.baseRadius}px;

  &::before {
    content: "";
    display: block;
    z-index: -1;
    position: absolute;
    background: ${DV.colors.gray00};
    inset: 0;
    margin: 2px;
    border-radius: ${DV.sizes.baseRadius - 1}px;
  }
`;

export const ClaimBoxRequestButton = styled(Button)`
  background: ${DV.bgGradient.dark};
  color: white;
  border: 1px solid ${DV.colors.dark1};
`;

export const SecondaryButton = styled(Button)`
  background-color: ${DV.colors.dark};
  color: ${DV.colors.secondary};
  border: 2px solid ${DV.colors.dark1};
`;

export const GreenOutlinedButton = styled(Button)`
  background: ${DV.colors.dark};
  color: ${DV.colors.green};
  border: 1px solid ${DV.colors.green};
`;

export const SecondaryGreenColorButton = styled(Button)`
  background: ${DV.colors.dark};
  color: ${DV.colors.green};
  border: 2px solid ${DV.colors.dark1};
`;

export const BrightOutlinedButton = styled(Button)`
  border: 1px solid ${DV.colors.bright};
  color: ${DV.colors.bright};
  background-color: ${DV.colors.black};
  border-radius: ${DV.sizes.baseRadius}px;
`;

export const BrightConnectedButton = styled(Button)`
  border: 2px solid ${DV.colors.bright};
  color: ${DV.colors.bright};
  background-color: ${DV.colors.black};
  border-radius: ${DV.sizes.baseRadius}px;
`;

export const BrightPrimaryButton = styled(Button)`
  background: ${DV.colors.bright};
  color: ${DV.colors.gray00};
  border-radius: ${DV.sizes.baseRadius}px;
`;

export const ClaimButtonNative = styled(PrimaryOutlinedButton)`
  width: 220px;
  font-weight: 600;

  &:not(:disabled) p {
    background: ${DV.bgGradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &:disabled {
    background: transparent;

    p {
      -webkit-background-clip: none !important;
      -webkit-text-fill-color: none !important;
      color: ${DV.colors.gray90};
    }

    &::before {
      background: none !important;
    }
  }
`;

export const ClaimButton = tw(
  ClaimButtonNative
)`before:!bg-gray20 disabled:border-2 disabled:border-gray80 disabled:opacity-60`;

export const NoCurrencyButton = styled(Button)`
  background: ${DV.colors.gray90};
  color: ${DV.colors.gray70};
  width: 220px;
`;

export const ClaimedButton = styled(Button)`
  width: 220px;
  text-align: left;

  ::before {
    //background-image: linear-gradient(91.35deg, #4BF2A2 -4.66%, #A89FE7 56.06%, #E1C4F4 73.07%, #DD40CD 111.44%);
  }

  &::after {
    position: absolute;
    top: 10px;
    right: 20px;
  }
`;

export const EmptyWithRefillButton = styled(Button)`
  background: ${DV.colors.gray90};
  color: ${DV.colors.gray70};
  width: 220px;
  text-align: left;
  position: relative;

  &::after {
    position: absolute;
    top: 10px;
    right: 20px;

    svg {
      width: 20px;
      height: 20px;
    }

    path {
      fill: ${DV.colors.gray70};

      &:hover {
        fill: ${DV.colors.gray70};
      }

      &:active {
        fill: ${DV.colors.gray70};
      }
    }

    &:hover {
      path {
        fill: ${DV.colors.gray70};
      }
    }
  }

  &:hover {
    background: ${DV.colors.gray90};
    color: ${DV.colors.gray70};
  }
`;

export const ClaimPrizeButton = styled(PrimaryButton)`
  width: 220px;
  font-weight: 600;

  p {
    background: ${DV.bgGradient.dark};
    -webkit-background-clip: text;
  }
`;
export const PrizeTapCard = styled(PrimaryOutlinedButton)`
  background-image: linear-gradient(
    to left,
    #4bf2a2,
    #a89fe7,
    #e1c3f4,
    #dd40cc
  ) !important;
  display: block;
  font-weight: 500 !important;

  &::before {
    background: url("/assets/images/prize-tap/raffle-win.svg");
    background-size: cover;
  }

  p {
    padding-right: 100px;
    height: 100%;
    text-align: left;
  }
`;

export const EnrolledButton = tw(
  PrimaryOutlinedButton
)`text-left !font-semibold text-clip bg-gray60 border-2 border-[#322837]`;

// p {
//     background: ${DV.bgGradient.primary_2} !important;
//     -webkit-background-clip: text !important;
//     -webkit-text-fill-color: transparent !important;
//   }

export const ClaimAndEnrollButton = styled(PrimaryOutlinedButton)`
  width: 220px;
  font-weight: 600;

  p {
    background: ${DV.bgGradient.primary_2};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  &::before {
    background: #030317 !important;
  }

  &:disabled {
    opacity: 0.6;
    border: 2px solid ${DV.colors.gray80};

    background: transparent;

    p {
      -webkit-background-clip: none !important;
      -webkit-text-fill-color: none !important;
      color: ${DV.colors.gray90};
    }

    &::before {
      background: none !important;
    }
  }
`;

export const LandingClaimIconButton = styled(PrimaryOutlinedButton)``;
