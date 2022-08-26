import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IGame } from "../Interfaces/IGame";

interface GameSliceState {
  loading: boolean;
  error: boolean;
  opponentChoice: number;
};

const initialGameState: GameSliceState = {
  loading: false,
  error: false,
  opponentChoice: Math.floor((Math.random() * 3) + 1)
};

export const soloGame = createAsyncThunk(
    "comp", 
    async (thunkAPI) => {
    try {
      const res = await axios.get(`http://3.21.163.16:8000/comp`);
      return res.data;
    } catch (e) {
      console.log(e);
    }
  });


export const GameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {
    clearGame: (state) => {
      state.opponentChoice = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(soloGame.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(soloGame.fulfilled, (state, action) => {
      state.opponentChoice = action.payload!;
      state.loading = false;
      state.error = false;
    });
  },
});

export const { clearGame } = GameSlice.actions;

export default GameSlice.reducer;