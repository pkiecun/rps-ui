import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { Navbar } from "./Navbar";
// import { Result } from "./Result";
import RockP1 from "../Images/RockP1.jpg";
import PaperP1 from "../Images/PaperP1.jpg";
import ScissorsP1 from "../Images/ScissorsP1.jpg";
import RockP2 from "../Images/RockP2.jpg";
import PaperP2 from "../Images/PaperP2.jpg";
import ScissorsP2 from "../Images/ScissorsP2.jpg";
// import { IRound } from "../Interfaces/IRound";
// import { IGame } from "../Interfaces/IGame";
// import { AppDispatch, RootState } from "../Store";
// import { useDispatch, useSelector } from "react-redux";
// import { soloGame } from "../Slices/GameSlice";
// import Messenger from "./Messenger";
import styled, { keyframes } from "styled-components";
import { bounceOut, slideInLeft, slideInRight } from "react-animations";

const bounceAnimation = keyframes`${slideInLeft}`;
const bounceAnimation2 = keyframes`${slideInRight}`;

const BouncyDiv = styled.div`
  animation: 2s ${bounceAnimation};
  animation-iteration-count: infinite;
  animation-direction: alternate;
`;
const BouncyDiv2 = styled.div`
  animation: 2s ${bounceAnimation2};
  animation-iteration-count: infinite;
  animation-direction: alternate;
`;

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userSide, setUserSide] = useState<number>(1);
  const [oppSide, setOppSide] = useState<number>(3);

  useEffect(() => {
    setInterval(() => changeAnimation(), 4000);
  }, []);

  // const dispatch: AppDispatch = useDispatch();

  const changeAnimation = () => {
    setUserSide(Math.floor(Math.random() * 3) + 1);
    setOppSide(Math.floor(Math.random() * 3) + 1);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.currentTarget.id === "1") {
      navigate("/solo");
    }
    if (event.currentTarget.id === "2") {
      navigate("/multi");
    }
  };

  return (
    <div className="wholePage">
      {/* <button onClick={enterQueue}>Multi</button> */}
      {/* <Navbar/> */}
      <table className="animation">
        <tbody>
          <tr>
            <td>
              <BouncyDiv className="res-container">
                {userSide === 1 ? (
                  <img className="res-img3" src={RockP1} alt="picOfRock" />
                ) : (
                  <></>
                )}
                {userSide === 2 ? (
                  <img className="res-img3" src={PaperP1} alt="picOfPaper" />
                ) : (
                  <></>
                )}
                {userSide === 3 ? (
                  <img
                    className="res-img3"
                    src={ScissorsP1}
                    alt="picOfScissors"
                  />
                ) : (
                  <></>
                )}
              </BouncyDiv>
            </td>
            <td>
              <BouncyDiv2 className="res-container">
                {oppSide === 1 ? (
                  <img className="res-img4" src={RockP2} alt="picOfRock" />
                ) : (
                  <></>
                )}
                {oppSide === 2 ? (
                  <img className="res-img4" src={PaperP2} alt="picOfPaper" />
                ) : (
                  <></>
                )}
                {oppSide === 3 ? (
                  <img
                    className="res-img4"
                    src={ScissorsP2}
                    alt="picOfScissors"
                  />
                ) : (
                  <></>
                )}
              </BouncyDiv2>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="rules-container">
        <tbody>
          <tr className="single-multi">
            <th className="single">
              <button
                className="solo"
                title="solo"
                id="1"
                onClick={handleClick}
              >
                Solo
              </button>
            </th>
            <th className="multi1">
              <button
                className="multi"
                title="multi"
                id="2"
                onClick={handleClick}
              >
                Multi-player
              </button>
            </th>
          </tr>
          <tr className="rules-txt">
            <td>
              <p className="single-rules">
                Play against computer, select your move and see how you do
                against our next-gen AI software
              </p>
            </td>

            <td>
              <p className="multi-rules">
                To play with another user: Login and wait for another user to
                login, then click on their username when it pops up. Choose a
                round limit, then pick your move and send it! Wait for a
                response and Boom! RoShamBo!
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
