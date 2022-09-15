import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IGame } from "../Interfaces/IGame";
import {IRound} from "../Interfaces/IRound"

interface GameSliceState {
  loading: boolean;
  error: boolean;
  opponentChoice: number;
  round: IRound;
  game: IGame;
};

const initialGameState: GameSliceState = {
  loading: false,
  error: false,
  opponentChoice: Math.floor((Math.random() * 3) + 1),
  round : {userChoice: 0, opponentChoice: 0, winner: 4},
  game: {matchTo: 0, wins: 0, losses: 0, gameOver: false}
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
      state.round = {userChoice: 0, opponentChoice: 0, winner: 4};
      state.game =  {matchTo: 0, wins: 0, losses: 0, gameOver: false};
    },
    opponentMove: (state, action) =>{
      state.round = action.payload;
      if(action.payload.winner === 1){
        state.game.wins++;
      } else if(action.payload.winner ===2){
        state.game.losses++;
      }
    },
    updateGame: (state, action) => {
      state.game.matchTo = action.payload;
    },
    endGame: (state, action) => {
      console.log("I should be ending the game here");
      state.game.gameOver = action.payload;
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

export const { clearGame, opponentMove, updateGame, endGame } = GameSlice.actions;

export default GameSlice.reducer;