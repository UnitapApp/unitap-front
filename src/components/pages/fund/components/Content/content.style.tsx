import styled from 'styled-components';
import { DV } from 'components/basic/designVariables';

export const ContentWrapper = styled.div`
  background: ${DV.colors.black1};
  border: 1px solid ${DV.colors.border_black};
  border-radius: ${DV.sizes.baseRadius * 1.5}px;
`;
