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

export const WalletAddressWrapper = styled(Text)`
  background: #312335;
  border: 1px solid #9347AB;
  
  border-radius: ${DV.sizes.baseRadius * 1.5}px;
  text-align: center;
  color: white;
  box-sizing: border-box;
  width: 100%;
  padding: ${DV.sizes.basePadding * 1.4}px ${DV.sizes.basePadding * 3}px;

  font-weight: 700;
  font-size: 14px;

  position: relative;

  .edit-icon {
    position: absolute;
    top: -2px;
    right: 0;

    &:hover {
      cursor: pointer;
    }
  }
`;
