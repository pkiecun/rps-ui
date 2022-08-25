import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import React from "react";
import {Home} from "./Home";
import { Provider } from 'react-redux';
import { store } from '../Store';

test('result page testing', ()=>{
    render(<Provider store = {store}><Home/></Provider>);
    const divElement = screen.getByTitle("result-page");
    const hElement = screen.getByText("CHOOSE!");
    expect(divElement).toBeInTheDocument();
    expect(hElement).toBeInTheDocument();
});

jest.mock('axios');

test('three functions in one test', async ()=>{
    const setRound = jest.fn();
    const oppMove = jest.fn();
    const chooseWinner = jest.fn();
    const roundChange = jest.spyOn(React,'useState');
    roundChange.mockImplementation(round => [round, setRound]);
    render(<Provider store = {store}><Home/></Provider>);
    const buttonElement = screen.getByAltText('picOfRock');
    const buttonSecondElement = screen.findByText("Play Again");
    fireEvent.click(buttonElement);
    waitFor(()=>{expect(buttonSecondElement).toBeInTheDocument();});
});
