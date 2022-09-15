import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import React from "react";
import {Home} from "./Home";
import { Provider } from 'react-redux';
import { store } from '../Store';
import {BrowserRouter as Router} from "react-router-dom";
import { renderWithProviders } from '../test-utils';


test('result page testing', ()=>{
    renderWithProviders(<Router><Home/></Router>);
    const divElement = screen.getByTitle("result-page");
    const hElement = screen.getByText("CHOOSE!");
    expect(divElement).toBeInTheDocument();
    expect(hElement).toBeInTheDocument();
});



