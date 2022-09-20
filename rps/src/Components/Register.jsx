import "./Register.css";
import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
// import { apiLogin } from "../../Remote/LoginService";
//import { HandleRegister } from "./HandleRegister";
import { Navbar } from "./Navbar";
import { apiValidateLogin, apiRegister, setUser } from "../Slices/LoginSlice";
import { useDispatch } from 'react-redux'

export const Register = () => {

    const [username1, setUsername] = useState('');
    const [password1, setPassword] = useState('');
    const [noUsernameError1, setNoUserNameError] = useState('');
    const [noPasswordError1, setNoPasswordError] = useState('');
    const [incorrect, setIncorrect] = useState('');

    const navigator1 = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        //if valid token, redirect to homepage
        apiValidateLogin(localStorage.getItem("token")).then(result => {
            if(result.payload){
                console.log("result = ", result);
                console.log("token = " + localStorage.getItem("token"));
                navigator1('/');
            }})
            .catch(error=>{
                // do nothing
                // eslint-disable-next-line
        })},[]);

    const handleUsernameInput1 = event => {
        setUsername(event.target.value);
    }

    const handlePasswordInput1 = event => {
        setPassword(event.target.value);
    }

    const HandleRegister = () => {
    
        if(username1 === ''){
            setNoUserNameError("* Username is required");
        } else{setNoUserNameError('');}
        if(password1 === ''){
            setNoPasswordError("* Password is required");
        } else{setNoPasswordError('');}
    
        apiRegister(username1, password1).then(result=>{
            console.log(result);
            if(result.status !== 200){
            setIncorrect("* Username or password incorrect");
            } else{
            // reset incorrect login error if present
            setIncorrect('');
            // put auth token into local storage
            localStorage.setItem("token", result.payload.token);
            apiValidateLogin(localStorage.getItem("token")).then(result => {
                if(result.payload){
                    dispatch(setUser(username1));
                    navigator1('/');
                }})
                .catch(error=>{
                    // do nothing
                    // eslint-disable-next-line
            })
            //navigate to home
            //navigator('/');
            }
        }).catch(error => {
            setIncorrect("* Username already in system please choose new username.");
            return error;
        });
    }

    return (
        <>
            <div className="register1" title="register">
                <div className="registerHeader1" title="registerHeader">
                    <div className="vertBar1" title="vertBar"></div>
                    <div className="registerTitle1" title="registerTitle">Register</div>
                </div>
                <div className="registerForm1" title="registerForm">
                    <div className="usernameContainer1" title="usernameContainer">
                        <input className="usernameTextbox1" name="username" title="username" type="text" placeholder="Username..." onChange={handleUsernameInput1} value={username1} required></input>
                    </div>
                    <div className="passwordContainer1" title="passwordContainer">
                        <div className="noUsernameError1" title="noUsernameError" type="text">{noUsernameError1}</div>
                        <input className="passwordTextbox1" name="password" title="password" type="password" placeholder="Password..." onChange={handlePasswordInput1} value={password1}></input>
                       
                    </div>
                    
                </div>
                <div className="registerFooter" title="registerFooter">
                    <div className="noPasswordError" title="noPasswordError" type="text">{noPasswordError1}</div>
                    <div className="incorrectregister"  title="incorrectLoginError" type="text">{incorrect}</div> 
                    <button className="registerButton" type="button" onClick={HandleRegister}>Register</button> 
                </div>
            </div>
        </>
    )
}
