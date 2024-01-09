"use client"

import styled from "styled-components"

export const DropIconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  & > img {
    position: absolute;
    top: 43px;
  }

  .state-logo {
    position: absolute;
    right: -10px;
    top: 56px;
  }
`
