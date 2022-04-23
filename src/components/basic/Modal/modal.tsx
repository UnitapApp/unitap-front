import * as React from 'react';
import { ModalWrapper, ModalContent, ModalChildrenWrapper } from 'components/basic/Modal/modal.style';
import { Spaceman } from 'constants/spaceman';

type props = {
  title: string;
  isOpen: boolean;
  spaceman: Spaceman;
  children: React.ReactNode;
  closeModalHandler: () => void;
};

const Modal = ({ spaceman, title, children, isOpen, closeModalHandler }: props) => (
  <>
    {isOpen ? (
      <ModalWrapper>
        <ModalContent>
          <p className="modal-title"> {title} </p>
          <span onClick={closeModalHandler} className="close">
            &times;
          </span>
          <ModalChildrenWrapper>{children}</ModalChildrenWrapper>
          <div className="bottom-background"></div>
          {spaceman == Spaceman.BOTTOM_BIG ? (
            <img className="spaceman-one" src={process.env.PUBLIC_URL + '/assets/images/spaceman1.png'} alt="" />
          ) : (
            <img className="spaceman-two" src={process.env.PUBLIC_URL + '/assets/images/spaceman2.png'} alt="" />
          )}
        </ModalContent>
      </ModalWrapper>
    ) : (
      <></>
    )}
  </>
);

export default Modal;
