import styled from 'styled-components/';

export const HeaderWrapper = styled.div`
  display: flex;
  background-image: url('/headerBg.png');
  height: 170px;
  background-size: cover;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  .text {
    position: absolute;
    bottom: 20px;
  }

  .spaceman {
    position: absolute;
    bottom: 0;
    transform: translateY(50%);
  }
`;
