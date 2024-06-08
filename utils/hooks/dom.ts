import { RefObject, useEffect } from "react";

type EventListener = (event: MouseEvent) => void;

export const useOutsideClick = (
  ref: RefObject<HTMLElement>,
  callback: EventListener,
): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};
