import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IGame } from "../Interfaces/IGame";
import { IMessage } from "../Interfaces/IMessage";
import {IRound} from "../Interfaces/IRound"

interface GameSliceState {
  loading: boolean;
  error: boolean;
  opponentChoice: number;
  round: IRound;
  game: IGame;
  gameId?: number
  oppUser: string
};

const initialGameState: GameSliceState = {
  loading: false,
  error: false,
  opponentChoice: Math.floor((Math.random() * 3) + 1),
  round : {userChoice: 0, opponentChoice: 0, winner: 4},
  game: {matchTo: 0, wins: 0, losses: 0, gameOver: false},
  gameId: 0,
  oppUser: ""
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

  

  export const startGame = createAsyncThunk(
    "start", 
    async (message:IMessage, thunkAPI) => {
    try {
      const res = await axios.post(`http://localhost:8000/multi/start`, message);
      console.log(res.data);
      return {
          senderName: res.data.senderName,
          receiverName: res.data.receiverName,
          message: {
            limit: res.data.message.limit,
            move: res.data.message.move,
            id: res.data.message.id
          },
          status: res.data.status
      };
    } catch (e) {
      console.log(e);
    }
  });

  export const findGame = createAsyncThunk(
    "find", 
    async (message:IMessage, thunkAPI) => {
    try {
      const res = await axios.put(`http://localhost:8000/multi/find`, message);
      console.log(res.data);
      return  {
        senderName: res.data.senderName,
        receiverName: res.data.receiverName,
        message: {
          limit: res.data.message.limit,
          move: res.data.message.move,
          id: res.data.message.id
        },
        status: res.data.status
    };
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
    builder.addCase(startGame.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(startGame.fulfilled, (state, action)=> {
      state.gameId = action.payload?.message.id!;
      state.round.userChoice = action.payload?.message.move;
      state.game.matchTo = action.payload?.message.limit;
      state.loading = false;
      state.error = false;
    })
    builder.addCase(findGame.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(findGame.fulfilled, (state, action)=> {
      state.gameId = action.payload?.message.id;
      state.round.opponentChoice = action.payload?.message.move;
      state.oppUser = action.payload?.receiverName;
      state.loading = false;
      state.error = false;
    })
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