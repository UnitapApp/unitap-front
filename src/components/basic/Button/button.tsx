import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';

interface props {
  width?: string;
  iconWidth?: number;
  iconHeight?: number;
  iconMarginLeft?: number;
  height?: string;
  mr?: number;
  mb?: number;
  color?: string;
  disabled?: boolean;
  icon?: string;
  fontSize?: string;
}

// export const Xp = styled.p`
//     color: ${(props) => DV.colors[props.color]};
// `

export const Text = styled.p<props>`
  color: ${(props): string => {
    const xyz: string | undefined = Object.keys(DV.colors).find((x) => x === props.color);
    if (xyz) {
      return `${DV.colors[xyz]}!important`;
    } else return `${DV.colors.black}!important`;
  }};
`;

export const Button = styled.button<props>`
  border-radius: ${DV.sizes.baseRadius * 1.5}px;
  position: relative;
  border: none;
  font-weight: bold;
  margin-right: ${(props) => (props.mr ? `${props.mr * DV.sizes.baseMargin}px` : `0`)};
  margin-bottom: ${(props) => (props.mb ? `${props.mb * DV.sizes.baseMargin}px` : `0`)};
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || 'auto'};
  font-size: ${(props) => props.fontSize || 'auto'};
  padding: ${DV.sizes.basePadding * 1.5}px ${DV.sizes.basePadding * 3}px;

  &::after {
    display: ${(props) => (props.icon ? 'inline-block' : 'none')};
    content: ' ';
    background-image: ${(props) => `url(${props.icon})` || 'none'};
    position: relative;
    top: 2px;
    background-size: ${(props) => `${props.iconWidth}px ${props.iconHeight}px` || '0 0'};
    width: ${(props) => `${props.iconWidth}px` || 'auto'};
    height: ${(props) => `${props.iconHeight}px` || 'auto'};
    margin-left: ${(props) => `${props.iconMarginLeft}px` || '12px'};
  }

  &:hover {
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

    /* &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: ${DV.sizes.baseRadius * 1.5}px;
      background-color: ${(props) => !props.disabled && 'rgba(255,255,255,0.05)'};
    } */
  }
`;

export const PrimaryButton = styled(Button)`
  background: ${DV.bgGradient.primary};
  color: white;
`;

export const PrimaryOutlinedButton = styled(Button)`
  /* border: 1px solid ${DV.colors.primary}; */
  color: white;
  background: ${DV.bgGradient.primary};
  position: relative;
  z-index: 1;
  box-sizing: border-box;

  &::before {
    content: '';
    display: block;
    z-index: -1;
    position: absolute;
    background: ${DV.bgGradient.dark};
    inset: 0;
    margin: 0.1rem;
    border-radius: ${DV.sizes.baseRadius * 1.5 - 1}px;
  }
`;

export const LightOutlinedButton = styled(Button)`
  background: ${DV.bgGradient.dark};
  color: white;
  border: 1px solid white;
`;

export const SecondaryButton = styled(Button)`
  background-color: ${DV.colors.dark};
  color: ${DV.colors.secondary};
  border: 2px solid ${DV.colors.dark1};
`;

export const GreenOutlinedButton = styled(Button)`
  background: ${DV.colors.dark};
  color: ${DV.colors.green};
  border: 1px solid ${DV.colors.green};
`;

export const BrightOutlinedButton = styled(Button)`
  border: 1px solid ${DV.colors.bright};
  color: ${DV.colors.bright};
  background-color: ${DV.colors.black};
`;

export const BrightConnectedButton = styled(Button)`
  border: 1px solid ${DV.colors.green};
  color: ${DV.colors.bright};
  background-color: ${DV.colors.black};
`;

export const ClaimButton = styled(PrimaryOutlinedButton)`
  width: 220px;
  padding: 14px;
`;

export const ClaimedButton = styled(SecondaryButton)`
  width: 180px;
  color: ${DV.colors.green};
  background-color: ${DV.colors.darkgreen};
  text-align: left;
  &::after {
    position: absolute;
    top: -8px;
    right: 4px;
  }
`;

export const LandingClaimIconButton = styled(PrimaryOutlinedButton)``;
