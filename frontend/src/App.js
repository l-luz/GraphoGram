import React, { Component } from "react";
import {jwtDecode} from "jwt-decode";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Certifique-se de que está importando Navigate aqui.
import { Container } from '@mui/material';
import Navbar from './components/Navbar';
import Login from './paginas/login';
import Diagrama from './paginas/diagrama';
import Biblioteca from './paginas/biblioteca/listaPasta';
import Turma from './paginas/turma/listaTurma';
import { Home } from './paginas/home';
import Logout from './paginas/logout';
import {UnauthorizedPage, NotFoundPage} from "./paginas/erros";

class App extends Component {
  isAuthenticated = () => {
    const accessToken = localStorage.getItem('access_token');
    return accessToken !== null && !this.isTokenExpired(accessToken);
  };

  isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      console.log("token");
      console.log(Date.now());
      console.log(decodedToken.exp * 1000);
      
      console.log(new Date(Date.now()));
      console.log(new Date(decodedToken.exp * 1000));
      return decodedToken.exp < Date.now() / 1000;
    } catch (err) {
      return true;
    }
  };

  render() {
    if (!this.isAuthenticated() && window.location.href !== 'http://localhost:3000/login') {
      window.location.href = '/login';
    }

    return (
      <Router>
        <Navbar />
        <br />
        <Container>
          <Routes>
            <Route index element={<Home />} />
            <Route path='/pastas/*' element={<Biblioteca />} />
            <Route path='/diagrama/*' element={<Diagrama />} />
            <Route path='/turma' element={<Turma />} />
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/erro401' element={<UnauthorizedPage />} />
            <Route path='/erro404' element={<NotFoundPage />} />
          </Routes>
        </Container>
      </Router>
    );
  }
}

export default App;
