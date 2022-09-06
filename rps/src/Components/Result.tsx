import React, { useEffect, useState } from "react";
import { IRound } from "../Interfaces/IRound";
import "./Result.css";
import RockP1 from "../Images/RockP1.jpg";
import PaperP1 from "../Images/PaperP1.jpg";
import ScissorsP1 from "../Images/ScissorsP1.jpg";
import RockP2 from "../Images/RockP2.jpg";
import PaperP2 from "../Images/PaperP2.jpg";
import ScissorsP2 from "../Images/ScissorsP2.jpg";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from '../Store';
import { opponentMove } from '../Slices/GameSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../Store";


export const Result: React.FC<IRound> = (round: IRound) => {
    console.log(round);
    const [winner, setWinner] = useState<string>("");
    const game = useSelector((state:RootState)=> state.game.round);
    const dispatch:AppDispatch = useDispatch();

    useEffect(() => {
        displayResult(round);
    },[])
    const navigate = useNavigate();
    
  
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>{
      if(event.currentTarget.id === "0"){
        dispatch(opponentMove({userChoice: 0, opponentChoice: 0, winner: 4}));
      navigate("/");
      }
     };

    const displayResult = (round: IRound) => {
        if(round.winner === 0){
            setWinner("tie"); 
        }
        else if(round.winner === 1){
            setWinner("You are a winner");
        }
        else if(round.winner === 2) {
            setWinner("You are a LOOOOOSEERR");
        }
    }


    return(
        <>
        <h1 className="win-status">{winner}</h1>
        {round.userChoice === 1? <img className="image" src={RockP1} alt="picOfRock"/> : <></>}
        {round.userChoice === 2? <img className="image" src={PaperP1} alt="picOfPaper"/> : <></>}
        {round.userChoice === 3? <img className="image" src={ScissorsP1} alt="picOfScissors"/> : <></>}
        {round.opponentChoice === 1? <img className="image" src={RockP2} alt="picOfRock"/> : <></>}
        {round.opponentChoice === 2? <img className="image" src={PaperP2} alt="picOfPaper"/> : <></>}
        {round.opponentChoice === 3? <img className="image" src={ScissorsP2} alt="picOfScissors"/> : <></>}
        <button id = "0" onClick={handleClick}>Home</button>
        </>
    )

}