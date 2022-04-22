import * as React from 'react';
import { ModalWrapper } from 'components/basic/Modal/modal.style';

type props = {
  title: string;
  children: React.ReactNode;
};

const Modal = ({ title, children }: props) => (
  <ModalWrapper>
    {title}
    <span className="close">&times;</span>
    {children}
  </ModalWrapper>
);

export default Modal;
