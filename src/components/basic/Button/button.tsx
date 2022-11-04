import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';

interface props {
  width?: string;
  minWidth?: string;
  iconWidth?: number;
  smIconWidth?: number;
  iconHeight?: number;
  smIconHeight?: number;
  iconMarginLeft?: number;
  smIconMarginLeft?: number;
  height?: string;
  mlAuto?: boolean;
  mr?: number;
  smMr?: number;
  mb?: number;
  smMb?: number;
  color?: string;
  disabled?: boolean;
  icon?: string;
  fontSize?: string;
  smFontSize?: string;
  fontWeight?: string;
  size?: 'small' | 'large';
}

// export const Xp = styled.p`
//     color: ${(props) => DV.colors[color]};
// `

export const Text = styled.p<props>`
  color: ${({ color }): string => {
    const xyz: string | undefined = Object.keys(DV.colors).find((x) => x === color);
    if (xyz) {
      return `${DV.colors[xyz]}!important`;
    } else return `${DV.colors.black}!important`;
  }};
`;

export const Button = styled.button<props>`
  border-radius: ${DV.sizes.baseRadius * 1.5}px;
  position: relative;
  border: none;
  font-weight: ${({ fontWeight }) => fontWeight || 'bold'};
  margin-right: ${({ mr }) => (mr ? `${mr * DV.sizes.baseMargin}px` : '')};
  margin-bottom: ${({ mb }) => (mb ? `${mb * DV.sizes.baseMargin}px` : '')};
  margin-left: ${({ mlAuto }) => (mlAuto ? 'auto' : '')};
  width: ${({ width }) => width || 'auto'};
  min-width: ${({ minWidth }) => minWidth || 'auto'};
  height: ${({ height }) => height || 'auto'};
  font-size: ${({ fontSize }) => fontSize || 'auto'};

  ${({ size }) => (size === 'large' ? `padding: 1em 2.5em;` : `padding: .75em 1.25em;`)}
  &::after {
    display: ${({ icon }) => (icon ? 'inline-block' : 'none')};
    content: ' ';
    background-image: ${({ icon }) => `url(${icon})` || 'none'};
    position: relative;
    top: 2px;
    background-size: ${({ iconWidth, iconHeight }) => `${iconWidth}px ${iconHeight}px` || '0 0'};
    width: ${({ iconWidth }) => `${iconWidth}px` || 'auto'};
    height: ${({ iconHeight }) => `${iconHeight}px` || 'auto'};
    margin-left: ${({ iconMarginLeft }) => (iconMarginLeft ? iconMarginLeft : '12')}px;
  }

  ${({ disabled }) => (disabled ? `` : `&:hover {cursor: pointer;}`)}

  @media only screen and(${DV.breakpoints.smallDesktop}) {
    font-size: ${({ smFontSize, fontSize }) => smFontSize || fontSize || 'auto'};
    margin-right: ${({ smMr, mr }) =>
      smMr ? `${smMr * DV.sizes.baseMargin}px` : mr ? `${mr * DV.sizes.baseMargin}px` : `0`};
    margin-bottom: ${({ smMb, mb }) =>
      smMb ? `${smMb * DV.sizes.baseMargin}px` : mb ? `${mb * DV.sizes.baseMargin}px` : `0`};

    &::after {
      background-size: ${({ smIconWidth, smIconHeight }) => `${smIconWidth}px ${smIconHeight}px` || '0 0'};
      width: ${({ smIconWidth, iconWidth }) => `${smIconWidth}px` || `${iconWidth}px` || 'auto'};
      height: ${({ smIconHeight, iconHeight }) => `${smIconHeight}px` || `${iconHeight}px` || 'auto'};
      margin-left: ${({ smIconMarginLeft, iconMarginLeft }) =>
        `${smIconMarginLeft}px` || `${iconMarginLeft}px` || '12px'};
    }
  }
`;

export const PrimaryButton = styled(Button)`
  background: ${({ disabled }) => (disabled ? `${DV.bgGradient.primaryDisabled}` : `${DV.bgGradient.primary}`)};
  color: ${({ disabled }) => (disabled ? `${DV.colors.gray}` : 'white')};
`;

export const PrimaryOutlinedButton = styled(Button)`
  /* border: 1px solid ${DV.colors.primary}; */
  color: ${({ disabled }) => (disabled ? '#C0AFC7' : 'white')};
  background: ${({ disabled }) => (disabled ? '#C0AFC7' : DV.bgGradient.primary)};
  position: relative;
  z-index: 1;

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

export const ClaimBoxRequestButton = styled(Button)`
  background: ${DV.bgGradient.dark};
  color: white;
  border: 1px solid ${DV.colors.dark1};
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

export const SecondaryGreenColorButton = styled(Button)`
  background: ${DV.colors.dark};
  color: ${DV.colors.green};
  border: 2px solid ${DV.colors.dark1};
`;

export const BrightOutlinedButton = styled(Button)`
  border: 1px solid ${DV.colors.bright};
  color: ${DV.colors.bright};
  background-color: ${DV.colors.black};
`;

export const BrightConnectedButton = styled(Button)`
  border: 1px solid ${DV.colors.bright};
  color: ${DV.colors.space_green};
  background-color: ${DV.colors.black};
`;

export const ClaimButton = styled(PrimaryOutlinedButton)`
  width: 220px;
  padding: 14px;

  p {
    background: ${DV.bgGradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  ::before {
    background: #030317 !important;
  }
`;

export const ClaimedButton = styled(PrimaryOutlinedButton)`
  width: 220px;
  padding-top: 11px;
  padding-bottom: 11px;
  color: ${DV.colors.green};
  text-align: left;
  padding-left: 24px;

  p {
    background: ${DV.bgGradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  ::before {
    background: #1b1b26;
  }

  &::after {
    position: absolute;
    top: 10px;
    right: 20px;

    @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
      display: none; 
    }
  }

`;

export const LandingClaimIconButton = styled(PrimaryOutlinedButton)``;
