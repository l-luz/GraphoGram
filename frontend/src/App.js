import React from "react";
// import Modal from "./components/Modal";
// import axios from "axios";
import './App.css';
import Navbar from './components/Navbar';
import {Container} from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './paginas/login';
import Diagrama from './paginas/diagrama';
import Config from './paginas/config';
import Biblioteca from './paginas/biblioteca/listaPasta';
import Turma from './paginas/turma/listaTurma';
import {Home} from './paginas/home';
import Logout from './paginas/logout';
import UnauthorizedPage from "./paginas/erros/401";


function App() {
  
  return (
    <Router>
      <Navbar />
      <br />
      <Container>
        <Routes>
          <Route index path='/' element={<Home />} />
          <Route exact path='/pastas' element={<Biblioteca />} />
          <Route path={'/pastas/:id'} element={<Biblioteca />} />
          <Route path='/config' element={<Config />} />
          <Route exact path='/diagrama' element={<Diagrama />} />
          <Route exact path='/turma' element={<Turma />} />
          <Route exact path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/erro401' element={<UnauthorizedPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;