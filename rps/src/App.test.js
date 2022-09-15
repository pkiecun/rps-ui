import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import {Home} from "./Components/Home";
import { AppStore } from './Store';
import { renderWithProviders } from './test-utils';
import {BrowserRouter as Router} from "react-router-dom";


test('renders app', () => {
  renderWithProviders(<Router><SoloGame/></Router>);
  const divElement = screen.getByTitle("solo");
  expect(divElement).toBeInTheDocument();
});
