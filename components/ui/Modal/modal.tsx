"use client";

import * as React from "react";
import { Spaceman } from "@/constants/spaceman";
import Icon from "@/components/ui/Icon";
import { APIErrorsSource } from "@/types";
import { ErrorsContext } from "@/context/errorsProvider";
import {
  ModalWrapper,
  ModalContent,
  ModalChildrenWrapper,
} from "./modal.style";

type props = {
  title?: string;
  titleLeft?: string;
  className?: string;
  isOpen: boolean;
  spaceman?: Spaceman;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  closeModalHandler: () => void;
  errorSource?: APIErrorsSource;
};

const Modal = ({
  title,
  titleLeft,
  children,
  isOpen,
  closeModalHandler,
  className,
  size,
  errorSource,
}: props) => {
  const { getError } = React.useContext(ErrorsContext);

  return (
    <>
      {isOpen && (
        <ModalWrapper
          className={className}
          onClick={(_e) => closeModalHandler()}
          data-testid="modal-wrapper"
        >
          <ModalContent
            className={`bg-gray30 rounded-2xl border-2 border-gray80 ${
              errorSource && getError(errorSource) ? "!border-error " : ""
            }`}
            onClick={(e) => e.stopPropagation()}
            data-testid="modal-content"
            size={size}
          >
            <div className="flex items-center">
              {titleLeft && (
                <p className="text-xl text-left relative z-10 text-white">
                  {" "}
                  {titleLeft}{" "}
                </p>
              )}
              {title && (
                <p className="modal-title font-bold text-sm relative z-10 text-center ml-auto text-white">
                  {" "}
                  {title}{" "}
                </p>
              )}
              <span
                onClick={closeModalHandler}
                className="close ml-auto cursor-pointer"
                data-testid="close-modal"
              >
                <Icon iconSrc="/assets/images/modal/exit.svg" />
              </span>
            </div>
            <ModalChildrenWrapper
              className="bg-gray30 max-h-[70vh] !rounded-none styled-scroll"
              size={size}
            >
              {children}
            </ModalChildrenWrapper>
          </ModalContent>
        </ModalWrapper>
      )}
    </>
  );
};

export default Modal;
