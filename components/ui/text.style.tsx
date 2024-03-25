"use client";

import styled from "styled-components/";
import { DV } from "./designVariables";

type props = {
  fontSize?: string;
  xsFontSize?: string;
  smFontSize?: string;
  mdFontSize?: string;
  lgFontSize?: string;
  xlgFontSize?: string;
  lineHeight?: string;
  breakOverflow?: boolean;
  color?: string;
  width?: string;
  $textAlign?: string;
  mr?: number;
  mrAuto?: boolean;
  mb?: number;
  mdMb?: number;
};

export const Text = styled.p<props>`
  color: ${({ color }): string => {
    const xyz: string | undefined = Object.keys(DV.colors).find(
      (x) => x === color,
    );
    if (xyz) {
      return `${DV.colors[xyz]}!important`;
    } else return `white !important`;
  }};
  font-size: ${({ fontSize }) => fontSize || "16"}px;
  line-height: ${({ lineHeight }) => lineHeight || ""};
  padding: 0;
  margin: 0;
  width: ${({ width }) => width || "auto"};
  margin-right: ${({ mr, mrAuto }) =>
    mr ? `${mr * DV.sizes.baseMargin}px` : mrAuto ? "auto" : ""};
  margin-bottom: ${({ mb }) =>
    mb !== undefined ? `${mb * DV.sizes.baseMargin}px` : `1rem`};
  text-align: ${({ $textAlign: textAlign }) => textAlign || "left"};

  @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
    font-size: ${({ smFontSize }) => smFontSize || "15"}px;
  }

  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    margin-bottom: ${({ mdMb }) =>
      mdMb ? `${mdMb * DV.sizes.baseMargin}px` : ""};
  }

  ${({ breakOverflow }) =>
    breakOverflow &&
    `
      overflow-wrap: normal;
      word-wrap: break-word;
      hyphens: none;
    `}
`;
