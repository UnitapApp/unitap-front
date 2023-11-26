"use client"

import styled from "styled-components"
import { DV } from "../designVariables"

export const DropdownWrapper = styled.div`
  width: 100%;

  .dropdown {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding: ${DV.sizes.basePadding * 1.5}px;
    padding-right: ${DV.sizes.basePadding * 3}px;

    box-sizing: border-box;
    background: ${DV.colors.black2};
    border: 1px solid ${DV.colors.dark};
    border-radius: ${DV.sizes.baseRadius * 1.5}px;

    &:hover {
      cursor: pointer;
    }
  }

  .dropdown-value {
    margin: 0 auto 0 ${DV.sizes.baseMargin * 2}px;
    color: white;
  }
`
