import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';

export const HeaderWrapper = styled.div`
  display: flex;
  background-image: url('/headerBg.png');
  height: max(180px, 20vh);
  background-size: cover;
  justify-content: center;
  align-items: center;
  position: relative;

  p {
    position: relative;
    text-align: center;
    top: 24px;
    font-weight: bold;
    font-size: 24px;
    color: white;
    @media screen and (max-width: 600px) {
      width: 90%;
      font-size: 20px;
    }
  }
`;
