import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { Text } from 'components/basic/Text/text.style';

export const ClaimModalWrapper = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: ${DV.sizes.basePadding * 2}px;
`;

export const WalletAddress = styled(Text)`
  align-self: flex-start;
`;
