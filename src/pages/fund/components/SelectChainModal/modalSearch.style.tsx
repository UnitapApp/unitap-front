import styled from 'styled-components';
import { DV } from 'components/basic/designVariables';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: string;
  fontSize?: string;
  mb?: number;
}

export const ModalSearch = styled.input<InputProps>`
  padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 3}px;
  width: ${({ width }) => width || 'auto'};
  color: white;
  margin-bottom: ${({ mb }) => (mb ? `${mb * DV.sizes.baseMargin}px` : '')};
  background: ${DV.colors.dark};
  border-radius: ${DV.sizes.baseRadius * 1.5}px;
  border: 1px solid ${DV.colors.gray};
  z-index: 1;
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '1em')};

  ::placeholder,
  :-ms-input-placeholder,
  ::-ms-input-placeholder {
    color: ${DV.colors.gray};
  }
`;
