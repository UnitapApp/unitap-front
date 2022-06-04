import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import * as React from 'react';
import Icon from '../Icon/Icon';
import Label from '../Lable/label';

interface props {
  width?: string;
  iconWidth?: string;
  iconHeight?: string;
  icon?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  testid?: string;
  label?: string;
  postfix?: string;
  type?: string;
  fontSize?: string;
  pl?: number;
}

const RawInput = styled.input<props>`
  padding: ${DV.sizes.basePadding * 1.5}px;
  padding-left: ${(props) => (props.pl ? DV.sizes.basePadding * props.pl : DV.sizes.basePadding * 1.5)}px;
  width: ${(props) => props.width || 'auto'};
  width: 100%;
  color: white;
  background: ${(props) => (props.type == 'success' ? DV.colors.darkgreen : DV.colors.dark)};
  border-radius: ${DV.sizes.baseRadius}px;
  border: 1px solid ${(props) => (props.type == 'success' ? DV.colors.green : 'unset')};
  z-index: 1;
  box-sizing: border-box;
  font-size: ${(props) => props.fontSize ? props.fontSize : '1em'};

  ::placeholder {
    color: ${(props) => (props.type == 'success' ? 'white' : '#979797')};
    opacity: 1;
  }

  :-ms-input-placeholder {
    color: ${(props) => (props.type == 'success' ? 'white' : '#979797')};
  }

  ::-ms-input-placeholder {
    color: ${(props) => (props.type == 'success' ? 'white' : '#979797')};
  }
`;

const InputWrapper = styled.div<props>`
  /* padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 4}px; */
  width: ${(props) => props.width || 'auto'};
  display: flex;
  flex-direction: column;
  color: white;
  border-radius: ${DV.sizes.baseRadius}px;
  margin-bottom: 1rem;
  position: relative;

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
    bottom: ${DV.sizes.basePadding}px;
    
    font-size: 12px;
    color: ${DV.colors.space_green};

    z-index: 1;
  }
`;

const Input = ({
  icon,
  placeholder,
  disabled,
  width,
  iconWidth,
  iconHeight,
  value,
  onChange,
  testid,
  type,
  postfix,
  label,
  fontSize,
  pl,
}: props) => (
  <>
    <InputWrapper width={width}>
      {label ? <Label>{label}</Label> : null}
      {icon ? (
        <>
          <Icon iconSrc={icon} width={iconWidth} height={iconHeight} className='input-icon' />
        </>
      ) : (
        <></>
      )}
      <RawInput
        data-testid={testid}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        type={type}
        fontSize={fontSize}
        pl={pl}
      ></RawInput>
      {postfix ? <p className="input-postfix">{postfix}</p> : null}
    </InputWrapper>
  </>
);

export default Input;
