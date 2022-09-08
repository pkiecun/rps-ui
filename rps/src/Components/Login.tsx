import "./Login.css";
import logo from '../../image/pixelgram-logo.png';
import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { apiLogin, apiValidateLogin } from "../Slices/LoginSlice";
import RockP1 from '../Images/RockP1.jpg';
// import { apiLogin } from "../../Remote/LoginService";

// import { apiValidateLogin } from "../../Remote/NavbarService";

export const Login: React.FC = () => {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [noUsernameError, setNoUserNameError] = useState<string>('');
    const [noPasswordError, setNoPasswordError] = useState<string>('');
    const [incorrectLogin, setIncorrectLogin] = useState<string>('');
    // var user = '';
    // var passwordinput = '';

    const navigator = useNavigate();

    useEffect(() => {
        //if valid token, redirect to homepage
        apiValidateLogin(localStorage.getItem("token")).then(result => {
            if(result){
                //navigator('/');
                console.log("useless useEffect");
            }})
            .catch(error =>{
                console.log(error);
                // do nothing
                // eslint-disable-next-line
        })},[]);

        const handleLogin = (username: String, password: String ) => {
        if(username === ''){
            setNoUserNameError("* Username is required");
        } 
        else{setNoUserNameError('');
        }
        if(password === ''){
            setNoPasswordError("* Password is required");
        } 
        else{
            setNoPasswordError('');
        }
    
        apiLogin(username, password).then(result=>{
            if(result.status !== 200){
            setIncorrectLogin("* Username or password incorrect");
            } else{
            // reset incorrect login error if present
            setIncorrectLogin('');
            // put auth token into local storage
            localStorage.setItem("token", result.payload.token);
            console.log(result.payload.token);
            //navigate to home
            navigator('/');
            }
        }).catch(error => {
            setIncorrectLogin("* Username or password incorrect");
            return error;
        });
    }
    

    const handleSubmit = () => {
        handleLogin(username, password);
    }

    const handleUsernameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }

    const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }


    return (
        <>
            <div className="login" title="login">
                <div className="loginHeader" title="loginHeader">
                    <div className="pixelgramLogo" title="pixelgramLogo">
                        <img src={RockP1} alt="logo" height= "53" width = "53"/>
                    </div>
                    <div className="vertBar" title="vertBar"></div>
                    <div className="loginTitle" title="loginTitle">Login</div>
                </div>
                <div className="loginForm" title="loginForm">
                    <div className="usernameContainer" title="usernameContainer">
                        <input className="usernameTextbox" name="username" title="username" type="text" placeholder="Username..." onChange={handleUsernameInput} value={username} required></input>
                    </div>
                    <div className="passwordContainer" title="passwordContainer">
                        <div className="noUsernameError" title="noUsernameError">{noUsernameError}</div>
                        <input className="passwordTextbox" name="password" title="password" type="password" placeholder="Password..." onChange={handlePasswordInput} value={password}></input>
                       
                    </div>
                    
                </div>
                <div className="loginFooter" title="loginFooter">
                    <div className="noPasswordError" title="noPasswordError">{noPasswordError}</div>
                    <div className="incorrectLogin"  title="incorrectLoginError" >{incorrectLogin}</div> 
                    <button className="loginButton" type="button" onClick={handleSubmit}>Login</button> 
                </div>
            </div>
        </>
    )
}
