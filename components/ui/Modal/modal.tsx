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
        <div
          className={`bg-darkblack/20 fixed left-0 top-0 z-40 flex h-full w-full items-center justify-center overflow-auto backdrop-blur-sm ${className}`}
          onClick={(_e) => closeModalHandler()}
          data-testid="modal-wrapper"
        >
          <ModalContent
            className={`${
              className === "provider-dashboard__modal"
                ? "bg-gray20"
                : "bg-gray30"
            } rounded-2xl border-2 border-gray80 ${
              errorSource && getError(errorSource) ? "!border-error " : ""
            }`}
            onClick={(e) => e.stopPropagation()}
            data-testid="modal-content"
            size={size}
          >
            <div className="bg-bg6 flex items-center p-4">
              {titleLeft && (
                <p className="relative z-10 text-left text-xl text-white">
                  {" "}
                  {titleLeft}{" "}
                </p>
              )}
              {title && (
                <p className="modal-title relative z-10 ml-auto text-center text-sm font-semibold text-white">
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
              className={`${
                className === "provider-dashboard__modal"
                  ? "bg-gray20"
                  : "bg-gray30"
              } styled-scroll max-h-[70vh] !rounded-none p-3`}
              size={size}
            >
              {children}
            </ModalChildrenWrapper>
          </ModalContent>
        </div>
      )}
    </>
  );
};

export default Modal;
