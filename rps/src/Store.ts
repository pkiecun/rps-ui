import { configureStore,combineReducers } from "@reduxjs/toolkit";
//import { useReducer } from "react";
import gameReducer from "./Slices/GameSlice";
import loginReducer from "./Slices/LoginSlice";
import type { PreloadedState } from '@reduxjs/toolkit'

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  game: gameReducer,
  login: loginReducer
})

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch'];