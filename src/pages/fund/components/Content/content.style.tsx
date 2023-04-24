import styled from 'styled-components';
import { DV } from 'components/basic/designVariables';

export const ContentCard = styled.div`
  width: min(90%, 430px);
  height: fit-content;
  margin: ${DV.sizes.baseMargin * 4}px auto ${DV.sizes.baseMargin * 8}px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  align-items: flex-start;
  position: relative;
  overflow: hidden;

  .content-subtext {
    font-size: 12px;
    margin: 0 ${DV.sizes.baseMargin}px;
    color: #4c4c64;
    line-height: 1.1rem;
    word-spacing: -3px;
  }
`;
