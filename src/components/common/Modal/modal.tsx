import * as React from 'react';
import { useCallback, useRef } from 'react';
import { ModalChildrenWrapper, ModalContent, ModalWrapper } from 'components/common/Modal/modal.style';
import { Text } from 'components/basic/Text/text.style';
import { Spaceman } from 'constants/spaceman';

type props = {
  title: string;
  className?: string;
  isOpen: boolean;
  spaceman?: Spaceman;
  children: React.ReactNode;
  closeModalHandler: () => void;
};

const Modal = ({ spaceman, title, children, isOpen, closeModalHandler, className }: props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const handleClick = useCallback(
    (e) => {
      if (!wrapperRef.current || !contentRef.current) return;
      const offsetLeft = contentRef.current.offsetLeft;
      const offsetTop = contentRef.current.offsetTop;
      const offsetRight = wrapperRef.current.offsetWidth - offsetLeft;
      const offsetBottom = wrapperRef.current.offsetHeight - offsetTop;
      if (e.clientX < offsetLeft || e.clientX > offsetRight || e.clientY < offsetTop || e.clientY > offsetBottom) {
        closeModalHandler();
      }
    },
    [closeModalHandler],
  );
  return (
    <>
      {isOpen ? (
        <ModalWrapper ref={wrapperRef} className={className} onClick={handleClick} data-testid="modal-wrapper">
          <ModalContent ref={contentRef} className={'xyz'} data-testid="modal-content">
            <Text className="modal-title"> {title} </Text>
            <span onClick={closeModalHandler} className="close" data-testid="close-modal">
              &times;
            </span>
            {spaceman === Spaceman.WITH_PHONE && (
              <img className="spaceman-three" src={process.env.PUBLIC_URL + '/assets/images/spaceman3.png'} alt="" />
            )}
            {spaceman === Spaceman.BOTTOM_BIG && (
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
