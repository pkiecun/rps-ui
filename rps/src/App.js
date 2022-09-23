import { Home } from './Components/Home';
import './App.css';
import { SoloGame } from './Components/SoloGame';
import Multi from './Components/Multi';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Navbar} from './Components/Navbar';
import {Login} from './Components/Login';
import {Register} from './Components/Register';

function App() {
  return (
   
    <BrowserRouter>
     <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/solo" element={<SoloGame/>}/>
      <Route path="/multi" element={<Multi/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      {/* <Route path="/result/" element={<Result {...round}/>}/> */}
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
