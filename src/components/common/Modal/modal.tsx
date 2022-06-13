import * as React from 'react';
import { ModalChildrenWrapper, ModalContent, ModalWrapper } from 'components/common/Modal/modal.style';
import { Text } from 'components/basic/Text/text.style';
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
          <ModalContent className={'xyz'} size={size} onClick={(e) => e.stopPropagation()} data-testid="modal-content">
            <Text className="modal-title"> {title} </Text>
            <span onClick={closeModalHandler} className="close" data-testid="close-modal">
              <Icon iconSrc='assets/images/modal/exit.svg'/>
            </span>
            {spaceman === Spaceman.WITH_PHONE && (
              <img className="spaceman-three" src={process.env.PUBLIC_URL + 'assets/images/modal/scan_spaceman.svg'} alt="" />
            )}
            {spaceman === Spaceman.BOTTOM_BIG && (
              <img className="spaceman-one" src={process.env.PUBLIC_URL + 'assets/images/modal/claim_spaceman.svg'} alt="" />
            )}
            <ModalChildrenWrapper size={size}>{children}</ModalChildrenWrapper>
          </ModalContent>
        </ModalWrapper>
      )}
    </>
  );
};

export default Modal;
