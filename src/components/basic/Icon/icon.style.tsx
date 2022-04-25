import styled from 'styled-components/';

type props = {
  width: string;
  height?: string;
};

export const IconWrapper = styled.div<props>`
  display: flex;
  justify-content: center;

  & > img {
    width: ${(props) => props.width};
    height: ${(props) => props.height || props.width};
    padding: 0;
    margin: 1rem;
  }
`;
