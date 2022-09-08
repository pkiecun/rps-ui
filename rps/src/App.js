import { Home } from './Components/Home';
import './App.css';
import { SoloGame } from './Components/SoloGame';
import Messenger from './Components/Messenger';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Navbar} from './Components/Navbar';
import {Login} from './Components/Login';

function App() {
  return (
   
    <BrowserRouter>
     <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/solo" element={<SoloGame/>}/>
      <Route path="/multi" element={<Messenger/>}/>
      <Route path="/login" element={<Login/>}/>
      {/* <Route path="/result/" element={<Result {...round}/>}/> */}
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
