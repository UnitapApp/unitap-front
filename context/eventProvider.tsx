"use client";

import { NullCallback } from "@/utils";
import { FC, PropsWithChildren, createContext, useState } from "react";

type Callback = (...args: any[]) => void;

export type CallbackEvent = (name: string, callback: Callback) => void;

export type EventContextProps = {
  addEventListener: CallbackEvent;
  removeEventListener: CallbackEvent;
  clearAll: typeof NullCallback;
  dispatchEvent: (name: string, ...values: any[]) => void;
};

const EventContext = createContext<EventContextProps>({
  addEventListener: NullCallback,
  removeEventListener: NullCallback,
  dispatchEvent: NullCallback,
  clearAll: NullCallback,
});

const EventContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [registeredEvents, setRegisteredEvents] = useState<{
    [key: string]: Callback[];
  }>({});

  const addEventListener: CallbackEvent = (name, callback) => {
    const eventsList = registeredEvents[name] ?? [];

    eventsList.push(callback);

    registeredEvents[name] = eventsList;

    setRegisteredEvents({ ...registeredEvents });
  };

  const removeEventListener: CallbackEvent = (name, callback) => {
    const eventsList = registeredEvents[name] ?? [];

    const cbIndex = eventsList.findIndex((item) => item === callback);

    if (cbIndex < 0) return;

    eventsList.splice(cbIndex, 1);

    registeredEvents[name] = eventsList;

    setRegisteredEvents({ ...registeredEvents });
  };

  const dispatchEvent: (name: string, ...values: any[]) => void = (
    name,
    ...values
  ) => {
    const eventsList = registeredEvents[name] ?? [];

    eventsList.forEach((callback) => {
      callback(...values);
    });
  };

  const clearAll = () => {
    setRegisteredEvents({});

    return null;
  };

  return (
    <EventContext.Provider
      value={{
        removeEventListener,
        addEventListener,
        dispatchEvent,
        clearAll,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventContextProvider;
