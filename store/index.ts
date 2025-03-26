
import { persistStore, persistReducer } from 'redux-persist'
import { createSlice, configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { projectsSlice } from './projects/slice'


const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer =   combineReducers({
  [projectsSlice.reducerPath]: projectsSlice.reducer
  })

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  const store = configureStore({
    reducer: persistedReducer
  })

  const persistor = persistStore(store)
  return { store, persistor }
}