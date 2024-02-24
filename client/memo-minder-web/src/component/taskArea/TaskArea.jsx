// TaskArea.jsx
import './TaskArea.css';
import TaskButton from '../taskButton/TaskButton';
import React, { useState} from 'react';
import TaskAreaDialog from './TaskAreaDialog';


const TaskArea = ({ 
    updateHealth, updateLevel,
    habits, dailies, todos,
    onAddHabit, onUpdateHabit, onDeleteHabit,
    onAddDaily, onUpdateDaily, onDeleteDaily,
    onAddTodo, onUpdateTodo, onDeleteTodo,
    onClear,

}) => {


    // handle with the inputs
    const [habitInput, setHabitInput] = useState('');
    const [dailyInput, setDailyInput] = useState('');
    const [todoInput, setTodoInput] = useState('');

    // Enter to add a habit, daily, to-do
    const handleItemKeyPress = (input, setInput, addItem, itemOptions) => (event) => {
        if (event.key === 'Enter') {
            const trimmedInput = input.trim();
            if (trimmedInput) {
                const newItem = {
                    id: Date.now(),
                    content: trimmedInput,
                    ...itemOptions
                };
                addItem(newItem);
                setInput('');
            }
        }
    };

    const handleHabitKeyPress = handleItemKeyPress(habitInput, setHabitInput, onAddHabit, { positive: true, negative: true });
    const handleDailyKeyPress = handleItemKeyPress(dailyInput, setDailyInput, onAddDaily, { completed: false });
    const handleTodoKeyPress = handleItemKeyPress(todoInput, setTodoInput, onAddTodo, { completed: false });
   
    // handle habit button
    const handlePositiveClick = (habitId) => {
        console.log(`handlePositiveClick called with habitId: ${habitId}`);
        // add logic to increase gold and experience
        //addMessage("You get some Gold and Experience", 'positive');
        updateLevel(); 
        console.log('After updateLevel called');
    };

    const handleNegativeClick = (habitId) => {
        console.log(`handleNegativeClick called with habitId: ${habitId}`);
        // add logic to decrease health
        //addMessage("You lose some Health", 'negative');
        updateHealth(); 
        console.log('After updateHealth called');
    };

    // handle message indicating experience changes
    /*
    const [messages, setMessages] = useState([]);
    const addMessage = (text, type) => {
        const newMessage = { id: Date.now(), text, type };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setTimeout(() => {
            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== newMessage.id));
        }, 5000);
    };
    */

    // handle within dialog
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editingType, setEditingType] = useState('');

    const handleItemClick = (item, type) => {
        setEditingItem(item);
        setEditingType(type);
        setEditDialogVisible(true);
    };

    // save items in dialog
    const handleSaveItem = (updatedItem) => {
        switch (editingType) {
            case 'Habit':
                onUpdateHabit(updatedItem);
                break;
            case 'Daily':
                onUpdateDaily(updatedItem);
                break;
            case 'To-Do':
                onUpdateTodo(updatedItem);
                break;
            default:
                // Handle unknown type if necessary
                break;
        }
        setEditDialogVisible(false);
    };

    // delete items in dialog
    const handleDeleteItem = (itemToDelete) => {
        switch (editingType) {
            case 'Habit':
                onDeleteHabit(itemToDelete.id);
                break;
            case 'Daily':
                onDeleteDaily(itemToDelete.id);
                break;
            case 'To-Do':
                onDeleteTodo(itemToDelete.id);
                break;
            default:
                // Handle unknown type if necessary
                break;
        }
        setEditDialogVisible(false);
    };

    const toggleItemCompletion = (items, updateItem) => (id, completed) => {
        // Find the item to update
        const itemToUpdate = items.find(item => item.id === id);
        // If found, update that item's completed status
        if (itemToUpdate) {
            updateItem({ ...itemToUpdate, completed });
        }
    };
    const toggleDailyCompletion = toggleItemCompletion(dailies, onUpdateDaily);
    const toggleTodoCompletion = toggleItemCompletion(todos, onUpdateTodo);
    //handle marking a daily as due or completed
    const markDailyAsCompleted = (dailyId) => {
        toggleDailyCompletion(dailyId, true);
        updateLevel();
    };
    const markDailyAsIncomplete = (dailyId) => {
        toggleDailyCompletion(dailyId, false);
    };
    // handle marking a to-do as scheduled or completed
    const markTodoAsCompleted = (todoId) => {
        toggleTodoCompletion(todoId, true);
        updateLevel();
    };
    const markTodoAsIncomplete = (todoId) => {
        toggleTodoCompletion(todoId, false);
    };

    const [selectedHabitTab, setSelectedHabitTab] = useState('All');
    const [selectedDailyTab, setSelectedDailyTab] = useState('All');
    const [selectedTodoTab, setSelectedTodoTab] = useState('All');
    // Generic function to filter items based on tab selection
    const filterItemsByTab = (items, selectedTab, tabMap) => {
        switch (selectedTab) {
            case tabMap.feature1:
                return items.filter(item => tabMap.condition1(item));
            case tabMap.feature2:
                return items.filter(item => tabMap.condition2(item));
            case 'All':
            default:
                return items;
        }
    };
    const habitTabMap = {
        feature1: 'Good Habits',
        feature2: 'Bad Habits',
        condition1: (item) => item.positive && !item.negative,
        condition2: (item) => !item.positive && item.negative
      };
      
      const dailyTabMap = {
        feature1: 'Due',
        feature2: 'Completed',
        condition1: (item) => !item.completed,
        condition2: (item) => item.completed
      };
      
      const todoTabMap = {
        feature1: 'Scheduled',
        feature2: 'Completed',
        condition1: (item) => !item.completed,
        condition2: (item) => item.completed
      };

    //  // keep track of the selected tab
    const filteredHabits = filterItemsByTab(habits, selectedHabitTab, habitTabMap);
    const filteredDailies = filterItemsByTab(dailies, selectedDailyTab, dailyTabMap);
    const filteredTodos = filterItemsByTab(todos, selectedTodoTab, todoTabMap);

    return (
        <div className="taskAreaContainer">
            {/*
            <div className="messageContainer" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.type}`}>
                        {msg.text}
                    </div>
                ))}
            </div> */}
            <div className="clearButtonContainer">
                <button onClick={onClear} className="clearButton">Clear and Reset</button>
            </div>
            <TaskButton 
                onAddHabit={onAddHabit}
                onAddDaily={onAddDaily}
                onAddTodo={onAddTodo}
            />
            <div className="taskAreaSections">
                {/* Habits Section */}
                <div className="taskAreaSection">
                    <h2>Habits</h2>
                    {/* First version: Weak/ Strong features change to Good/Bad habits*/}
                    <div className="taskAreaNav">
                        <button onClick={() => setSelectedHabitTab ("All")}>All</button>
                        <button onClick={() => setSelectedHabitTab ("Good Habits")}>Good Habits</button> 
                        <button onClick={() => setSelectedHabitTab ("Bad Habits")}>Bad Habits</button>
                    </div>
                    <div className="contentContainer">
                        <div className="habitInputContainer">
                            <input
                                type="text"
                                placeholder="Add a habit"
                                value={habitInput}
                                onChange={(e) => setHabitInput(e.target.value)}
                                onKeyDown={handleHabitKeyPress}
                                className="habitInput"
                            />
                        </div>
                        {/* Habit List */}
                        <div className="taskList">
                            {/* Individual Habit Item */}
                            {filteredHabits.map(habit => (
                                <div className="habitItem" key={habit.id}>
                                    {habit.positive && <button onClick={() => {
                                        handlePositiveClick(habit.id);
                                        
                                    }}>+</button>}
                                    <p onClick={() => handleItemClick(habit, 'Habit')}>{habit.content}</p>
                                    {habit.negative && <button onClick={() => {
                                        handleNegativeClick(habit.id);
                                        
                                    }}>-</button>}
                                </div>
                            ))}
                            {/* Add more habit items here */}
                        </div>
                    </div>
                </div>

                {/* Dailies Section */}
                <div className="taskAreaSection">
                    <h2>Dailies</h2>
                    <div className="taskAreaNav">
                        <button onClick={() => setSelectedDailyTab('All')}>All</button>
                        <button onClick={() => setSelectedDailyTab('Due')}>Due</button>
                        <button onClick={() => setSelectedDailyTab('Completed')}>Completed</button>
                    </div>
                    <div className="contentContainer">
                        <div className="dailyInputContainer">
                            <input
                                type="text"
                                placeholder="Add a daily"
                                value={dailyInput}
                                onChange={(e) => setDailyInput(e.target.value)}
                                onKeyDown={handleDailyKeyPress}
                                className="dailyInput"
                            />
                        </div>
                        {/* Daily List */}
                        <div className="taskList">
                            {filteredDailies.map(daily => (
                                <div className={`dailyItem ${daily.completed ? 'completed' : ''}`} key={daily.id}>
                                    <button onClick={(e) => {
                                        e.stopPropagation();  // prevent
                                        daily.completed ? markDailyAsIncomplete(daily.id) : markDailyAsCompleted(daily.id);
                                        

                                    }}>
                                        {daily.completed ? '-' : '+'}
                                    </button>
                                    {/* text edit */}
                                    <p onClick={() => handleItemClick(daily, 'Daily')}>{daily.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* To Do Lists Section */}
                <div className="taskAreaSection">
                    <h2>To Do Lists</h2>
                    <div className="taskAreaNav">
                        <button onClick={() => setSelectedTodoTab('All')}>All</button>
                        <button onClick={() => setSelectedTodoTab('Scheduled')}>Scheduled</button>
                        <button onClick={() => setSelectedTodoTab('Completed')}>Completed</button>
                    </div>
                    <div className="contentContainer">
                        <div className="todoInputContainer">
                            <input
                                type="text"
                                placeholder="Add a To Do"
                                value={todoInput}
                                onChange={(e) => setTodoInput(e.target.value)}
                                onKeyDown={handleTodoKeyPress}
                                className="todoInput"
                            />
                        </div>

                        {/* To Do List */}
                        <div className="taskList">
                            {filteredTodos.map(todo => (
                                <div className={`todoItem ${todo.completed ? 'completed' : ''}`} key={todo.id}>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        todo.completed ? markTodoAsIncomplete(todo.id) : markTodoAsCompleted(todo.id);
                                        
                                    }}>
                                        {todo.completed ? '-' : '+'}
                                        
                                    </button>
                                    <p onClick={() => handleItemClick(todo, 'To-Do')}>{todo.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Rewards Section */}
                {/*<div className="taskAreaSection">
                    <h2>Rewards</h2>
                    <div className="taskAreaNav">
                        <button>All</button>
                        <button>Custom</button>
                        <button>Wishlist</button>
                    </div>
                    <div className="contentContainer">
                        <div className="rewardInputContainer">
                            <input
                                type="text"
                                placeholder="Add a Reward"
                                value={rewardInput}
                                onChange={(e) => setRewardInput(e.target.value)}
                                onKeyDown={handleRewardKeyPress}
                                className="rewardInput"
                            />
                        </div>
                        <div className="taskList">
                            {rewards.map(reward => (
                                <div className="rewardItem" key={reward.id} onClick={() => handleItemClick(reward, 'Reward')}>
                                    <button>+</button>
                                    <p>{reward.content}</p>
                                </div>
                            ))}
                        </div>
                    </div> 
                </div> */}

            </div>
            {editDialogVisible && editingItem && (
                <TaskAreaDialog
                    item={editingItem}
                    type={editingType} //'Habit', 'Daily', 'To-do', 'Reward'
                    onClose={() => setEditDialogVisible(false)}
                    onSave={handleSaveItem}
                    onDelete={handleDeleteItem}
                />
            )}
        </div>
    );
}

export default TaskArea;
