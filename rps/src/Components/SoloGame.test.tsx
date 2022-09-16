import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import React from 'react';
import {SoloGame} from './SoloGame';
import { IRound } from '../Interfaces/IRound';
import {BrowserRouter as Router} from "react-router-dom";
import { Provider } from 'react-redux';
import { AppStore } from '../Store';
import { renderWithProviders } from '../test-utils';




test('button is on screen', ()=>{
    renderWithProviders(<Router><SoloGame/></Router>);
    const rockButton = screen.getByTitle('rock');
    expect(rockButton).toBeInTheDocument();
});

test('button is on screen', async ()=>{
    renderWithProviders(<Router><SoloGame/></Router>);
    const rockButton = screen.getByTitle('rock');
    fireEvent.click(rockButton);
    const playAgainBtn = waitFor(()=>screen.getByTitle('play'));
    waitFor(()=>expect(playAgainBtn).toBeInTheDocument());
});




test('three functions in one test loss', async ()=>{
  const round = {userchoice: 1, opponentChoice:2, winner: 4};
  const setRound = jest.fn();
  const oppMove = jest.fn();
  const chooseWinner = jest.fn();
  //const roundChange = jest.spyOn(React,'useState');
  const roundChange = setRound as jest.Mock<any>;
  roundChange.mockImplementationOnce((round:IRound)=> [{userChoice: 1, opponentChoice: 2, winner: 4}]);
  renderWithProviders(<Router><SoloGame/></Router>);
  const buttonElement = screen.getByAltText('picOfRock');
  const buttonSecondElement = screen.findByText("Play Again");
  const recordElement = screen.findAllByTitle('record-loss')

  fireEvent.click(buttonElement);
  waitFor(()=>{expect(buttonSecondElement).toBeInTheDocument();});
  waitFor(()=>{expect(recordElement).toHaveTextContent("1")});

});


test('three functions in one test win', async ()=>{
  const round = {userchoice: 2, opponentChoice:1, winner: 4};
  const setRound = jest.fn();
  const oppMove = jest.fn();
  const chooseWinner = jest.fn();
  //const roundChange = jest.spyOn(React,'useState');
  const roundChange = setRound as jest.Mock<any>;
  roundChange.mockImplementationOnce((round:IRound)=> [{userChoice: 3, opponentChoice: 2, winner: 4}]);
  renderWithProviders(<Router><SoloGame/></Router>);
  const buttonElement = screen.getByAltText('picOfScissors');
  const buttonSecondElement = screen.findByText("Play Again");
  const recordElement = screen.findAllByTitle('record')
  fireEvent.click(buttonElement);
  waitFor(()=>{expect(buttonSecondElement).toBeInTheDocument();});
  waitFor(()=>{expect(recordElement).toHaveTextContent("1")});
});


test('three functions in one test tie', async ()=>{
  const round = {userchoice: 1, opponentChoice:1, winner: 4};
  const setRound = jest.fn();
  const oppMove = jest.fn();
  const chooseWinner = jest.fn();
  //const roundChange = jest.spyOn(React,'useState');
  const roundChange = setRound as jest.Mock<any>;
  roundChange.mockImplementationOnce((round:IRound)=> [{userChoice: 2, opponentChoice: 2, winner: 0}]);
  renderWithProviders(<Router><SoloGame/></Router>);
  const buttonElement = screen.getByAltText('picOfPaper');
  const buttonSecondElement = waitFor(()=>screen.findByText("Play Again"));
  fireEvent.click(buttonElement);
  fireEvent.click(await buttonSecondElement);
  
  waitFor(()=>{expect(buttonElement).toBeInTheDocument();});

});