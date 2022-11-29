import styled from 'styled-components';
import { DV } from 'components/basic/designVariables';

export const ProvideGasCardWrapper = styled.div`
  width: 100%;
  
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
