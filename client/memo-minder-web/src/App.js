import React, { useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import './App.css';
import Navbar from './component/navBar/NavBar';
import { Login } from "./pages/login/Login"
import { Register } from './pages/register/Register';
import Home from './pages/Home/Home';
import Profile from './pages/profile/Profile';
import Header from './component/header/Header'
import TaskArea from './component/taskArea/TaskArea'

function App() {

  const currentUser = true;

  const Layout = () => {
    return (
      <div>
        <Navbar/>
        <div style={{ display: "flex; flex-direction: column;"}}>
          <Header/>
          <TaskArea/>
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
    </div>
  );
}


export default App;