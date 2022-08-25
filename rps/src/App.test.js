import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import {Home} from "./Components/Home";
import { store } from './Store';

test('renders learn react link', () => {
  render(<Provider store = {store}><App/></Provider>);
  const divElement = screen.getByTitle("result-page");
  expect(divElement).toBeInTheDocument();
});
