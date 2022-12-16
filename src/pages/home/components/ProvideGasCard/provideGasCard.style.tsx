import styled from 'styled-components';
import { DV } from 'components/basic/designVariables';

export const ProvideGasCardWrapper = styled.div`
  width: 100%;
  min-height: 100px;
  background: ${DV.bgGradient.dark};
  margin: ${DV.sizes.baseMargin * 2}px auto ${DV.sizes.baseMargin * 6}px auto;
  padding: ${DV.sizes.basePadding * 3}px ${DV.sizes.basePadding * 7}px ${DV.sizes.basePadding * 3}px
  ${DV.sizes.basePadding * 10}px;
  display: flex;
  justify-content: space-between;
  z-index: 1;
  border-radius: ${DV.sizes.baseRadius * 1.5}px;
  position: relative;
  border: none;
  &::before {
    content: '';
    display: block;
    z-index: -1;
    position: absolute;
    background: url('assets/images/claim/provide-fund-hand.svg') #080808;
    background-repeat: no-repeat;
    inset: 0;
    margin: 0.1rem;
    border-radius: ${DV.sizes.baseRadius * 1.5 - 1}px;
  }
  
  @media only screen and (max-width: ${DV.breakpoints.desktop}) {
    column-gap: 3rem;
  } 
  @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
    padding-left: ${DV.sizes.basePadding * 7}px;
  } 
  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    padding: ${DV.sizes.basePadding * 3}px ${DV.sizes.basePadding * 4}px;
    flex-direction: column;
    align-items: center;
  } 
  @media only screen and (max-width: ${DV.breakpoints.mobile}) {
    
  } 
`;