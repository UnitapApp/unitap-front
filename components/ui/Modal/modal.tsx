"use client";

import * as React from "react";
import { Spaceman } from "@/constants/spaceman";
import Icon from "@/components/ui/Icon";
import { APIErrorsSource } from "@/types";
import { ErrorsContext } from "@/context/errorsProvider";
import { ModalContent } from "./modal.style";
import Image from "next/image";

import HeaderImage from "./header-image.svg";

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
                : "bg-gray60"
            } rounded-2xl border-3 border-t-0 border-gray60 ${
              errorSource && getError(errorSource) ? "!border-error " : ""
            }`}
            onClick={(e) => e.stopPropagation()}
            data-testid="modal-content"
            size={size}
          >
            <div className="relative flex items-center p-4">
              <Image
                src={HeaderImage}
                alt="polygon"
                className="absolute left-1/2 top-0 -translate-x-1/2"
              />

              {titleLeft && (
                <p className="relative z-10 text-left text-xl text-gray100">
                  {" "}
                  {titleLeft}{" "}
                </p>
              )}
              {title && (
                <p className="modal-title relative z-10 ml-auto mt-1 text-center text-sm font-semibold text-gray100">
                  {" "}
                  {title}{" "}
                </p>
              )}
              <span
                onClick={closeModalHandler}
                className="close ml-auto cursor-pointer"
                data-testid="close-modal"
              >
                <Image
                  width="12"
                  height="13"
                  alt="exit"
                  src="/assets/images/modal/exit.svg"
                />
              </span>
            </div>
            <div
              className={`rounded-lg ${
                className === "provider-dashboard__modal"
                  ? "bg-gray20"
                  : "bg-gray30"
              } styled-scroll max-h-[70vh] p-3`}
            >
              {children}
            </div>
          </ModalContent>
        </div>
      )}
    </>
  );
};

export default Modal;
