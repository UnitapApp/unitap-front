import * as React from 'react';
import { ModalChildrenWrapper, ModalContent, ModalWrapper } from 'components/common/Modal/modal.style';
import { Spaceman } from 'constants/spaceman';
import Icon from 'components/basic/Icon/Icon';

type props = {
  title: string;
  className?: string;
  isOpen: boolean;
  spaceman?: Spaceman;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  closeModalHandler: () => void;
};

const Modal = ({ spaceman, title, children, isOpen, closeModalHandler, className, size }: props) => {
  return (
    <>
      {isOpen && (
        <ModalWrapper className={className} onClick={(_e) => closeModalHandler()} data-testid="modal-wrapper">
          <ModalContent
            className={`bg-gray40 rounded-2xl border-2 border-gray80`}
            onClick={(e) => e.stopPropagation()}
            data-testid="modal-content"
            size={size}
          >
            <p className="modal-title font-bold text-sm text-center mx-auto text-white"> {title} </p>
            <span
              onClick={closeModalHandler}
              className="close absolute right-4 top-4 cursor-pointer"
              data-testid="close-modal"
            >
              <Icon iconSrc="assets/images/modal/exit.svg" />
            </span>
            <ModalChildrenWrapper size={size}>{children}</ModalChildrenWrapper>
          </ModalContent>
        </ModalWrapper>
      )}
    </>
  );
};

export default Modal;
