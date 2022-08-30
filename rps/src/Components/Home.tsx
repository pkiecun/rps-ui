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
import Messenger from "./Messenger";

export const Home: React.FC = () => {

 
  const dispatch: AppDispatch = useDispatch();

  // const enterQueue = ( ) =>{
  //   let 
  // };

  return (
    <div className="wholePage">
          {/* <button onClick={enterQueue}>Multi</button> */}
          <button>Solo</button>
          <Messenger/>
    </div>
  );
};