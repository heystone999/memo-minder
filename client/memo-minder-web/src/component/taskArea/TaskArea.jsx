// TaskArea.jsx
import './TaskArea.css';
import TaskButton from '../taskButton/TaskButton';
import React, { useState} from 'react';
import TaskAreaDialog from './TaskAreaDialog';


const TaskArea = () => {
    const defaultHabit = {
        id: Date.now(),
        content: 'Your default habit',
        positive: true,
        negative: true
    };

    const defaultDaily = {
        id: Date.now(),
        content: 'Your default daily',
        completed: false
    };

    const defaultTodo = {
        id: Date.now(),
        content: 'Your default to-do',
        completed: false
    };

    const defaultReward = {
        id: Date.now(),
        content: 'Your default reward'
    };

    const [habitInput, setHabitInput] = useState('');
    const [habits, setHabits] = useState([defaultHabit]);

    const [dailyInput, setDailyInput] = useState('');
    const [dailies, setDailies] = useState([defaultDaily]);

    const [todoInput, setTodoInput] = useState('');
    const [todos, setTodos] = useState([defaultTodo]);

    const [rewardInput, setRewardInput] = useState('');
    const [rewards, setRewards] = useState([defaultReward]);

    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editingType, setEditingType] = useState('');

    const [messages, setMessages] = useState([]);

    const addMessage = (text, type) => {
        const newMessage = { id: Date.now(), text, type };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setTimeout(() => {
            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== newMessage.id));
        }, 5000);
    };
    const handlePositiveClick = (habitId) => {
        // add logic to increase gold and experience
        addMessage("You get some Gold and Experience", 'positive');
    };
    
    const handleNegativeClick = (habitId) => {
        // add logic to decrease health
        addMessage("You lose some Health", 'negative');
    };
    const handleItemClick = (item, type) => {
        setEditingItem(item);
        setEditingType(type);
        setEditDialogVisible(true);
    };

    // save items
    const handleSaveItem = (updatedItem) => {
        switch (editingType) {
        case 'Habit':
            setHabits(habits.map(h => {
                if (h.id === updatedItem.id) {
                    return {
                        ...h,
                        content: updatedItem.content,
                        notes: updatedItem.notes,
                        positive: updatedItem.positive,
                        negative: updatedItem.negative,
                    };
                }
                return h;
            }));
            break;
            case 'Daily':
                setDailies(dailies.map(d => d.id === updatedItem.id ? updatedItem : d));
                break;
            case 'To-Do':
                setTodos(todos.map(t => t.id === updatedItem.id ? updatedItem : t));
                break;
            case 'Reward':
                setRewards(rewards.map(r => r.id === updatedItem.id ? updatedItem : r));
                break;
            default:
                // Handle unknown type if necessary
                break;
        }
        setEditDialogVisible(false);
    };

    // delete items
    const handleDeleteItem = (itemToDelete) => {
        switch (editingType) {
            case 'Habit':
                setHabits(habits.filter(h => h.id !== itemToDelete.id));
                break;
            case 'Daily':
                setDailies(dailies.filter(d => d.id !== itemToDelete.id));
                break;
            case 'To-Do':
                setTodos(todos.filter(t => t.id !== itemToDelete.id));
                break;
            case 'Reward':
                setRewards(rewards.filter(r => r.id !== itemToDelete.id));
                break;
            default:
                // Handle unknown type if necessary
                break;
        }
        setEditDialogVisible(false);
    };

    // Enter to add a habit
    const handleHabitKeyPress = (e) => {
        if (e.key === 'Enter' && habitInput.trim() !== '') {
            const newHabit = {
                id: Date.now(), 
                content: habitInput.trim(),
                positive: true,
                negative: true
            };
            setHabits([...habits, newHabit]);
            setHabitInput('');
        }
    }; 
    // Enter to add a daily
    const handleDailyKeyPress = (e) => {
        if (e.key === 'Enter' && dailyInput.trim() !== '') {
            const newDaily = {
                id: Date.now(),
                content: dailyInput.trim(),
                completed: false  // New daily tasks are not completed
            };
            setDailies([...dailies, newDaily]);
            setDailyInput('');
        }
    };
    // Enter to add a to-do
    const handleTodoKeyPress = (e) => {
        if (e.key === 'Enter' && todoInput.trim() !== '') {
            const newTodo = {
                id: Date.now(),
                content: todoInput.trim(),
                completed: false  // New to do tasks are not completed
            };
            setTodos([...todos, newTodo]);
            setTodoInput('');
        }
    };
    // Enter to add a reward
    const handleRewardKeyPress = (e) => {
        if (e.key === 'Enter' && rewardInput.trim() !== '') {
            const newReward = {
                id: Date.now(),
                content: rewardInput.trim()
            };
            setRewards([...rewards, newReward]);
            setRewardInput('');
        }
    };
    
    //handle marking a daily as due or completed
    const markDailyAsCompleted = (id) => {
        setDailies(dailies.map(daily => {
            if (daily.id === id) {
                return { ...daily, completed: true };
            }
            return daily;
        }));
    };
    const markDailyAsIncomplete = (id) => {
        setDailies(dailies.map(daily => {
            if (daily.id === id) {
                return { ...daily, completed: false };
            }
            return daily;
        }));
    };
    // handle marking a to-do as scheduled or completed
    const markTodoAsCompleted = (id) => {
        setTodos(todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: true };
            }
            return todo;
        }));
    };
    const markTodoAsIncomplete = (id) => {
        setTodos(todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: false };
            }
            return todo;
        }));
    };
    const [selectedDailyTab, setSelectedDailyTab] = useState('All');
    // keep track of the selected tab
    const getFilteredDailies = () => {
        switch (selectedDailyTab) {
            case 'All':
                return dailies;
            case 'Due':
                return dailies.filter(daily => !daily.completed);
            case 'Completed':
                return dailies.filter(daily => daily.completed);
            default:
                return dailies;
        }
    };
    // to-do
    const [selectedTodoTab, setSelectedTodoTab] = useState('All');

    const filteredTodos = todos.filter(todo => {
        if (selectedTodoTab === 'Scheduled') return !todo.completed;
        if (selectedTodoTab === 'Completed') return todo.completed;
        return true; 
    });
    const handleTodoTabClick = (tab) => {
        setSelectedTodoTab(tab);
    };



    // use TaskAreaDialog components
    return (
        <div className="taskAreaContainer">
            <div className="messageContainer" style={{position: 'fixed', top: '20px', right: '20px', zIndex: 1000}}>
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.type}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <TaskButton />
            <div className="taskAreaSections">
                {/* Habits Section */}
                <div className="taskAreaSection">
                    <h2>Habits</h2>
                    <div className="taskAreaNav">
                        <button>All</button>
                        <button>Weak Habits</button>
                        <button>Strong Habits</button>
                    </div>
                    <div className="contentContainer">
                        <div className="habitInputContainer">
                            <input 
                                type="text" 
                                placeholder="Add a habit"
                                value = {habitInput} 
                                onChange={(e) => setHabitInput(e.target.value)}
                                onKeyDown={handleHabitKeyPress}
                                className="habitInput"
                            />
                        </div>
                        {/* Habit List */}
                        <div className="taskList">
                            {/* Individual Habit Item */}
                            {habits.map(habit => (
                                <div className="habitItem" key={habit.id}>
                                    {habit.positive && <button onClick={() => handlePositiveClick(habit.id)}>+</button>}
                                    <p onClick={() => handleItemClick(habit, 'Habit')}>{habit.content}</p>
                                    {habit.negative && <button onClick={() => handleNegativeClick(habit.id)}>-</button>}
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
                            {getFilteredDailies().map(daily => (
                                <div className={`dailyItem ${daily.completed ? 'completed' : ''}`} key={daily.id}>
                                    {/* “+” mark completed dail */}
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
                        <button onClick={() => handleTodoTabClick('All')}>All</button>
                        <button onClick={() => handleTodoTabClick('Scheduled')}>Scheduled</button>
                        <button onClick={() => handleTodoTabClick('Completed')}>Completed</button>
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
                <div className="taskAreaSection">
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
                        {/* Reward List */}
                        <div className="taskList">
                            {/* Individual Reward Item */}
                            {rewards.map(reward => (
                                <div className="rewardItem" key={reward.id} onClick={() => handleItemClick(reward, 'Reward')}>
                                    <button>+</button>
                                    <p>{reward.content}</p>
                                </div>
                            ))}
                            {/* Add more Reward items here */}
                        </div>
                    </div>
                </div>
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
