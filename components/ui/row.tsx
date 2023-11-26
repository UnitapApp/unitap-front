"use client"

import styled from "styled-components"
import { DV } from "./designVariables"

interface rowProps {
  mdReverse?: boolean
}

export const Row = styled.div<rowProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;

  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    flex-direction: ${({ mdReverse }) =>
      mdReverse ? `column-reverse` : "row"};
  }
`
