import {
  FAST_INTERVAL,
  IntervalType,
  MEDIUM_INTERVAL,
  SLOW_INTERVAL,
} from "@/constants";
import { useEffect } from "react";

export const useFastRefresh = (
  callback: CallableFunction,
  dependencies: any[] = []
) => {
  useEffect(() => {
    const timeout = setInterval(() => {
      callback();
    }, FAST_INTERVAL);

    return () => {
      clearInterval(timeout);
    };
  }, [...dependencies, callback]);
};

export const useMediumRefresh = (
  callback: CallableFunction,
  dependencies: any[] = []
) => {
  useEffect(() => {
    const timeout = setInterval(() => {
      callback();
    }, MEDIUM_INTERVAL);

    return () => {
      clearInterval(timeout);
    };
  }, dependencies);
};

export const useSlowRefresh = (
  callback: CallableFunction,
  dependencies: any[] = []
) => {
  useEffect(() => {
    const timeout = setInterval(() => {
      callback();
    }, SLOW_INTERVAL);

    return () => {
      clearInterval(timeout);
    };
  }, dependencies);
};

export const useRefreshWithInitial = (
  callback: CallableFunction,
  interval: IntervalType,
  dependencies: any[] = []
) => {
  useEffect(() => {
    const timeout = setInterval(() => {
      callback();
    }, interval);

    callback();

    return () => {
      clearInterval(timeout);
    };
  }, dependencies);
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
          message || "Your changes won't be saved. Are you leaving?"
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
