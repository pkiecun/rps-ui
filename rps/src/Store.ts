import { configureStore } from "@reduxjs/toolkit";
//import { useReducer } from "react";
import gameReducer from "./Slices/GameSlice";
import loginReducer from "./Slices/LoginSlice";

export const store = configureStore({
    reducer: {
        game: gameReducer,
        login: loginReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;