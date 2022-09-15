import React from 'react'
import {BrowserRouter as Router} from "react-router-dom";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Register } from './Register';
import { renderWithProviders } from '../test-utils';

test('Username textbox is populated', async ()=>{
    
    renderWithProviders(<Router><Register/></Router>)

     const usernameInput = screen.getByTitle("username");
     userEvent.type(usernameInput, "testuser");
     await waitFor(() => {
         expect(screen.getByTitle("username")).toHaveValue("testuser");})
     
});

test('Password textbox is populated', async ()=>{

    renderWithProviders(<Router><Register/></Router>)

     const passwordInput = screen.getByTitle("password");
     userEvent.type(passwordInput, "testpassword");
     await waitFor(() => {
         expect(screen.getByTitle("password")).toHaveValue("testpassword");})
     
});

test('blank Register input', async () =>{

    renderWithProviders(<Router><Register/></Router>)

    const registerButton = screen.getByRole("button", {name: "Register"});
    userEvent.click(registerButton);
    await waitFor(() =>{
        expect(screen.getByTitle("noUsernameError")).toHaveTextContent("* Username is required");
        expect(screen.getByTitle("noPasswordError")).toHaveTextContent("* Password is required");
    })

})
