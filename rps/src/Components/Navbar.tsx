import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RockP1 from '../Images/RockP1.jpg';
import ScissorsP2 from '../Images/ScissorsP2.jpg';
import './Navbar.css';

export const Navbar: React.FC = () => {

    const Navigator = useNavigate();
    const [isHovering, setIsHovering] = useState(false);
    const location = useLocation();
    const [loggedIn, setLoggedIn] = useState(false);
    const handleMouseOver = () => {setIsHovering(true);};  
    const handleMouseOut = () => {setIsHovering(false);};
        
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if(event.currentTarget.id === "nameImg"){
            Navigator('/');
        }
        // if(event.currentTarget.id === "loginText"){
        //     //Navigator('/login');
        // }
        // if(event.currentTarget.id === "logoutText"){
        //     //handle logout
        // }

        
    }

    useEffect(() => {
        // if invalid token, redirect to login
        // apiValidateLogin(localStorage.getItem("token")).then(result => {
        //     if(result){
        //         setLoggedIn(result)
        //     }}) 
        //     .catch(error=>{
        //         localStorage.setItem("token", null);
        //         //Navigator('/login')
        // });
                // eslint-disable-next-line
        }, [loggedIn])

    return(
        <div className = "navbar">
            <img className = "nameImg" id = "nameImg" src = {RockP1} onClick={handleClick} alt = "logo"/>
            {/* {location.pathname === "/" ?  */}
            <>
             <h1 title = "searchBar" id='nameImg' className = "searchBar" onClick={handleClick}>Rock, Paper, Scissors!</h1>
            <div >
                <img className = "profileImg" id = "profileImg" src = {ScissorsP2} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} alt = "profile-icon"/>
                 <div className = "login-Button" id = "login" style={{display: isHovering ? 'block' : 'none' }} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} >
                     {loggedIn ? <p className = "logoutText" title="logout" id="logout" onClick={handleClick}>Logout</p> : <p className = "loginText" onClick={handleClick}>Login</p>}
                </div>
            </div>
            </>
            {/*  : <></> } */}
        </div>
    );
}