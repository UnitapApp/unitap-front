import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import * as React from 'react';
import Icon from '../Icon/Icon';
import Label from '../Lable/label';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: string;
  iconWidth?: string;
  iconHeight?: string;
  icon?: string;
  label?: string;
  postfix?: string;
  styleType?: string;
  fontSize?: string;
  pl?: number;
}

const RawInput = styled.input<InputProps>`
  padding: ${DV.sizes.basePadding * 1.5}px;
  padding-left: ${(props) => (props.pl ? DV.sizes.basePadding * props.pl : DV.sizes.basePadding * 1.5)}px;
  width: ${(props) => props.width || 'auto'};
  width: 100%;
  color: white;
  background: ${(props) => (props.type === 'success' ? DV.colors.darkgreen : DV.colors.dark)};
  border-radius: ${DV.sizes.baseRadius}px;
  border: 1px solid ${(props) => (props.type === 'success' ? DV.colors.green : 'unset')};
  z-index: 1;
  box-sizing: border-box;
  font-size: ${(props) => (props.fontSize ? props.fontSize : '1em')};

  ::placeholder {
    color: ${(props) => (props.styleType === 'success' ? 'white' : '#979797')};
    opacity: 1;
  }

  :-ms-input-placeholder {
    color: ${(props) => (props.styleType === 'success' ? 'white' : '#979797')};
  }

  ::-ms-input-placeholder {
    color: ${(props) => (props.styleType === 'success' ? 'white' : '#979797')};
  }
`;

const InputWrapper = styled.div<InputProps>`
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

const Input = (props: InputProps) => {
  const { icon, width, iconWidth, iconHeight, postfix, label } = props;
  return (
    <>
      <InputWrapper width={width}>
        {label ? <Label>{label}</Label> : null}
        {icon ? (
          <>
            <Icon iconSrc={icon} width={iconWidth} height={iconHeight} className="input-icon" />
          </>
        ) : (
          <></>
        )}
        <RawInput {...props} />
        {postfix ? <p className="input-postfix">{postfix}</p> : null}
      </InputWrapper>
    </>
  );
};

export default Input;
