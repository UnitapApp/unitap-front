import * as React from 'react';
import { useEffect, useRef } from 'react';
import { ModalChildrenWrapper, ModalContent, ModalWrapper } from 'components/common/Modal/modal.style';
import { Text } from 'components/basic/Text/text.style';
import { Spaceman } from 'constants/spaceman';

type props = {
  title: string;
  className?: string;
  isOpen: boolean;
  spaceman: Spaceman;
  children: React.ReactNode;
  closeModalHandler: () => void;
};

const Modal = ({ spaceman, title, children, isOpen, closeModalHandler, className }: props) => {
  const elRef: any = useRef();
  console.log('elem width', elRef.current.offsetWidth);
  useEffect(() => {
    // const elem: any = document.getElementsByClassName('xyz');
    // hideOnClickOutside(elRef.current);
  });
  return (
    <>
      {isOpen ? (
        <ModalWrapper className={className}>
          <ModalContent ref={elRef} className={'xyz'}>
            <Text className="modal-title"> {title} </Text>
            <span onClick={closeModalHandler} className="close">
              &times;
            </span>
            <div className="bottom-background"></div>
            {spaceman === Spaceman.WITH_PHONE ? (
              <img className="spaceman-three" src={process.env.PUBLIC_URL + '/assets/images/spaceman3.png'} alt="" />
            ) : (
              <img className="spaceman-one" src={process.env.PUBLIC_URL + '/assets/images/spaceman1.png'} alt="" />
            )}
            <ModalChildrenWrapper>{children}</ModalChildrenWrapper>
          </ModalContent>
        </ModalWrapper>
      ) : (
        <></>
      )}
    </>
  );
};

export default Modal;
