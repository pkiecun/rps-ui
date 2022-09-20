import { renderWithProviders } from "../test-utils";
import {BrowserRouter as Router} from "react-router-dom";
import {Navbar} from './Navbar'
import React from "react";
import {fireEvent, render, screen, waitFor} from '@testing-library/react';



test('Logo goes to home', ()=>{
    renderWithProviders(<Router><Navbar/></Router>);
    const logo =  screen.getByAltText('logo');
    fireEvent.click(logo);
    const url = '/';
    expect(window.location.pathname).toBe(url);
});

test('logout btn works', async ()=>{
    renderWithProviders(<Router><Navbar/></Router>);
    const logout =  screen.findByTitle('logout');
    fireEvent.click(await logout);
    const url = '/';
    expect(window.location.pathname).toBe(url);
    expect(localStorage.length).toBe(0);
});

test('login btn works',  ()=>{
    renderWithProviders(<Router><Navbar/></Router>);
    const login =  screen.getByTitle('login');
    const hover = screen.getByTitle('hover');
    fireEvent.mouseOver(hover);
    fireEvent.click(login);
    const url = '/login';
    waitFor(()=>expect(window.location.pathname).toBe(url));
});