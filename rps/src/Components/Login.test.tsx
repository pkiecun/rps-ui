import React from 'react'
import {BrowserRouter as Router} from "react-router-dom";
import { screen, fireEvent, waitFor} from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import {Login} from "./Login";
import { renderWithProviders } from '../test-utils';

test('Username textbox is populated', async ()=>{
    
    renderWithProviders(<Router><Login/></Router>)

     const usernameInput = screen.getByTitle("username");
     userEvent.type(usernameInput, "testuser");
     await waitFor(() => {
         expect(screen.getByTitle("username")).toHaveValue("testuser");})
     
});

test('Password textbox is populated', async ()=>{

    renderWithProviders(<Router><Login/></Router>)

     const passwordInput = screen.getByTitle("password");
     userEvent.type(passwordInput, "testpassword");
     await waitFor(() => {
         expect(screen.getByTitle("password")).toHaveValue("testpassword");})
     
});

test('blank login input', async () =>{

    renderWithProviders(<Router><Login/></Router>)

    const loginButton = screen.getByRole("button", {name: "Login"});
    userEvent.click(loginButton);
     waitFor(() =>{
        expect(screen.getByTitle("noUsernameError")).toHaveTextContent("* Username is required");
        expect(screen.getByTitle("noPasswordError")).toHaveTextContent("* Password is required");
    })

})

test('register login link', async () =>{

    renderWithProviders(<Router><Login/></Router>)

    const linkRegister = screen.getByRole("link", {name: "Register"});
    userEvent.click(linkRegister);
     waitFor(() =>{
        expect(screen.getByTitle("registerTitle")).toHaveTextContent("Register");
    })

})
