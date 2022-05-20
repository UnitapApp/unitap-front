import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import * as React from 'react';
import Icon from '../Icon/Icon';

interface props {
  width?: string,
  iconWidth?: string,
  iconHeight?: string,
  icon?: string,
  placeholder?: string,
  disabled?: boolean,
}

const RawInput = styled.input<props>`
  padding: ${DV.sizes.basePadding * 2}px;
  width: ${(props) => props.width || 'auto'};
  width: 100%;
  color: white;
  background: ${DV.colors.dark};
  border-radius: ${DV.sizes.baseRadius}px;
  /* position: relative; */
  /* box-sizing: border-box; */
  z-index: 1;

`;

const InputWrapper = styled.div<props>`
  /* padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 4}px; */
  width: ${(props) => props.width || 'auto'};
  display: flex;
  color: white;
  background: ${DV.colors.dark};
  border-radius: ${DV.sizes.baseRadius}px;
  margin-bottom: 1rem;

`;


const Input = ({ icon, placeholder, disabled, width, iconWidth, iconHeight }: props) => (
  <>
    <InputWrapper width={width}>
      {icon ? (<>
      <Icon iconSrc={icon} width={iconWidth} height={iconWidth} />
      </>)  : (
      <></>
    )}
    <RawInput placeholder={placeholder} disabled={disabled} ></RawInput>
    </InputWrapper>
  </>
);

export default Input;
