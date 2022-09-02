import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IGame } from "../Interfaces/IGame";
import {IRound} from "../Interfaces/IRound"

interface GameSliceState {
  loading: boolean;
  error: boolean;
  opponentChoice: number;
  round: IRound;
};

const initialGameState: GameSliceState = {
  loading: false,
  error: false,
  opponentChoice: Math.floor((Math.random() * 3) + 1),
  round : {userChoice: 0, opponentChoice: 0, winner: 4}
};
//http://localhost:8000
//http://3.21.163.16:8000/comp

export const soloGame = createAsyncThunk(
    "comp", 
    async (thunkAPI) => {
    try {
      const res = await axios.get(`http://localhost:8000/comp`);
      return res.data;
    } catch (e) {
      console.log(e);
    }
  });

  // export const multiGame = createAsyncThunk(
  //   "multi", 
  //   async (thunkAPI) => {
  //   try {
  //     const res = await axios.get(`http://localhost:8000/comp`);
  //     return res.data;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // });


export const GameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {
    clearGame: (state) => {
      state.opponentChoice = 0;
    },
    userMove: (state, action) =>{
      state.round.userChoice = parseInt(action.payload);
    },
    opponentMove: (state, action) =>{
      state.round = action.payload;
    }
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
    // builder.addCase(multiGame.pending, (state, action) => {
    //   state.loading = true;
    // });

    // builder.addCase(multiGame.fulfilled, (state, action) => {
    //   state.opponentChoice = action.payload!;
    //   state.loading = false;
    //   state.error = false;
    // });
  },
});

export const { clearGame, opponentMove } = GameSlice.actions;

export default GameSlice.reducer;