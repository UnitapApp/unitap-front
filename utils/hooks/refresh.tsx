import {
  FAST_INTERVAL,
  IntervalType,
  MEDIUM_INTERVAL,
  SLOW_INTERVAL,
} from "@/constants";
import { useEffect, useRef } from "react";

export const useFastRefresh = (
  callback: () => void,
  dependencies: any[] = [],
  fastInterval: number = FAST_INTERVAL,
) => {
  const callbackRef = useRef<() => void>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (callbackRef.current) {
        callbackRef.current();
      }
    }, fastInterval);

    return () => clearInterval(intervalId);
  }, [fastInterval, ...dependencies]);
};

export const useMediumRefresh = (
  callback: () => void,
  dependencies: any[] = [],
  mediumInterval: number = MEDIUM_INTERVAL,
) => {
  const callbackRef = useRef<() => void>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (callbackRef.current) {
        callbackRef.current();
      }
    }, mediumInterval);

    return () => clearInterval(intervalId);
  }, [mediumInterval, ...dependencies]);
};

export const useSlowRefresh = (
  callback: () => void,
  dependencies: any[] = [],
  slowInterval: number = SLOW_INTERVAL,
) => {
  const callbackRef = useRef<() => void>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (callbackRef.current) {
        callbackRef.current();
      }
    }, slowInterval);

    return () => clearInterval(intervalId);
  }, [slowInterval, ...dependencies]);
};

export const useRefreshWithInitial = (
  callback: () => void,
  interval: IntervalType,
  dependencies: any[] = [],
) => {
  const callbackRef = useRef<() => void>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (interval && callbackRef.current) {
      const intervalId = setInterval(callbackRef.current, interval);
      setTimeout(callbackRef.current, 0);

      return () => clearInterval(intervalId);
    }
  }, [interval, ...dependencies]);
};

export const usePreventNavigation = (isActive: boolean, message?: string) => {
  useEffect(() => {
    let isSatisfied = false;

    const onDocClicked = (event: MouseEvent) => {
      if ((event.target as any)?.tagName.toLowerCase() === "a") {
        if (!isActive || isSatisfied) return;

        event.preventDefault();
        event.stopPropagation();

        const prompt = window.confirm(
          message || "Your changes won't be saved. Are you leaving?",
        );

        if (!prompt) return;
        isSatisfied = true;

        (event.target as HTMLButtonElement).click();
      }
    };

    window.onbeforeunload = () => {
      if (!isActive) return;

      return true;
    };

    document.addEventListener("click", onDocClicked, {
      capture: true,
    });

    return () => {
      document.removeEventListener("click", onDocClicked, { capture: true });
      window.onbeforeunload = null;
    };
  }, [isActive, message]);
};
