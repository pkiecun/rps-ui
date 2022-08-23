import React, { useEffect, useState } from "react";
import "./Home.css";
import { Result } from "./Result";
import RockP1 from "../Images/RockP1.jpg";
import PaperP1 from "../Images/PaperP1.jpg";
import ScissorsP1 from "../Images/ScissorsP1.jpg";
import { IRound } from "../Interfaces/IRound";
import { IGame } from "../Interfaces/IGame";
import { AppDispatch, RootState } from "../Store";
import { useDispatch, useSelector } from "react-redux";
import { soloGame } from "../Slices/GameSlice";

export const Home: React.FC = () => {

  const [round, setRound] = useState<IRound>({userChoice: 0, opponentChoice: 0, winner: 0});
  const [record, setRecord] = useState<IGame>({matchTo: 3, wins: 0, losses: 0});
  const oppMove = useSelector((state:RootState) => state.game);
  const dispatch: AppDispatch = useDispatch();


  const chooseWinner = (round: IRound) => {
    
      
      if((round.userChoice === 1  && round.opponentChoice === 3)
          || (round.userChoice == 2 && round.opponentChoice === 1)
          || (round.userChoice === 3 && round.opponentChoice === 2)){
        round.winner = 1;
        setRound({
          userChoice:round.userChoice,
          opponentChoice:round.opponentChoice,
          winner: 1
        })
      }
      else if((round.userChoice === 1 && round.opponentChoice === 2)
              || (round.userChoice === 2 && round.opponentChoice === 3)
              || (round.userChoice === 3 && round.opponentChoice === 1)) {
        round.winner = 2;
        setRound({
          userChoice:round.userChoice,
          opponentChoice:round.opponentChoice,
          winner: 2
        })
      } else {
        round.winner = 0;
        setRound({
          userChoice:round.userChoice,
          opponentChoice:round.opponentChoice,
          winner: 0
        })
      }
  }

  const handleUserChoice = async (event: React.MouseEvent<HTMLButtonElement>) => {
      
      round.userChoice = parseInt(event.currentTarget.value);

      dispatch(soloGame());
      round.opponentChoice = oppMove.opponentChoice;

      chooseWinner(round);

      if(round.winner === 1){
        record.wins += 1;
      } else if(round.winner === 2){
        record.losses += 1;
      }

  }

  const handlePlayAgain = () => {
    setRound({
      userChoice: 0,
      opponentChoice: 0,
      winner: 1
    })
  }

  const makeJustinHappy = () => {
    
  }

  return (
    <div className="wholePage">
      <div className="result-page">
        <div className="wins-losses">
            <div className="wins">Wins
                <div className="win-count">{record.wins}</div>
            </div>
            <div className="losses">Losses
                <div className="loss-count">{record.losses}</div>
            </div>
        </div>
      </div>
      {round.userChoice === 0 ? 
        <>
        <h1>CHOOSE!</h1>
        <table className="table">
          <thead>
            <tr>
              <td><button  className="rock" value="1" onClick={handleUserChoice}><img className="image" src={RockP1} alt="picOfRock"/></button></td>
              <td><button className="paper" value="2" onClick={handleUserChoice}><img className="image" src={PaperP1} alt="picOfPaper"/></button></td>
              <td><button className="scissors" value="3" onClick={handleUserChoice}><img className="image" src={ScissorsP1} alt="picOfScissors"/></button></td>
            </tr>
          </thead>
        </table> 
        </>: <>
          <Result {...round}/>
          <button className="play-again" value="0" onClick={handlePlayAgain}>Play Again</button>
          <button onClick={makeJustinHappy}>Justin is very happy</button>
          </>} 
    </div>
  );
};