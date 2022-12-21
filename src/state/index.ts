import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { load, save } from "redux-localstorage-simple";
import { isTestEnv } from "utils/env";

import transactions from './transactions/reducer';
import application from "./application/reducer";
import { updateVersion } from "./global/actions";
import user from "./user/reducer";

const PERSISTED_KEYS: string[] = ["user", "transactions"];

const store = configureStore({
  reducer: {
    transactions,
    application,
    user
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true }).concat(save({ states: PERSISTED_KEYS, debounce: 1000 })),
  preloadedState: load({
    states: PERSISTED_KEYS,
    disableWarnings: isTestEnv() || process.env.REACT_APP_IS_CYPRESS === "true"
  })
});

store.dispatch(updateVersion());

setupListeners(store.dispatch);

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
