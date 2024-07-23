"use client";

import styled from "styled-components/";
import { DV } from "@/components/ui/designVariables";

interface props {
  size?: "small" | "medium" | "large" | number;
}

export const ModalWrapper = styled.div<props>`
  position: fixed;
  z-index: 30;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContent = styled.div<props>`
  ${({ size }) =>
    size === "small"
      ? `width: min(420px, 90%);`
      : size === "large"
        ? `width: min(800px, 80%);`
        : typeof size === "number"
          ? `width: min(${size}px, 80%);`
          : `width: min(500px, 80%);`}
  margin: 0 5%;
  position: relative;
  padding: ${DV.sizes.basePadding * 2}px;
  overflow: hidden;
  z-index: -2;
`;

export const ModalChildrenWrapper = styled.div<props>`
  border-radius: ${DV.sizes.baseRadius * 2}px;
  z-index: 10;
`;
