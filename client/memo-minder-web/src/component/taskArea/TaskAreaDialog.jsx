// TaskAreaDialog.jsx

import React, { useState, useEffect } from 'react';
import './TaskAreaDialog.css'; 

const TaskAreaDialog = ({ item, type, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState(item.content || '');
  const [notes, setNotes] = useState(item.notes || '');
  const [positive, setPositive] = useState(item.positive);
  const [negative, setNegative] = useState(item.negative);
  const [completed, setCompleted] = useState(item.completed);

  const togglePositive = () => {
    setPositive(!positive);
  };

  const toggleNegative = () => {
      setNegative(!negative);
  };


  useEffect(() => {
    // when item change the state will be updated
    setTitle(item.content || '');
    setNotes(item.notes || '');
  }, [item]);

  const handleSave = () => {
    const updatedItem = {
      ...item,
      content: title,
      notes,
    };

    if (type === 'Habit') {
      updatedItem.positive = positive;
      updatedItem.negative = negative;
    } else {
      updatedItem.completed = completed;
    }
    onSave(updatedItem);
  };

  const handleDelete = () => {
    onDelete(item);
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
        <div className="dialogButtons">
          <button onClick={handleDelete}>{`Delete this ${type}`}</button>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
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
          {type !== 'Habit' && (
            <div className="dialogHeaderButtons">
              <button className={`comp ${completed ? 'inactive' : 'active'}`} onClick={() => setCompleted(!completed)}>
                {completed ? 'Mark as Incomplete' : 'Mark as Completed'}
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default TaskAreaDialog;
