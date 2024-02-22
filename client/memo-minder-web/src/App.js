import React, { useState, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import './App.css';
import Navbar from './component/navBar/NavBar';
import { Login } from "./pages/login/Login"
import { Register } from './pages/register/Register';
import Home from './pages/Home/Home';
import Header from './component/header/Header'
import TaskArea from './component/taskArea/TaskArea'
import LevelUpPopup from './component/levelUpPopup/LevelUpPopup';

function App() {

  /* 
  limitation to get access to home page 
  before login (change to false to apply)
  */
  const currentUser = true;
  /* update level popup*/
  const [showLevelUpPopup, setShowLevelUpPopup] = useState(false);
  const closeLevelUpPopup = () => {
    setShowLevelUpPopup(false);
  };
  /* 
  health bar 
  Get initial health from local storage,
  default to 100 if not found
  -10 per update
  */
  const initialHealth = parseInt(localStorage.getItem('health')) || 100;
  const [health, setHealth] = useState(initialHealth);
  const updateHealth = () => {
    setHealth(prevHealth => prevHealth - 10);
  };
  /* 
  level bar 
  Get initial level from local storage,
  default to 0 if not found
  +1Q per update
  */
  const initialLevel = parseInt(localStorage.getItem('level')) || 1;
  const [level, setLevel] = useState(initialLevel);
  const initialExperience = parseInt(localStorage.getItem('experience')) || 0;
  const [experience, setExperience] = useState(initialExperience);
  const updateLevel = () => {
    const newExperience = experience + 20;
    setExperience(newExperience);
    if (newExperience >= 100) {
      setLevel(prevLevel => prevLevel + Math.floor(newExperience / 100));
      setExperience(0);
      setHealth(100);
      setShowLevelUpPopup(true);
    }
  };

  useEffect(() => {
    // Save health & level to local storage whenever it changes
    localStorage.setItem('health', health.toString());
    localStorage.setItem('level', level.toString());
    localStorage.setItem('experience', experience.toString());
  }, [health, level, experience]);


  const Layout = () => {
    return (
      <div>
        <Navbar/>
        <div style={{ display: "flex; flex-direction: column;"}}>
          {/* pass health props to Header and TaskArea */}
          <Header health={health} experience={experience} level={level}/>
          <TaskArea updateHealth={updateHealth} updateLevel={updateLevel} />
        </div>
      </div>
    )
  }

  /* -- prevent to access home page before login start -- */
  /* -- 要用的时候把上面那个currentUser改成false就ok -- */
  const ProtectedRoute = ({children}) =>{
    if(!currentUser){
      return <Navigate to="/login"/>
    }
    return children
  }
  /* -- prevent to access home page before login end -- */

  /* -- page transfer start -- */
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><Layout/></ProtectedRoute>,
      children:[
        {
          path: "/",
          element: <Home/>
        },
        {
          path: "/profile/:id",
          element: <Home/>
        }
      ]
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/register",
      element: <Register/>
    },
  ]);
  /* -- page transfer end -- */

  return (
    <div>
      <RouterProvider router={router} />
      <LevelUpPopup show={showLevelUpPopup} onClose={closeLevelUpPopup} />
    </div>
  );
}


export default App;