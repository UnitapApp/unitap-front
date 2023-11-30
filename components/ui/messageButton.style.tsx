"use client"

import styled from "styled-components/"
import { DV } from "./designVariables"

interface props {
  width?: string
  iconWidth?: number
  $iconHeight?: number
  height?: string
  mr?: number
  mb?: number
  color?: string
  disabled?: boolean
  icon?: string
}

export const MessageButton = styled.div<props>`
  background: ${DV.bgGradient.dark};
  border: 1px solid #4c4c64;

  border-radius: ${DV.sizes.baseRadius * 1.5}px;
  font-size: 20px;
  text-align: center;
  color: white;
  box-sizing: border-box;
  margin-right: ${(props) =>
    props.mr ? `${props.mr * DV.sizes.baseMargin}px` : `0`};
  margin-bottom: ${(props) =>
    props.mb ? `${props.mb * DV.sizes.baseMargin}px` : `0`};
  width: ${(props) => props.width || "auto"};
  padding: ${DV.sizes.basePadding * 1.5}px ${DV.sizes.basePadding * 3}px;
`

export const DangerMessageButton = styled(MessageButton)`
  border-color: ${DV.colors.warningRed};
  color: ${DV.colors.warningRed};
`

export const SuccessMessageButton = styled(MessageButton)`
  border-color: ${DV.colors.green};
  color: ${DV.colors.green};
`
