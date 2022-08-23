import React, { useState } from "react";
import "./Home.css";
import { Result } from "./Result";
import RockP1 from "../Images/RockP1.jpg";
import PaperP1 from "../Images/PaperP1.jpg";
import ScissorsP1 from "../Images/ScissorsP1.jpg";
import RockP2 from "../Images/RockP2.jpg";
import PaperP2 from "../Images/PaperP2.jpg";
import ScissorsP2 from "../Images/ScissorsP2.jpg";
import { IRound } from "../Interfaces/IRound";

export const Home: React.FC = () => {

  const [round, setRound] = useState<IRound>({userChoice: "0", opponentChoice: "0"});
  
  const handleUserChoice = (event: React.MouseEvent<HTMLButtonElement>) => {

      setRound({
        userChoice:event.currentTarget.value,
        opponentChoice:"1"
      })
  }

  return (
    <div className="wholePage">
      <div className="result-page">
        <div className="wins-losses">
            <div className="wins">Wins
                <div className="win-count">0</div>
            </div>
            <div className="losses">Losses
                <div className="loss-count">0</div>
            </div>
        </div>
        <div className="game-result">You win</div>
      </div>
      {round.userChoice == "0" ? 
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
          <button className="play-again" value="0" onClick={handleUserChoice}>Play Again</button>
          </>} 
    </div>
  );
};