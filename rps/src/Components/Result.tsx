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
import styled, { keyframes } from 'styled-components';
import { bounceOut, slideInLeft, slideInRight } from 'react-animations';


const bounceAnimation = keyframes`${slideInLeft}`;
const bounceAnimation2 = keyframes`${slideInRight}`;

const BouncyDiv = styled.div`
      animation: 2s ${bounceAnimation};
      animation-iteration-count: 1;
    `;
const BouncyDiv2 = styled.div`
      animation: 2s ${bounceAnimation2};
      animation-iteration-count: 1;
    `;


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
        console.log("Home button has been clicked");
        dispatch(opponentMove({userChoice: 0, opponentChoice: 0, winner: 4}));
      navigate("/");
      }};

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
        <div className="overall">
        <h1 className="win-status">{winner}</h1>
        <div className="super-container">
        <BouncyDiv className="res-container">
        {round.userChoice === 1? <img className="res-img" src={RockP1} alt="picOfRock"/> : <></>}
        {round.userChoice === 2? <img className="res-img" src={PaperP1} alt="picOfPaper"/> : <></>}
        {round.userChoice === 3? <img className="res-img" src={ScissorsP1} alt="picOfScissors"/> : <></>}
        </BouncyDiv>
        <BouncyDiv2 className="res-container">
        {round.opponentChoice === 1? <img className="res-img2" src={RockP2} alt="picOfRock"/> : <></>}
        {round.opponentChoice === 2? <img className="res-img2" src={PaperP2} alt="picOfPaper"/> : <></>}
        {round.opponentChoice === 3? <img className="res-img2" src={ScissorsP2} alt="picOfScissors"/> : <></>}
        </BouncyDiv2>
        </div>
        <button title="home" id = "0" className= "home-btn" onClick={handleClick}>Home</button>
        </div>
        </>
    )

}