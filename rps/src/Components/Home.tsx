import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';
import { Navbar } from "./Navbar";
// import { Result } from "./Result";
// import RockP1 from "../Images/RockP1.jpg";
// import PaperP1 from "../Images/PaperP1.jpg";
// import ScissorsP1 from "../Images/ScissorsP1.jpg";
// import { IRound } from "../Interfaces/IRound";
// import { IGame } from "../Interfaces/IGame";
// import { AppDispatch, RootState } from "../Store";
// import { useDispatch, useSelector } from "react-redux";
// import { soloGame } from "../Slices/GameSlice";
// import Messenger from "./Messenger";

export const Home: React.FC = () => {

  const navigate = useNavigate();
  // const dispatch: AppDispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>{
    if(event.currentTarget.id === "1"){
    navigate("/solo");
    }
    if(event.currentTarget.id === "2"){
      navigate("/multi");
    }
   };

  return (
    <div className="wholePage">
          {/* <button onClick={enterQueue}>Multi</button> */}
          {/* <Navbar/> */}
          <button className="solo" title="solo" id = "1" onClick={handleClick}>Solo</button>
          <button className="multi" title="multi" id = "2" onClick={handleClick}>Multi-player</button>
          {/* <Messenger/> */}
    </div>
  );
};