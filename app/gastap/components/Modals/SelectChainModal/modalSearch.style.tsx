"use client";

import styled from "styled-components";
import { DV } from "@/components/ui/designVariables";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  $width?: string;
  fontSize?: string;
  mb?: number;
}

export const ModalSearch = styled.input<InputProps>`
  ::placeholder,
  :-ms-input-placeholder,
  ::-ms-input-placeholder {
    color: ${DV.colors.gray};
  }
`;
