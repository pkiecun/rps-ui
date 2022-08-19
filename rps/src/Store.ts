import { configureStore } from "@reduxjs/toolkit";
//import { useReducer } from "react";
import gameReducer from "./Slices/GameSlice";

export const store = configureStore({
    reducer: {
        game: gameReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;