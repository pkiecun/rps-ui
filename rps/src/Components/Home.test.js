import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import React from "react";
import {Home} from "./Home";
import { Provider } from 'react-redux';
import { store } from '../Store';
import {BrowserRouter as Router} from "react-router-dom";
import { renderWithProviders } from '../test-utils';


test('solo btn works', ()=>{
    renderWithProviders(<Router><Home/></Router>);
    const solo =  screen.getByTitle('solo');
    fireEvent.click( solo);
    const url = '/solo';
    waitFor(()=>expect(window.location.pathname).toBe(url));
});

test('multi btn works', ()=>{
    renderWithProviders(<Router><Home/></Router>);
    const multi =  screen.getByTitle('multi');
    fireEvent.click( multi);
    const url = '/multi';
    waitFor(()=>expect(window.location.pathname).toBe(url));
});

