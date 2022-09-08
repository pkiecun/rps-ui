import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { bounce } from 'react-animations';
import { Client, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { RootState } from "../Store";
import { useDispatch, useSelector } from 'react-redux';
import RockP1 from "../Images/RockP1.jpg";
import RockP2 from "../Images/RockP2.jpg";
import PaperP1 from "../Images/PaperP1.jpg";
import ScissorsP1 from "../Images/ScissorsP1.jpg";
import { IRound } from "../Interfaces/IRound";
import { Result } from './Result';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../Store';
import { opponentMove } from '../Slices/GameSlice';
import './Messenger.css';
import { IMatch } from '../Interfaces/IMatch';


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
    var userName = {name:"Player", role: 1};
    const game = useSelector((state:RootState)=> state.game.round);
    // const [round, setRound] = useState<IRound>({userChoice: 0, opponentChoice: 0, winner: 4});
    const [usersChoice, setUserChoice] = useState<number>(0);
    const [opponentsChoice, setOpponentChoice] = useState<number>(0);
    var count = true;
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: {limit: 0, count: 0, move: 0},
        admin: false
    });
    const dispatch:AppDispatch = useDispatch();

    

    useEffect(()=>{
        if(!userData.connected){showConnect()}
        if(usersChoice !== 0 && opponentsChoice !== 0 && game.userChoice === 0 && game.opponentChoice === 0 && count){
            let neo = chooseWinner({userChoice: usersChoice, opponentChoice: opponentsChoice, winner: 0});
            dispatch(opponentMove(neo));
            count =false;
             
            //setTimeout(()=>{setRound({userChoice: 0, opponentChoice: 0, winner: 4})}, 5000);
        }
        
    },[game, usersChoice, opponentsChoice, userData.connected]);



    // Show the input box when the user clicks the Get Support button
    const showConnect = () => {
        let getUser: any;
         // http request fulfilled 
            if (userName.role == 3) {
                userData.username = userName.name;
                userData.admin = true;
                connect();
            } else if(userName.role == 2) {
                userData.username = userName.name;
                connect();
            }
         else { //error handling for api call
            console.log(userData.connected + "new attempt");
            userData.username = userName.name + Date.now();
            connect();
        };

        setShowSupport(false);
        setShowInput(true);
    }

    // Connection to the server
    const connect = () => {
        let Sock = new SockJS('http://localhost:8000/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    // When the connection is established, subscribe to the chat room
    const onConnected = () => {
        setUserData({ ...userData, "connected": true });
        if (stompClient) {
            stompClient.subscribe('/chatroom/public', onMessageReceived);
            stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
            userJoin();
        }
    }

    // New User joins the chat room
    const userJoin = () => {
        var chatMessage = {
            senderName: userData.username,
            status: "JOIN"
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
    }

    // New message received from the server
    const onMessageReceived = (payload: { body: string; }) => {
        let payloadData = JSON.parse(payload.body);
        switch (payloadData.status) {
            case "JOIN":
                console.log(publicChats);
                 if (!publicChats.get(payloadData.senderName)) {
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
    }

    // New private message received from the server
    const onPrivateMessage = (payload: { body: string; }) => {
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setOpponentChoice(payloadData.message.move);
            console.log(userData.connected);
            setUserData({ ...userData, "message": {limit: payloadData.message.limit, count:payloadData.message.count, move: userData.message.move} });
            console.log(userData.connected);
            setPrivateChats(new Map(privateChats));
            publicChats.delete(payloadData.senderName);
            setPublicChats(new Map(publicChats));
        } else {
            let list = [];
            list.push(payloadData);
            setOpponentChoice(payloadData.message.move);
            console.log(userData.connected);
            setUserData({ ...userData, "message": {limit: payloadData.message.limit, count:payloadData.message.count, move: userData.message.move} });
            console.log(userData.connected);
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
            publicChats.delete(payloadData.senderName);
            setPublicChats(new Map(publicChats));

        }
    }


    const onError = (err: any) => {
        console.log(err);
    }

    const handleMessage =  async (event: React.MouseEvent<HTMLButtonElement>) => {
        const  value  = event.currentTarget.value;
        console.log(userData.connected);
        setUserData({ ...userData, message: {limit:userData.message.limit, count: userData.message.count, move: parseInt(value)}});
        console.log(userData.connected);
    }

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
        setUserData({ ...userData, "connected": false });
    }
    const sendPrivateValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
                status: "MESSAGE"
            };
            if (userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            console.log(userData.connected);
            setUserData({ ...userData, "message": {limit: 0, count: 0, move: 0} });
            console.log(userData.connected);
            setUserChoice(chatMessage.message.move);
        }
    }
    // const handleUsername = (event: { target: { value: any; }; }) => {
    //     const { value } = event.target;
    //     setUserData({ ...userData, "username": value });
    // }
    // const registerUser = () => {
    //     setShowInput(false);
    //     connect();
    // }

    const chooseWinner = (round: IRound) => {
    
      let thisRound :IRound = {
            userChoice:round.userChoice,
            opponentChoice:round.opponentChoice,
            winner:0
      }
        if((round.userChoice === 1  && round.opponentChoice === 3)
            || (round.userChoice == 2 && round.opponentChoice === 1)
            || (round.userChoice === 3 && round.opponentChoice === 2)){
          
          thisRound = {
            userChoice:round.userChoice,
            opponentChoice:round.opponentChoice,
            winner:1
          }
        }
        else if((round.userChoice === 1 && round.opponentChoice === 2)
                || (round.userChoice === 2 && round.opponentChoice === 3)
                || (round.userChoice === 3 && round.opponentChoice === 1)) {
          
          thisRound = {
            userChoice:round.userChoice,
            opponentChoice:round.opponentChoice,
            winner:2
          }
        } else {
          
          thisRound = {
            userChoice:round.userChoice,
            opponentChoice:round.opponentChoice,
            winner:0
          }
        }
        return thisRound;
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>{
        if(event.currentTarget.id === "1"){
          dispatch(opponentMove({userChoice: 0, opponentChoice: 0, winner: 4}));
          setUserChoice(0);
          setOpponentChoice(0);
          count = true;
        }
        else {console.log("Something went horribly wrong")};
       };
    
       const firstSignal = (event: React.MouseEvent<HTMLElement>) =>{
        setTab(event.currentTarget.id);
        privateChats.set(event.currentTarget.id, []);
        setPrivateChats(new Map(privateChats));
       };

    return (
        <div className="container">
            {userData.connected ?
                <div className="chat-box">
                        <div className="public-list">
                            <ul>
                                {[...publicChats.keys()].slice(1).map((name,index) => (  
                                        <li onClick={firstSignal} className={`member ${tab === name && "active"}`} key={index} id={name}>{name}</li>     
                                    )
                                    )}
                            </ul>
                        </div>

                    
                        <div className="member-list">
                            <h3>In Game</h3>
                            <ul>
                                {[...privateChats.keys()].map((name, index) => (
                                        <li onClick={() => { setTab(name) }} className={`member ${tab === name && "active"}`} key={index}>{name}</li>     
                                    )
                                    )}
                            </ul>
                        </div>
                    

                    {tab !== "CHATROOM" && <div className="chat-content">

                        <button type="button" className='chat-close' onClick={closeChatBox}>X</button>
                        <ul className="chat-messages">
                            {[...privateChats.get(tab)].map((chat, index) => (
                                <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    {/* <>{console.log(userData.message+ " " + chat.message)}</> */}
                                    <>
                                    {/* {chat.senderName !== userData.username &&
                                    <>{setRound({userChoice: round.userChoice, opponentChoice: parseInt(chat.message), winner: 0})}
                                    {console.log(round)}</>
                                    } */}
                                    </>
                                    {/* {<div className="message-data">{round.winner}</div>} */}
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                    {/* <Result {...round}/> */}
                                </li>
                            ))}
                        </ul>
                        {userData.message.limit === 0 &&
                        <>
                        <h1>How many rounds?</h1>
                        <table className="table">
                          <thead>
                            <tr>
                              <td><button className="rock" value="1" onClick={()=>{setUserData({ ...userData, "message": {limit: 1, count: 0, move: 0} })}}>single game</button></td>
                              <td><button className="paper" value="2" onClick={()=>{setUserData({ ...userData, "message": {limit: 3, count: 0, move: 0} })}}>best of three</button></td>
                              <td><button className="scissors" value="3" onClick={()=>{setUserData({ ...userData, "message": {limit: 5, count: 0, move: 0} })}}>best of five</button></td>
                            </tr>
                          </thead>
                        </table> 
                        <div className="send-message">
                                            {/* <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} onKeyPress={(e) => keyPress(e)} /> */}
                                            <button type="button" className="send-button" onClick={sendPrivateValue}>Send</button>
                                        </div></>}
                        {usersChoice === 0 && userData.message.limit !== 0 &&
        <>
        <h1>CHOOSE!</h1>
        <table className="table">
          <thead>
            <tr>
              <td><button className="rock" value="1" onClick={handleMessage}><img className="image" src={RockP1} alt="picOfRock"/></button></td>
              <td><button className="paper" value="2" onClick={handleMessage}><img className="image" src={PaperP1} alt="picOfPaper"/></button></td>
              <td><button className="scissors" value="3" onClick={handleMessage}><img className="image" src={ScissorsP1} alt="picOfScissors"/></button></td>
            </tr>
          </thead>
        </table> 
        <div className="send-message">
                            {/* <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} onKeyPress={(e) => keyPress(e)} /> */}
                            <button type="button" className="send-button" onClick={sendPrivateValue}>Send</button>
                        </div>
          </>} 
                        
                    </div>}
                </div>
                :
                <button id= "joining" className={(!showInput && showSupport) ? "showConnect" : "hideConnect"} onClick={showConnect}>Multi-Player</button>
            }
            {usersChoice !== 0 && game.winner === 4 ? 
            <BouncyDiv className='bounce'>
            <div className='rock'><img className="image" src={RockP1} alt="picOfRock"/></div>
            <div className='rock'><img className="image" src={RockP2} alt="picOfRockflipped"/></div>
            </BouncyDiv>
            :
            /* nothing to show here */
            <></>
            }
            {game.userChoice !== 0 && game.opponentChoice !== 0 && game.winner !==4?
            <>{console.log(game.userChoice +" "+ game.opponentChoice +" "+ game.winner)}
            <Result {...game}/>
            <button id = "1" onClick={handleClick}>Play Again</button></>
            :<></>}
            <>
           
            {/* {async ()=>{ if(stuff.winner !== 4) {<Result {...stuff}/>}}} */}
            </>
        </div>
    )
}
export default Messenger;