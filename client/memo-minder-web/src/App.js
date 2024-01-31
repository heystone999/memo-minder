import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './component/NavBar';
import { Login } from "./Login"
import { Register } from './Register';

function App() {
  const [currentForm, setCurrentForm] = useState('Login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  return (
    <><Navbar /><div className="App">
      {currentForm == 'login' ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm} />}
    </div></>
  );
}

export default App;
