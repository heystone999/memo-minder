// TaskAreaDialog.jsx

import React, { useState, useEffect } from 'react';
import './TaskAreaDialog.css'; 

const TaskAreaDialog = ({ item, type, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState(item.title || '');
  const [notes, setNotes] = useState(item.note || '');
  const [positive, setPositive] = useState(item.positive);
  const [negative, setNegative] = useState(item.negative);
  const [completed, setCompleted] = useState(item.completed);
  const [price, setPrice] = useState(item.price);

  const togglePositive = () => {
    setPositive(!positive);
  };

  const toggleNegative = () => {
      setNegative(!negative);
  };


  useEffect(() => {
    // when item change the state will be updated
    setTitle(item.title || '');
    setNotes(item.note || '');
    setPrice(item.price);
  }, [item]);

  const handleSave = () => {
    const updatedItem = {
      ...item,
      habitId: item._id,
      content: title,
      notes,
    };

    if (type === 'Habit') {
      updatedItem.positive = positive;
      updatedItem.negative = negative;
    } 
    else if ((type === 'Daily') || (type === 'To-Do')) {
      updatedItem.completed = completed;
    }
    else if (type === 'Reward'){
      updatedItem.price = price;
    }
    onSave(updatedItem);
  };

  const handleDelete = () => {
    const deletedItem = {
      ...item,
      habitId: item._id,
    };
    onDelete(deletedItem);
    console.log('Dialog - Habit to be delete:', deletedItem);
    console.log('Dialog - HabitId to be delete:', deletedItem._id);
  };

  return (
    <div className="dialogBackdrop">
      <div className="dialog">
        <h2>{`Edit ${type}`}</h2>
        <label>
          Title*:
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Notes:
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        {(type === 'Reward') && (
            <div className="dialogHeaderNotes">
              <label>
                Price*:
                <input value={price} onChange={(e) => setPrice(e.target.value)} />
              </label>
            </div>
          )}
        
        <div className="dialogButtons">
          <button onClick={handleDelete}>{`Delete this ${type}`}</button>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
        <div className="dialogHeaderButtonsWrapper">
          {type === 'Habit' && (
            <div className="dialogHeaderButtons">
              <button className={`pos ${positive ? 'active' : 'inactive'}`} onClick={togglePositive}>
                Positive
              </button>
              <button className={`neg ${negative ? 'active' : 'inactive'}`} onClick={toggleNegative}>
                Negative
              </button>
            </div>
          )}
          {((type === 'Daily') || (type === 'To-Do')) && (
            <div className="dialogHeaderButtons">
              <button className={`comp ${completed ? 'inactive' : 'active'}`} onClick={() => setCompleted(!completed)}>
                {completed ? 'Mark as Incomplete' : 'Mark as Completed'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskAreaDialog;
