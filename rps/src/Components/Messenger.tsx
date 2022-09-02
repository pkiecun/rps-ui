import React, { useState, useEffect } from 'react'
import { Client, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { RootState } from "../Store";
import { useDispatch, useSelector } from 'react-redux';
import RockP1 from "../Images/RockP1.jpg";
import PaperP1 from "../Images/PaperP1.jpg";
import ScissorsP1 from "../Images/ScissorsP1.jpg";
import { IRound } from "../Interfaces/IRound";
import { MultiGame } from './MultiGame';
import { Result } from './Result';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../Store';
import { opponentMove } from '../Slices/GameSlice';

var stompClient: Client | null = null;
const Messenger: React.FC = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState("CHATROOM");
    const [showInput, setShowInput] = useState(false);
    const [showSupport, setShowSupport] = useState(true);
    var userName = {name:"Player", role: 1};
    const game = useSelector((state:RootState)=> state.game.round);
    const [round, setRound] = useState<IRound>({userChoice: 0, opponentChoice: 0, winner: 4});
    var count = true;
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: '0',
        admin: false
    });
    const dispatch:AppDispatch = useDispatch();

    useEffect(()=>{
        if(round.userChoice !== 0 && round.opponentChoice !== 0 && count){
            dispatch(opponentMove(chooseWinner(round)));
            count =false;
            console.log(game.winner + " " + count); 
            // setTimeout(()=>{setRound({userChoice: 0, opponentChoice: 0, winner: 4})}, 5000);
        }
        
    },[round]);



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

        var welcomeMsg = {
            senderName: "Admin",
            receiverName: userData.username,
            message: "Welcome " + userData.username + ". How can we help you?",
            status: "MESSAGE"
        };

        if (stompClient) {
            console.log("joined chat");
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
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                setPublicChats([...publicChats]);
                break;
        }
    }

    // New private message received from the server
    const onPrivateMessage = (payload: { body: string; }) => {
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setRound({userChoice: round.userChoice, opponentChoice: parseInt(payloadData.message), winner: 4});
            setPrivateChats(new Map(privateChats));

        } else {
            let list = [];
            list.push(payloadData);
            setRound({userChoice: round.userChoice, opponentChoice: parseInt(payloadData.message), winner: 4});
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
    }


    const onError = (err: any) => {
        console.log(err);
    }

    const handleMessage =  async (event: React.MouseEvent<HTMLButtonElement>) => {
        const  value  = event.currentTarget.value;
        setUserData({ ...userData, "message": value });
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
            setUserData({ ...userData, "message": "" });
            setRound({userChoice: parseInt(chatMessage.message), opponentChoice: round.opponentChoice, winner: 4});
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
    return (
        <div className="container">
            {userData.connected ?
                <div className="chat-box">

                    
                        <div className="member-list">
                            <ul>
                                {[...privateChats.keys()].map((name, index) => (
                                        <li onClick={() => { setTab(name) }} className={`member ${tab === name && "active"}`} key={index}>{name}</li>     
                                ))}
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
                        {round.userChoice === 0 && 
        <>
        <h1>CHOOSE!</h1>
        <table className="table">
          <thead>
            <tr>
              <td><button  className="rock" value="1" onClick={handleMessage}><img className="image" src={RockP1} alt="picOfRock"/></button></td>
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
                <button className={(!showInput && showSupport) ? "showConnect" : "hideConnect"} onClick={showConnect}>Multi-Player</button>
            }
            {round.userChoice !== 0 && round.opponentChoice !== 0 && round.winner !==4?
            <>{console.log(round)}
            <Result {...round}/></>
            :<></>}
            <>
           
            {/* {async ()=>{ if(stuff.winner !== 4) {<Result {...stuff}/>}}} */}
            </>
        </div>
    )
}
export default Messenger;