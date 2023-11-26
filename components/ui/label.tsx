"use client"

import { ReactNode } from "react"
import styled from "styled-components"
import { DV } from "./designVariables"

interface props {
  children: ReactNode
}

const LabelWrapper = styled.p`
  font-size: 12px;
  color: #4c4c64;
  margin: ${DV.sizes.baseMargin * 3}px ${DV.sizes.baseMargin}px
    ${DV.sizes.baseMargin}px;
`

const Label = ({ children }: props) => {
  return <LabelWrapper>{children}</LabelWrapper>
}

export default Label
