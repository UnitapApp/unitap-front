"use client"

import styled from "styled-components"
import { DV } from "./designVariables"

interface colProps {
  xlg?: number
  lg?: number
  md?: number
  xs?: number
}

export const Col = styled.div<colProps>`
  width: ${({ xlg }) => (xlg ? `${(xlg * 100) / 12}%` : "100%")};

  @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
    width: ${({ lg }) => (lg ? `${(lg * 100) / 12}%` : "100%")};
  }
  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    width: ${({ md }) => (md ? `${(md * 100) / 12}%` : "100%")};
  }
  @media only screen and (max-width: ${DV.breakpoints.mobile}) {
    width: ${({ xs }) => (xs ? `${(xs * 100) / 12}%` : "100%")};
  }
`
