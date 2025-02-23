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
  size?: "small" | "medium" | "large" | number;
  closeModalHandler: () => void;
  errorSource?: APIErrorsSource;
  bodyClassName?: string;
  classNames?: {
    content?: string;
  };
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
  bodyClassName,
  classNames,
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
            className={`${
              className === "provider-dashboard__modal"
                ? "bg-stone-300"
                : "bg-stone-200"
            } rounded-2xl border-2 border-stone-400 ${
              errorSource && getError(errorSource) ? "!border-error" : ""
            } ${classNames?.content ?? ""}`}
            onClick={(e) => e.stopPropagation()}
            data-testid="modal-content"
            size={size}
          >
            <div className="flex items-center">
              {titleLeft && (
                <p className="relative z-10 text-left text-xl text-black-0">
                  {" "}
                  {titleLeft}{" "}
                </p>
              )}
              {title && (
                <p className="modal-title relative z-10 ml-auto text-center text-sm font-bold text-black-0">
                  {" "}
                  {title}{" "}
                </p>
              )}
              <span
                onClick={closeModalHandler}
                className="close ml-auto cursor-pointer"
                data-testid="close-modal"
              >
                <Icon iconSrc="/quest/assets/images/modal/exit.svg" />
              </span>
            </div>
            <ModalChildrenWrapper
              className={`${
                className === "provider-dashboard__modal"
                  ? "bg-stone-300"
                  : "bg-stone-200"
              } styled-scroll max-h-[70vh] overflow-auto !rounded-none ${bodyClassName}`}
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
