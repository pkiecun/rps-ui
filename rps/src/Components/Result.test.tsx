import { renderWithProviders } from "../test-utils";
import {BrowserRouter as Router} from "react-router-dom";
import {Result} from './Result'
import React from "react";
import {fireEvent, render, screen, waitFor} from '@testing-library/react';


test('Result page navigates', ()=> {
    const mockProps = {
        userChoice: 1,
        opponentChoice: 3,
        winner: 4
    };
    renderWithProviders(<Router><Result {...mockProps}/></Router>);
    const homebtn =  screen.getByTitle('home');
    fireEvent.click(homebtn);
    const url = '/';
    expect(window.location.pathname).toBe(url);
});
