import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { bounce } from "react-animations";
//import { Client, over } from "stompjs";
//import SockJS from "sockjs-client";
import { RootState } from "../Store";
import { useDispatch, useSelector } from "react-redux";
import RockP1 from "../Images/RockP1.jpg";
import RockP2 from "../Images/RockP2.jpg";
import PaperP1 from "../Images/PaperP1.jpg";
import ScissorsP1 from "../Images/ScissorsP1.jpg";
import { IRound } from "../Interfaces/IRound";
import { Result } from "./Result";
//import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../Store";
import {
  clearGame,
  findGame,
  opponentMove,
  startGame,
  updateGame,
} from "../Slices/GameSlice";
//import { setCurrent } from "../Slices/LoginSlice";
import "./Messenger.css";
//import { IMatch } from "../Interfaces/IMatch";
import { IMessage } from "../Interfaces/IMessage";
//import { IGame } from "../Interfaces/IGame";

const bounceAnimation = keyframes`${bounce}`;

const BouncyDiv = styled.div`
  animation: 2s ${bounceAnimation};
  animation-iteration-count: infinite;
`;

const Multi: React.FC = () => {
  const userName = useSelector((state: RootState) => state.login.username);
  const round = useSelector((state: RootState) => state.game.round);
  const game = useSelector((state: RootState) => state.game.game);
  const gameId = useSelector((state: RootState) => state.game.gameId);
  const [message, setMessage] = useState<IMessage>({
    senderName: userName!,
    receiverName: "",
    message: { limit: 0, move: 0, id: gameId! },
    status: "MESSAGE",
  });

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (message.message.id !== 0 && round.opponentChoice === 0) {
        setMessage({...message, message: {limit: message.message.limit, move:message.message.move, id: gameId!}});
        dispatch(findGame(message));
      
    }
    if (game.matchTo === 0 && message.message.limit) {
      dispatch(updateGame(message.message.limit));
    }
    if (round.userChoice !== 0 && round.opponentChoice !== 0) {
      let neo = chooseWinner({
        userChoice: round.userChoice,
        opponentChoice: round.opponentChoice,
        winner: 0,
      });
      dispatch(opponentMove(neo));
    }
  }, [
    round.userChoice,
    round.opponentChoice,
    game.gameOver,
    game.matchTo,
    gameId,
    message
  ]);

  const sendPrivateValue = () => {
    if (gameId !== 0) {
      dispatch(findGame(message));
    } else {
        let counter = 0;
      dispatch(startGame(message));
      console.log(counter);
      counter++;
    }
  };

  const chooseWinner = (round: IRound) => {
    let thisRound: IRound = {
      userChoice: round.userChoice,
      opponentChoice: round.opponentChoice,
      winner: 0,
    };
    if (
      (round.userChoice === 1 && round.opponentChoice === 3) ||
      (round.userChoice === 2 && round.opponentChoice === 1) ||
      (round.userChoice === 3 && round.opponentChoice === 2)
    ) {
      thisRound = {
        userChoice: round.userChoice,
        opponentChoice: round.opponentChoice,
        winner: 1,
      };
    } else if (
      (round.userChoice === 1 && round.opponentChoice === 2) ||
      (round.userChoice === 2 && round.opponentChoice === 3) ||
      (round.userChoice === 3 && round.opponentChoice === 1)
    ) {
      thisRound = {
        userChoice: round.userChoice,
        opponentChoice: round.opponentChoice,
        winner: 2,
      };
    } else {
      thisRound = {
        userChoice: round.userChoice,
        opponentChoice: round.opponentChoice,
        winner: 0,
      };
    }
    return thisRound;
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.currentTarget.id === "2") {
      dispatch(opponentMove({ userChoice: 0, opponentChoice: 0, winner: 4 }));
    } else if (event.currentTarget.id === "1") {
      dispatch(clearGame());
      setMessage({ ...message, message: { limit: message.message.limit, move: 0, id: gameId! } });
    }
  };

  return (
      
    <div className="container">
        { (userName == null||undefined) ? <><h1>Please Login First</h1></>:
        <div>
      <div className="result-page" title="result-page">
        <div className="wins-losses">
          <div className="best-of">
            Best Of
            <div className="match-to">{game.matchTo}</div>
          </div>
          <div className="wins">
            Wins
            <div className="win-count">{game.wins}</div>
          </div>
          <div className="losses">
            Losses
            <div className="loss-count">{game.losses}</div>
          </div>
        </div>
      </div>
      {game.matchTo === 0 && (
        <>
          <h1>How many rounds?</h1>
          <table className="table">
            <thead>
              <tr>
                <td>
                  <button
                    className="rock"
                    value="1"
                    onClick={() => {
                      setMessage({
                        ...message,
                        message: { limit: 1, move: message.message.move, id: gameId!},
                      });
                    }}
                  >
                    single game
                  </button>
                </td>
                <td>
                  <button
                    className="paper"
                    value="2"
                    onClick={() => {
                      setMessage({
                        ...message,
                        message: { limit: 3, move: message.message.move, id: gameId! },
                      });
                    }}
                  >
                    best of three
                  </button>
                </td>
                <td>
                  <button
                    className="scissors"
                    value="3"
                    onClick={() => {
                      setMessage({
                        ...message,
                        message: { limit: 5, move: message.message.move, id: gameId! },
                      });
                    }}
                  >
                    best of five
                  </button>
                </td>
              </tr>
            </thead>
          </table>
        </>
      )}
      {round.userChoice === 0 && message.message.limit !== 0 && (
        <>
          <h1>CHOOSE!</h1>
          <table className="table">
            <thead>
              <tr>
                <td>
                  <button
                    className="rock"
                    value="1"
                    onClick={() => {
                      setMessage({
                        ...message,
                        message: { limit: message.message.limit, move: 1, id: gameId! },
                      });
                    }}
                  >
                    <img className="image" src={RockP1} alt="picOfRock" />
                  </button>
                </td>
                <td>
                  <button
                    className="paper"
                    value="2"
                    onClick={() => {
                      setMessage({
                        ...message,
                        message: { limit: message.message.limit, move: 2, id: gameId! },
                      });
                    }}
                  >
                    <img className="image" src={PaperP1} alt="picOfPaper" />
                  </button>
                </td>
                <td>
                  <button
                    className="scissors"
                    value="3"
                    onClick={() => {
                      setMessage({
                        ...message,
                        message: { limit: message.message.limit, move: 3, id: gameId! },
                      });
                    }}
                  >
                    <img
                      className="image"
                      src={ScissorsP1}
                      alt="picOfScissors"
                    />
                  </button>
                </td>
              </tr>
            </thead>
          </table>
          <div className="send-message">
            {message.message.move !== 0 ? (
              <button
                type="button"
                className="send-button"
                onClick={sendPrivateValue}
              >
                RoShamBo!
              </button>
            ) : (
              <></>
            )}
          </div>
        </>
      )}

      {round.userChoice !== 0 && (round.winner !== 1 || 2 || 3) ? (
        <BouncyDiv className="bounce">
          <div className="rock">
            <img className="image" src={RockP1} alt="picOfRock" />
          </div>
          <div className="rock">
            <img className="image" src={RockP2} alt="picOfRockflipped" />
          </div>
        </BouncyDiv>
      ) : (
        <></>
      )}
      {round.userChoice !== 0 &&
      round.opponentChoice !== 0 &&
      round.winner === (1 || 2 || 3) &&
      game.gameOver ? (
        <>
          {console.log(
            round.userChoice + " " + round.opponentChoice + " " + round.winner
          )}
          <Result {...round} />
          <button className="play-again" id="1" onClick={handleClick}>
            Play Again
          </button>
        </>
      ) : (
        <></>
      )}
      {round.userChoice !== 0 &&
      round.opponentChoice !== 0 &&
      round.winner !== 4 &&
      !game.gameOver ? (
        <>
          <Result {...round} />
          <button className="choose-next" id="2" onClick={handleClick}>
            Choose Next Move
          </button>
        </>
      ) : (
        <></>
      )}
      <></>
      </div>}
    </div>
      
  );
};
export default Multi;
