import { persistStore, persistReducer } from "redux-persist";
import { createSlice, configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { projectsSlice } from "./projects/slice";
import { useDispatch, useSelector, useStore } from "react-redux";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const persistConfig = {
  key: "root",
  storage: typeof window === "undefined" ? createNoopStorage() : storage,
};

const rootReducer = combineReducers({
  [projectsSlice.reducerPath]: projectsSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function makeStore() {
  const store = configureStore({
    reducer: persistedReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({ serializableCheck: false });
    },
  });

  const persistor = persistStore(store);
  return { store, persistor };
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["store"]["getState"]>;
export type AppDispatch = AppStore["store"]["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore["store"]>();
