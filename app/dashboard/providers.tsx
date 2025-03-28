"use client";

import reduxStore, { AppStore } from "@/store";
import { PropsWithChildren, useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

export default function Providers({ children }: PropsWithChildren) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = reduxStore();
  }

  return (
    <Provider store={storeRef.current.store}>
      <PersistGate persistor={storeRef.current.persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
