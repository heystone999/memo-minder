import axios from 'axios';
import React, { useState, useEffect, useCallback} from 'react';
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
import MilestonesArea from './component/milestonesArea/MilestonesArea';
import {BASE_URL, STATUS_CODE, SERVER_API} from './utils/constants'

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
    showCustomPopup("Purchase Successfully", "You have purchased an item.", "rgba(8,186,255, 0.7)");
  };


  useEffect(() => {
    // Save health & level to local storage whenever it changes
    localStorage.setItem('health', health.toString());
    localStorage.setItem('level', level.toString());
    localStorage.setItem('experience', experience.toString());
    localStorage.setItem('coin', coin.toString());
  }, [health, level, experience, coin]);

  /* 
  TaskArea:
  Habit, Daily, To-do, reward
  */
  // initialize with default tasks and  add a new habit, daily, to-do, reward to the task lists
  //const defaultHabit = createDefaultItem('Your default habit', { positive: true, negative: true });
  const defaultDaily = createDefaultItem('Your default daily', { completed: false });
  const defaultTodo = createDefaultItem('Your default to-do', { completed: false });
  const defaultReward = createDefaultItem('Your default reward', { price: 10});

  //const [habits, setHabits] = useState(() => JSON.parse(localStorage.getItem('habits')) || [defaultHabit]);
  const [dailies, setDailies] = useState(() => JSON.parse(localStorage.getItem('dailies')) || [defaultDaily]);
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('todos')) || [defaultTodo]);
  const [rewards, setRewards] = useState(() => JSON.parse(localStorage.getItem('rewards')) || [defaultReward]); 
  
  const [habits, setHabits] = useState([]); 

  // TODO: 账号信息如何管理？全局变量？Context？props传 随用随取？
  // TODO: task数据从server获取后 增删改的回调函数逻辑是否回组件内部
  let validToken;
  
  const login = async(username, password) => {
    try {
      const response = await axios.post(BASE_URL + SERVER_API.LOGIN, {
        // TODO: delete the stub username/psw when login is integrated with backend
        'username': username ?? 'yue',
        'password': password ?? 'yue@memominder'
      });
      console.debug('login success:', response.status);
      return response?.data?.token;
    } catch (error) {
      return Promise.reject(error)
    }
  };

    // 暂时用yue实例的id和token来测试 fetchHabits, updateHabit, 和 deleteHabit 功能
    
    const yueUserId = '65f8ec123f2a091381b1e597'; // 从Postman获取的id
    // inside component
    const fetchHabits = useCallback(async () => {
      try {
        const fetchHabitsUrl = `${BASE_URL}${SERVER_API.FETCH_HABIT.replace(':userId', yueUserId)}`;
        if (!validToken) {
          validToken = await login();   
        }
        const response = await axios.get(fetchHabitsUrl, {
          headers: {
            'Authorization': validToken,
          },
        });
  
        console.log('Fetched habits:', response.data);
        console.log('Habits in response:', response.data.habits);
        // Assuming the habits are in response.data.habits
        if (response.data && Array.isArray(response.data.habits)) {
          setHabits(response.data.habits);
          console.log('Habits state after update:', habits);
        } else {
          console.error('Data fetched is not in the expected format:', response.data);
        }
  
      } catch (error) {
        console.error('Failed to fetch habits:', error);
      }
    },[validToken]);
  
    useEffect(() => {
      fetchHabits();
    }, [fetchHabits]);

  let retryCount = 0;
  const addHabitToServer = async (habit) => {
    try {
      console.debug('addHabitToServer:', habit);
      //if (!habit?.content || !habit?.notes) {
      if (!habit?.content) {
        console.warn('invalid habit, no need to post');
        return;
      }
      if (!validToken) {
        validToken = await login();   
      }
      const response = await axios.post(BASE_URL + SERVER_API.ADD_HABIT, {
        'title': habit.content,
        'type': habit.positive && habit.negative ? 'both' : !habit.positive && !habit.negative ? 'neutral' : habit.positive ? 'positive' : 'negative',
        'note': habit.notes
      }, {
        headers: {
          'Authorization': validToken,
          'Content-Type': 'application/json'
        }
      });
      console.debug('post new habit success:', response.status);
    } catch (error) {
      if (error.response.status === STATUS_CODE.UNAUTHORIZED && retryCount < 1) {
        validToken = null;
        retryCount++;
        addHabitToServer(habit);
      } else {
        retryCount = 0;
      }
      console.warn('post new habit error:', error);
    }
  };
  const addHabit = (habit) => {
    setHabits(prev => [...prev, habit])
    addHabitToServer(habit);
    fetchHabits();
  };

  const addDaily = (daily) => {setDailies(prev => [...prev, daily])};
  const addTodo = (todo) => {setTodos(prev => [...prev, todo]);};
  const addReward = (reward) => {setRewards(prev => [...prev, reward]);};

  //update habit
  const updateHabitToServer = async (habitId, updatedHabit) => {
    try {
      console.debug('updateHabitToServer:', updatedHabit);
      if (!validToken) {
        validToken = await login();
      }
      console.log('habit to be updated-old:',habitId)
      console.log('habit to be updated-new:',updatedHabit)
      const updateHabitsUrl = `${BASE_URL}${SERVER_API.MODIFY_HABIT.replace(':habitId', habitId)}`;
      const response = await axios.put(updateHabitsUrl , {
        'title': updatedHabit.content,
        'type': updatedHabit.positive && updatedHabit.negative ? 'both' : !updatedHabit.positive && !updatedHabit.negative ? 'neutral' : updatedHabit.positive ? 'positive' : 'negative',
        'note': updatedHabit.notes
      }, {
        headers: {
          'Authorization': validToken,
          'Content-Type': 'application/json'
        }
      });
      console.debug('update habit success:', response.status);
    } catch (error) {
      if (error.response && error.response.status === STATUS_CODE.UNAUTHORIZED && retryCount < 1) {
        validToken = null;
        retryCount++;
        updateHabitToServer(habitId, updatedHabit); // Retry the update after re-login
      } else {
        retryCount = 0;
        console.error('update habit error:', error);
      }
    }
  };

  const updateHabit = async (habitId, updatedHabit) => {
    await updateHabitToServer(habitId, updatedHabit);
    fetchHabits(); 
  };

  
  //delete habit
  const deleteHabitFromServer = async (habitId) => {
    try {
      console.debug('deleteHabitFromServer:', habitId);
      if (!validToken) {
        validToken = await login();
      }
      console.log('Habit to be delete:', habitId);
      const deleteHabitsUrl = `${BASE_URL}${SERVER_API.DELETE_HABIT.replace(':habitId', habitId)}`;
      const response = await axios.delete(deleteHabitsUrl, {
        headers: {
          'Authorization': validToken
        }
      });
      console.debug('delete habit success:', response.status);
    } catch (error) {
      if (error.response && error.response.status === STATUS_CODE.UNAUTHORIZED && retryCount < 1) {
        validToken = null;
        retryCount++;
        deleteHabitFromServer(habitId); // Retry the delete after re-login
      } else {
        retryCount = 0;
        console.error('delete habit error:', error);
      }
    }
  };
  const deleteHabit = async (habitId) => {
    await deleteHabitFromServer(habitId);
    fetchHabits();
  };

  //update an existing habit, daily, to-do, reward
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
  const updateDaily = createUpdater(setDailies);
  const updateTodo = createUpdater(setTodos);
  const updateReward = createUpdater(setRewards);

  // delete an existing habit, daily, to-do, reward
  const createDeleter = (setter) => (itemId) => {
    setter((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };
  const deleteDaily = createDeleter(setDailies);
  const deleteTodo = createDeleter(setTodos);
  const deleteReward = createDeleter(setRewards);

  useEffect(() => {
    // save habits, dailies, todos, rewards to local storage whenever it changes
    //localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('dailies', JSON.stringify(dailies));
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('rewards', JSON.stringify(rewards));
  }, [dailies, todos, rewards]); 

  const clearStorageAndResetStates = () => {
    // clear all localStorage
    localStorage.clear();
    // update to default state
    // setHabits(habits); 
    setDailies([defaultDaily]); 
    setTodos([defaultTodo]);
    setRewards([defaultReward]);
    setHealth(100);
    setExperience(0);
    setCoin(0);
    setLevel(1);
    
  };
  
  /*-Transfer for different Areas start-*/
  const [showTaskArea, setShowTaskArea] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);
  const handleTaskClick = () => {
    setShowTaskArea(true);
    setShowShop(false);
    setShowMilestones(false);
  };
  const handleShopClick = () => {
    setShowTaskArea(false);
    setShowShop(true);
    setShowMilestones(false);
  };
  const handleChallengeClick = () => {
    setShowTaskArea(false);
    setShowShop(false);
    setShowChallenge(true);
    setShowMilestones(false);
  };
  const handleMilestonesClick = () => {
    setShowTaskArea(false);
    setShowShop(false);
    setShowChallenge(false);
    setShowMilestones(true);
  };
  /*-Transfer for different Areas end-*/

  const Layout = ({ showTaskArea, showShop, showChallenge, showMilestones, handleTaskClick, handleShopClick, handleChallengeClick, handleMilestonesClick }) => {
    
    return (
        <div>
            {/* Pass handleTaskClick and handleShopClick as props to Navbar component */}
            <Navbar
                handleTaskClick={handleTaskClick}
                handleShopClick={handleShopClick}
                handleChallengeClick={handleChallengeClick}
                handleMilestonesClick={handleMilestonesClick}
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
                          coin={coin}
                          updateCoin={updateCoin}
                          decreaseCoin={decreaseCoin}
                          habits={habits}
                          dailies={dailies}
                          todos={todos}
                          rewards = {rewards}
                          onAddHabit={addHabit}
                          onUpdateHabit={updateHabit}
                          onDeleteHabit={deleteHabit}
                          onAddDaily={addDaily}
                          onUpdateDaily={updateDaily}
                          onDeleteDaily={deleteDaily}
                          onAddTodo={addTodo}
                          onUpdateTodo={updateTodo}
                          onDeleteTodo={deleteTodo}
                          onAddReward = {addReward}
                          onUpdateReward = {updateReward}
                          onDeleteReward = {deleteReward}
                          onClear={clearStorageAndResetStates}
                      />
                  ) : showShop ? (
                      <ShopArea coin={coin} updateCoin={updateCoin} decreaseCoin={decreaseCoin}/>
                  ) : showChallenge ? (
                      <ChallengeArea />
                  ) : <MilestonesArea/>
                }
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
            showMilestones={showMilestones}
            handleTaskClick={handleTaskClick}
            handleShopClick={handleShopClick}
            handleChallengeClick={handleChallengeClick}
            handleMilestonesClick={handleMilestonesClick}
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