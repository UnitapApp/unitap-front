import styled from 'styled-components';
import { DV } from 'components/basic/designVariables';

export const ContentWrapper = styled.div`
  background: ${DV.colors.black1};
  border: 1px solid ${DV.colors.border_black};
  border-radius: ${DV.sizes.baseRadius * 1.5}px;
  width: min(30%, 430px);
  margin: ${DV.sizes.baseMargin * 4}px auto ${DV.sizes.baseMargin * 10}px;
  padding: ${DV.sizes.basePadding * 3}px ${DV.sizes.basePadding * 3}px ${DV.sizes.basePadding * 4}px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  align-items: flex-start;

  .content-text {
    font-size: 14px;
    margin: ${DV.sizes.baseMargin * 3}px ${DV.sizes.baseMargin}px ${DV.sizes.baseMargin}px;
    color: white;
    word-spacing: -4px;
  }

  .content-subtext {
    font-size: 12px;
    margin: 0 ${DV.sizes.baseMargin}px;
    color: #4c4c64;
    line-height: 1.1rem;
    word-spacing: -3px;
  }
`;
