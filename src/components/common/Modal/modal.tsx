import * as React from 'react';
import { ModalChildrenWrapper, ModalContent, ModalWrapper } from 'components/common/Modal/modal.style';
import { Text } from 'components/basic/Text/text.style';
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
          <Text className="modal-title"> {title} </Text>
          <span onClick={closeModalHandler} className="close">
            &times;
          </span>
          <ModalChildrenWrapper>{children}</ModalChildrenWrapper>
          <div className="bottom-background"></div>
          {spaceman === Spaceman.WITH_PHONE ? (
            <img className="spaceman-three" src={process.env.PUBLIC_URL + '/assets/images/spaceman3.png'} alt="" />
          ) : (
            <img className="spaceman-one" src={process.env.PUBLIC_URL + '/assets/images/spaceman1.png'} alt="" />
          )}
        </ModalContent>
      </ModalWrapper>
    ) : (
      <></>
    )}
  </>
);

export default Modal;
