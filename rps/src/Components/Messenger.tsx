import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { bounce } from "react-animations";
import { Client, over } from "stompjs";
import SockJS from "sockjs-client";
import { RootState } from "../Store";
import { useDispatch, useSelector } from "react-redux";
import RockP1 from "../Images/RockP1.jpg";
import RockP2 from "../Images/RockP2.jpg";
import PaperP1 from "../Images/PaperP1.jpg";
import ScissorsP1 from "../Images/ScissorsP1.jpg";
import { IRound } from "../Interfaces/IRound";
import { Result } from "./Result";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../Store";
import { clearGame, opponentMove, updateGame } from "../Slices/GameSlice";
import { setCurrent } from "../Slices/LoginSlice";
import "./Messenger.css";
import { IMatch } from "../Interfaces/IMatch";
import { IMessage } from "../Interfaces/IMessage";
import { IGame } from "../Interfaces/IGame";

const bounceAnimation = keyframes`${bounce}`;

const BouncyDiv = styled.div`
  animation: 2s ${bounceAnimation};
  animation-iteration-count: infinite;
`;

var stompClient: Client | null = null;
const Messenger: React.FC = () => {
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState(new Map());
  const [tab, setTab] = useState("CHATROOM");
  const [showInput, setShowInput] = useState(false);
  const [showSupport, setShowSupport] = useState(true);
  const userName = useSelector((state: RootState) => state.login.username);
  const counter = useSelector((state: RootState) => state.login.current);
  const game = useSelector((state: RootState) => state.game.round);
  const bigGame = useSelector((state: RootState) => state.game.game);
  // const [round, setRound] = useState<IRound>({userChoice: 0, opponentChoice: 0, winner: 4});
  const [usersChoice, setUserChoice] = useState<number>(0);
  const [opponentsChoice, setOpponentChoice] = useState<number>(0);
  const [tempChoice, setTempChoice] = useState<number>(0);
  const [thisCounter, setCountChange] = useState<number>(0);
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
  var stopper = false;
  const [userData, setUserData] = useState<IMessage>({
    senderName: "",
    receiverName: "",
    message :{ limit: 0, count: false, move: 0 },
    status:""
  });
  const [gameData, setGameData] = useState<IGame>({
    matchTo: 0,
    wins: 0,
    losses: 0,
    gameOver: false,
  });
  const dispatch: AppDispatch = useDispatch();
  //const [gameOver, setGameOver] = useState<string>("");

  useEffect(() => {
    if (!connectionStatus) {
      console.log(connectionStatus+" connection is called.");
      showConnect();
    }
    if (bigGame.matchTo === 0 && userData.message.limit) {
      dispatch(updateGame(userData.message.limit));
    }
    if (
      usersChoice !== 0 &&
      opponentsChoice !== 0 &&
      game.userChoice === 0 &&
      game.opponentChoice === 0 &&
      !stopper
    ) {
      let neo = chooseWinner({
        userChoice: usersChoice,
        opponentChoice: opponentsChoice,
        winner: 0,
      });
      dispatch(opponentMove(neo));
      stopper = true;

      //setTimeout(()=>{setRound({userChoice: 0, opponentChoice: 0, winner: 4})}, 5000);
    }
    // console.log(
    //   "useeffect connected?: " + connectionStatus + " username = " + userName
    // );
    // console.log("the proper count" + userData.message.count);
  }, [game.userChoice, game.opponentChoice, usersChoice, opponentsChoice, connectionStatus, userData.message.count]);

  // Show the input box when the user clicks the Get Support button
  const showConnect = () => {
    // http request fulfilled
    if (userName) {
      userData.senderName = userName;
      connect();
    }

    setShowSupport(false);
    setShowInput(true);
  };

  // Connection to the server
  const connect = () => {
    let Sock = new SockJS("http://localhost:8000/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  // When the connection is established, subscribe to the chat room
  const onConnected = () => {
    setConnectionStatus(true);
    if (stompClient) {
      stompClient.subscribe("/chatroom/public", onMessageReceived);
      stompClient.subscribe(
        "/user/" + userName + "/private",
        onPrivateMessage
      );
      userJoin();
    }
  };

  // New User joins the chat room
  const userJoin = () => {
    var chatMessage = {
      senderName: userData.senderName,
      status: "JOIN",
    };

    // var welcomeMsg = {
    //     senderName: "Admin",
    //     receiverName: userData.username,
    //     message: {},
    //     status: "MESSAGE"
    // };

    if (stompClient) {
      // console.log("joined chat");
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));

      // if (!userData.admin) {
      //     stompClient.send("/app/private-message", {}, JSON.stringify(welcomeMsg));
      //     if (!privateChats.get("Admin")) {
      //         privateChats.set("Admin", []);
      //         setPrivateChats(new Map(privateChats));
      //     }
      //     setTab("Admin");
      // }
    }
  };

  // New message received from the server
  const onMessageReceived = (payload: { body: string }) => {
    let payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        console.log(publicChats);
        if (
          !publicChats.get(payloadData.senderName) &&
          !privateChats.get(payloadData.senderName)
        ) {
          publicChats.set(payloadData.senderName, []);
          setPublicChats(new Map(publicChats));
          //  privateChats.set(payloadData.senderName, []);
          //  setPrivateChats(new Map(privateChats));
          // let startingList = publicChats;
          // startingList.push(payloadData.senderName);
          // setPublicChats(startingList);
          userJoin();
        }
        break;
      case "MESSAGE":
        // setPublicChats([...publicChats]);
        break;
    }
  };

  // New private message received from the server
  const onPrivateMessage = (payload: { body: string }) => {
    // console.log(userData);
    var payloadData = JSON.parse(payload.body);
    // console.log(userData.message.count+ "priv rec" + payloadData.message.count);
    // dispatch(setCurrent(payloadData.message.count));
    if (privateChats.get(payloadData.senderName)) {
      privateChats.get(payloadData.senderName).push(payloadData);
      if(payloadData.message.count){
        setTempChoice(0);
        setOpponentChoice(payloadData.message.move);
        // console.log(userData.message.count + "usercount if before user.connect " + payloadData.message.count);
        setUserData({
          ...userData,
          message: {
            limit: payloadData.message.limit,
            count: false,
            move: userData.message.move,
          },
        });
        // setCountChange(payloadData.message.count);  
      }else{
        setTempChoice(payloadData.message.move);
        // setCountChange(payloadData.message.count);
        setUserData({
          ...userData,
          message: {
            limit: payloadData.message.limit,
            count: true,
            move: userData.message.move,
          },
        });   
        // console.log(userData.message.count + "usercount else statement counter" + payloadData.message.count);
    }
      setGameData({ ...gameData, matchTo: payloadData.message.limit });
      setPrivateChats(new Map(privateChats));
      publicChats.delete(payloadData.senderName);
      setPublicChats(new Map(publicChats));
    } else {
      let list = [];
      list.push(payloadData);
      setOpponentChoice(payloadData.message.move);
      setUserData({
        ...userData,
        message: {
          limit: payloadData.message.limit,
          count: true,
          move: userData.message.move,
        },
      });
      setGameData({ ...gameData, matchTo: payloadData.message.limit });
      privateChats.set(payloadData.senderName, list);
      setPrivateChats(new Map(privateChats));
      publicChats.delete(payloadData.senderName);
      setPublicChats(new Map(publicChats));
    }
  };

  const onError = (err: any) => {
    console.log(err);
  };

  const handleMessage = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const value = event.currentTarget.value;
    // console.log(userData);
    setUserData({
      ...userData,
      message: {
        limit: userData.message.limit,
        count: userData.message.count,
        move: parseInt(value),
      },
    });
    setGameData({ ...gameData, matchTo: userData.message.limit });
    // console.log(connectionStatus + "inside handleMessage");
  };

  // const keyPress = (e: any) => {
  //     if (e.key === "Enter") {
  //         sendPrivateValue();
  //     }
  // }

  // const sendValue = () => {
  //     if (stompClient) {
  //         var chatMessage = {
  //             senderName: userData.username,
  //             message: userData.message,
  //             status: "MESSAGE"
  //         };
  //         console.log(chatMessage);
  //         stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  //         setUserData({ ...userData, "message": "" });
  //     }
  // }

  const closeChatBox = () => {
    setShowInput(false);
    setShowSupport(true);
    privateChats.delete(tab);
    setPrivateChats(new Map(privateChats));
    setTab("CHATROOM");
    setConnectionStatus(false);
  };
  const sendPrivateValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.senderName,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE",
      };
      if (userData.senderName !== tab) {
        privateChats.get(tab).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      // console.log(connectionStatus + " send priv val");
      setUserData({
        ...userData,
        message: {
          limit: userData.message.limit,
          count: userData.message.count,
          move: 0,
        },
      });
      // console.log(connectionStatus + "end val");
      setUserChoice(chatMessage.message.move);
    }
  };
  // const handleUsername = (event: { target: { value: any; }; }) => {
  //     const { value } = event.target;
  //     setUserData({ ...userData, "username": value });
  // }
  // const registerUser = () => {
  //     setShowInput(false);
  //     connect();
  // }

  const chooseWinner = (round: IRound) => {
    let thisRound: IRound = {
      userChoice: round.userChoice,
      opponentChoice: round.opponentChoice,
      winner: 0,
    };
    if (
      (round.userChoice === 1 && round.opponentChoice === 3) ||
      (round.userChoice == 2 && round.opponentChoice === 1) ||
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
    //updateScore(thisRound.winner);
    return thisRound;
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.currentTarget.id === "2") {
      dispatch(opponentMove({ userChoice: 0, opponentChoice: 0, winner: 4 }));
      setUserChoice(0);
      if(tempChoice !== 0){
        // console.log("inside handle click if & if msg" + userData.message.count);
        setOpponentChoice(tempChoice);
        setUserData({ ...userData, message: { limit: userData.message.limit, count: userData.message.count, move: 0 } })
        stopper = false;
      }else{
        // console.log("inside handle click if & else count/msg" + userData.message.count);
      setOpponentChoice(0);
      setUserData({ ...userData, message: { limit: userData.message.limit, count: userData.message.count, move: 0 } })
      stopper = false;}
    } else if (event.currentTarget.id === "1") {
      dispatch(clearGame());
      setUserChoice(0);
      setOpponentChoice(0);
      setUserData({ ...userData, message: { limit: 0, count: false, move: 0 } });
      stopper = false;
    } else {
      console.log("Something went horribly wrong");
    }
  };

  const firstSignal = (event: React.MouseEvent<HTMLElement>) => {
    setTab(event.currentTarget.id);
    privateChats.set(event.currentTarget.id, []);
    setPrivateChats(new Map(privateChats));
  };

  return (
    <div className="container">
      {connectionStatus ? (
        <div className="chat-box">
          <div className="public-list">
              <h3>Player Pool</h3>
            <ul>
              {[...publicChats.keys()].slice(1).map((name, index) => (
                <li
                  onClick={firstSignal}
                  className={`member ${tab === name && "active"}`}
                  key={index}
                  id={name}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <div className="member-list">
            <h3>In Game</h3>
            <ul>
              {[...privateChats.keys()].map((name, index) => (
                <li
                  onClick={() => {
                    setTab(name);
                  }}
                  className={`member ${tab === name && "active"}`}
                  key={index}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>

          {tab !== "CHATROOM" && (
            <div className="chat-content">
              {showInput ? (
                <button
                  type="button"
                  className="chat-close"
                  onClick={closeChatBox}
                >
                  Close
                </button>
              ) : (
                <button
                  type="button"
                  className="chat-close"
                  onClick={closeChatBox}
                >
                  Open
                </button>
              )}
              <ul className="chat-messages">
                {[...privateChats.get(tab)].map((chat, index) => (
                  <li
                    className={`message ${
                      chat.senderName === userData.senderName && "self"
                    }`}
                    key={index}
                  >
                    {chat.senderName !== userData.senderName && (
                      <div className="avatar">{chat.senderName}</div>
                    )}
                    <>
                    {chat.senderName !== userData.senderName && chat.message.count &&(
                      <div className="prompt">Challanger has made a move. Click next move to respond.</div>
                    )}
                    </>
                    {chat.senderName === userData.senderName && (
                      <div className="avatar self">{chat.senderName}</div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="result-page" title="result-page">
                <div className="wins-losses">
                  <div className="best-of">
                    Best Of
                    <div className="match-to">{bigGame.matchTo}</div>
                  </div>
                  <div className="wins">
                    Wins
                    <div className="win-count">{bigGame.wins}</div>
                  </div>
                  <div className="losses">
                    Losses
                    <div className="loss-count">{bigGame.losses}</div>
                  </div>
                </div>
              </div>
              {bigGame.matchTo === 0 && (
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
                              setUserData({
                                ...userData,
                                message: { limit: 1, count: userData.message.count, move: 0 },
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
                              setUserData({
                                ...userData,
                                message: { limit: 3, count: userData.message.count, move: 0 },
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
                              setUserData({
                                ...userData,
                                message: { limit: 5, count: userData.message.count, move: 0 },
                              });
                            }}
                          >
                            best of five
                          </button>
                        </td>
                      </tr>
                    </thead>
                  </table>
                  <div className="send-message">
                    {/* <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} onKeyPress={(e) => keyPress(e)} /> */}
                    {/* <button
                      type="button"
                      className="send-button"
                      onClick={sendPrivateValue}
                    >
                      Send
                    </button> */}
                  </div>
                </>
              )}
              {usersChoice === 0 && userData.message.limit !== 0 && (
                <>
                  <h1>CHOOSE!</h1>
                  <table className="table">
                    <thead>
                      <tr>
                        <td>
                          <button
                            className="rock"
                            value="1"
                            onClick={handleMessage}
                          >
                            <img
                              className="image"
                              src={RockP1}
                              alt="picOfRock"
                            />
                          </button>
                        </td>
                        <td>
                          <button
                            className="paper"
                            value="2"
                            onClick={handleMessage}
                          >
                            <img
                              className="image"
                              src={PaperP1}
                              alt="picOfPaper"
                            />
                          </button>
                        </td>
                        <td>
                          <button
                            className="scissors"
                            value="3"
                            onClick={handleMessage}
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
                    {/* <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} onKeyPress={(e) => keyPress(e)} /> */}
                    <button
                      type="button"
                      className="send-button"
                      onClick={sendPrivateValue}
                    >
                      RoShamBo!
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <button
          id="joining"
          className={!showInput && showSupport ? "showConnect" : "hideConnect"}
          onClick={showConnect}
        >
          Multi-Player
        </button>
      )}
      {usersChoice !== 0 && game.winner === 4 ? (
        <BouncyDiv className="bounce">
          <div className="rock">
            <img className="image" src={RockP1} alt="picOfRock" />
          </div>
          <div className="rock">
            <img className="image" src={RockP2} alt="picOfRockflipped" />
          </div>
        </BouncyDiv>
      ) : (
        /* nothing to show here */
        <></>
      )}
      {game.userChoice !== 0 &&
      game.opponentChoice !== 0 &&
      game.winner !== 4 &&
      bigGame.gameOver ? (
        <>
          {console.log(
            game.userChoice + " " + game.opponentChoice + " " + game.winner
          )}
          <Result {...game} />
          <button className="play-again" id="1" onClick={handleClick}>
            Play Again
          </button>
        </>
      ) : (
        <></>
      )}
      {game.userChoice !== 0 &&
      game.opponentChoice !== 0 &&
      game.winner !== 4 &&
      !bigGame.gameOver ? (
        <>
          <Result {...game} />
          <button className="choose-next" id="2" onClick={handleClick}>
            Choose Next Move
          </button>
        </>
      ) : (
        <></>
      )}
      <>{/* {async ()=>{ if(stuff.winner !== 4) {<Result {...stuff}/>}}} */}</>
    </div>
  );
};
export default Messenger;
