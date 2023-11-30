"use client"

import styled from "styled-components"
import { DV } from "../designVariables"

type props = {
  width?: string
  smWidth?: string
  xsWidth?: string
  height?: string
  mr?: number
  mrAuto?: boolean
  mb?: number
  smMb?: number
  mt?: number
  ml?: number
  hoverable?: boolean
}

export const IconWrapper = styled.span<props>`
  display: flex;
  justify-content: center;

  margin-right: ${({ mr, mrAuto }) =>
    mr ? `${mr * DV.sizes.baseMargin}px` : mrAuto ? "auto" : ""};
  margin-bottom: ${({ mb }) => (mb ? `${mb * DV.sizes.baseMargin}px` : "")};
  margin-left: ${({ ml }) => (ml ? `${ml * DV.sizes.baseMargin}px` : "")};
  margin-top: ${({ mt }) => (mt ? `${mt * DV.sizes.baseMargin}px` : "")};

  & > img {
    width: ${({ width }) => width};
    height: ${({ height, width }) => height || width};
    padding: 0;
  }

  @media only screen and (max-width: ${DV.breakpoints.desktop}) {
    & > img {
      width: ${({ smWidth }) => smWidth};
      margin-bottom: ${({ smMb, mb }) =>
        smMb
          ? `${smMb * DV.sizes.baseMargin}px`
          : mb
          ? `${mb * DV.sizes.baseMargin}px`
          : ""};
    }
  }

  @media only screen and (max-width: ${DV.breakpoints.mobile}) {
    & > img {
      width: ${({ xsWidth }) => xsWidth};
    }
  }
`
