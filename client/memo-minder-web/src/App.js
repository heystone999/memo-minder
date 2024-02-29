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
import ShopArea from "./component/shopArea/ShopArea";
import ChallengeArea from './component/challengeArea/ChallengeArea';
import Popup from './component/popup/Popup';


// function to create default items for TaskArea
const createDefaultItem = (content, options = {}) => ({
  id: Date.now(),
  content,
  ...options,
});


function App() {
  /* 
  limitation to get access to home page 
  before login (change to false to apply)
  */
  const currentUser = true;

  /* Popup */
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', body: '', background_color: ''});
  const closePopup = () => {
    setShowPopup(false);
  };
  const showCustomPopup = (title, body, background_color) => {
    setPopupMessage({ title, body, background_color });
    setShowPopup(true);
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
    setHealth(prevHealth => {
      const newHealth = prevHealth - 10;
      if (newHealth <= 0) {
        showCustomPopup("Health Depleted", "Your health has depleted to zero. Try upgrading to restore full health.", "rgba(243, 97, 105, 0.7)");
        return 0; 
      }
      return newHealth;
    });
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
      showCustomPopup("Level Up", "Congratulations! You've leveled up!", "rgba(255, 204, 85, 0.7)");
    }
  };
  /* 
  coin  
  +1Q per task
  decrease corresponding coins 
  from purchasing items in shop
  */
  const initialCoin = parseInt(localStorage.getItem('coin')) || 0;
  const [coin, setCoin] = useState(initialCoin);
  const updateCoin = () => {
    setCoin(prevCoin => {
      const newCoin = prevCoin + 10;
      return newCoin;
    });
  };
  const decreaseCoin = (price) => {
    setCoin(prevCoin => {
      // let coin >= 0
      const newCoin = Math.max(0, prevCoin - price);
      localStorage.setItem('coin', newCoin); // update in localStorage
      return newCoin;
    });
  };


  useEffect(() => {
    // Save health & level to local storage whenever it changes
    localStorage.setItem('health', health.toString());
    localStorage.setItem('level', level.toString());
    localStorage.setItem('experience', experience.toString());
    localStorage.setItem('coin', coin.toString());
  }, [health, level, experience, coin]);

  // initialize with default tasks and  add a new habit, daily, to-do to the task lists
  const defaultHabit = createDefaultItem('Your default habit', { positive: true, negative: true });
  const defaultDaily = createDefaultItem('Your default daily', { completed: false });
  const defaultTodo = createDefaultItem('Your default to-do', { completed: false });

  const [habits, setHabits] = useState(() => JSON.parse(localStorage.getItem('habits')) || [defaultHabit]);
  const [dailies, setDailies] = useState(() => JSON.parse(localStorage.getItem('dailies')) || [defaultDaily]);
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('todos')) || [defaultTodo]);
  
  const addHabit = (habit) => {setHabits(prev => [...prev, habit])};
  const addDaily = (daily) => {setDailies(prev => [...prev, daily])};
  const addTodo = (todo) => {setTodos(prev => [...prev, todo]);};
  
  //update an existing habit, daily, to-do
  const createUpdater = (setter) => (updatedItem) => {
    setter((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === updatedItem.id) {
          return updatedItem;
        }
        return item;
      });
    });
  };
  const updateHabit = createUpdater(setHabits);
  const updateDaily = createUpdater(setDailies);
  const updateTodo = createUpdater(setTodos);

  // delete an existing habit, daily, to-do
  const createDeleter = (setter) => (itemId) => {
    setter((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };
  const deleteHabit = createDeleter(setHabits);
  const deleteDaily = createDeleter(setDailies);
  const deleteTodo = createDeleter(setTodos);

  useEffect(() => {
    // save habits, dailies, todos to local storage whenever it changes
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('dailies', JSON.stringify(dailies));
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [habits, dailies, todos]); 

  const clearStorageAndResetStates = () => {
    // clear all localStorage
    localStorage.clear();
    // update to default state
    setHabits([defaultHabit]); 
    setDailies([defaultDaily]); 
    setTodos([defaultTodo]);
    setHealth(100);
    setExperience(0);
    setCoin(0);
    setLevel(1);
    
  };
  
  /*-Transfer for different Areas start-*/
  const [showTaskArea, setShowTaskArea] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const handleTaskClick = () => {
    setShowTaskArea(true);
    setShowShop(false);
  };
  const handleShopClick = () => {
    setShowTaskArea(false);
    setShowShop(true);
  };
  const handleChallengeClick = () => {
    setShowTaskArea(false);
    setShowShop(false);
    setShowChallenge(true);
  };
  /*-Transfer for different Areas end-*/

  const Layout = ({ showTaskArea, showShop, showChallenge, handleTaskClick, handleShopClick, handleChallengeClick }) => {
    
    return (
        <div>
            {/* Pass handleTaskClick and handleShopClick as props to Navbar component */}
            <Navbar
                handleTaskClick={handleTaskClick}
                handleShopClick={handleShopClick}
                handleChallengeClick={handleChallengeClick}
                coin={coin}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
                {/* pass health props to Header and TaskArea */}
                <Header health={health} experience={experience} level={level}/>
                <Popup show={showPopup} onClose={closePopup} message={popupMessage} />

                {/* TaskArea and ShopArea outside Navbar */}
                <div>
                  {showTaskArea ? (
                      <TaskArea
                          updateHealth={updateHealth}
                          updateLevel={updateLevel}
                          updateCoin={updateCoin}
                          habits={habits}
                          dailies={dailies}
                          todos={todos}
                          onAddHabit={addHabit}
                          onUpdateHabit={updateHabit}
                          onDeleteHabit={deleteHabit}
                          onAddDaily={addDaily}
                          onUpdateDaily={updateDaily}
                          onDeleteDaily={deleteDaily}
                          onAddTodo={addTodo}
                          onUpdateTodo={updateTodo}
                          onDeleteTodo={deleteTodo}
                          onClear={clearStorageAndResetStates}
                      />
                  ) : showShop ? (
                      <ShopArea coin={coin} updateCoin={updateCoin} decreaseCoin={decreaseCoin}/>
                  ) : (
                      <ChallengeArea />
                  )}
              </div>

            </div>
        </div>
    );
};



  

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
      element: 
        <ProtectedRoute>
        <Layout
            showTaskArea={showTaskArea}
            showShop={showShop}
            showChallenge={showChallenge}
            handleTaskClick={handleTaskClick}
            handleShopClick={handleShopClick}
            handleChallengeClick={handleChallengeClick}
        />
        </ProtectedRoute>,
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
      <Popup show={showPopup} onClose={closePopup} message={popupMessage} />
    </div>
  );
}


export default App;