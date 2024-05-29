"use client";

import styled from "styled-components/";
import { DV } from "./designVariables";
import * as React from "react";
import Icon from "./Icon";
import Label from "./label";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  $width?: string;
  $iconWidth?: string;
  $iconHeight?: string;
  $icon?: string;
  $label?: string;
  $postfix?: string;
  $styleType?: string;
  $fontSize?: string;
  $pl?: number;
  $p?: number;
  testid?: string;
  $mb?: number;
  $backgroundColor?: string;
}

const RawInput = styled.input<InputProps>`
  padding: ${({ $p: p }) =>
    p ? DV.sizes.basePadding * p : DV.sizes.basePadding * 1.5}px;
  padding-left: ${({ $pl: pl }) =>
    pl ? DV.sizes.basePadding * pl : DV.sizes.basePadding * 1.5}px;
  width: ${({ $width: width }) => width || "auto"};
  width: 100%;
  color: white;
  background: ${({ $styleType: styleType }) =>
    styleType === "success" ? DV.colors.darkgreen : DV.colors.dark};
  background: ${({ $backgroundColor: backgroundColor }): string => {
    const xyz: string | undefined = Object.keys(DV.colors).find(
      (x) => x === backgroundColor,
    );
    if (xyz) {
      return `${DV.colors[xyz]}!important`;
    } else return ``;
  }};
  border-radius: ${DV.sizes.baseRadius}px;
  border: 1px solid
    ${({ $styleType: styleType }) =>
      styleType === "success" ? DV.colors.green : "unset"};
  z-index: 1;
  font-size: ${({ $fontSize: fontSize }) => (fontSize ? fontSize : "1em")};

  ::placeholder,
  :-ms-input-placeholder,
  ::-ms-input-placeholder {
    color: ${({ $styleType: styleType }) =>
      styleType === "success" ? DV.colors.placeholderGreen : DV.colors.gray};
    font-weight: 400;
    font-size: 14px;
  }
`;

const InputWrapper = styled.div<InputProps>`
  /* padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 4}px; */
  width: ${({ $width: width }) => width || "auto"};
  display: flex;
  flex-direction: column;
  color: white;
  border-radius: ${DV.sizes.baseRadius}px;
  margin-bottom: ${({ $mb: mb }) =>
    mb !== undefined ? `${mb * DV.sizes.baseMargin}px` : "1rem"};
  position: relative;
  height: auto;
  color: ${DV.colors.gray80};

  .input-icon {
    position: absolute;
    left: ${DV.sizes.basePadding * 2}px;
    bottom: 50%;
    transform: translateY(50%);
    z-index: 10;
  }

  .input-postfix {
    position: absolute;
    right: ${DV.sizes.basePadding * 4}px;
    bottom: 20%;

    font-size: 12px;
    color: ${DV.colors.space_green};

    z-index: 1;
  }
`;

const Input = (props: InputProps, ref: any) => {
  const {
    $icon: icon,
    $width: width,
    $iconWidth: iconWidth,
    $iconHeight: iconHeight,
    $postfix: postfix,
    $label: label,
    testid,
    $mb: mb,
  } = props;
  return (
    <InputWrapper $width={width} $mb={mb}>
      {label && <Label>{label}</Label>}
      {icon && (
        <Icon
          iconSrc={icon}
          width={iconWidth}
          height={iconHeight}
          className="input-icon"
        />
      )}
      <RawInput ref={ref} data-testid={testid} {...props} />
      {postfix && <p className="input-postfix">{postfix}</p>}
    </InputWrapper>
  );
};

export default React.forwardRef(Input);
