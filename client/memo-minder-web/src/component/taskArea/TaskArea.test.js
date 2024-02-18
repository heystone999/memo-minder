import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TaskArea from './TaskArea';

describe('TaskArea Component', () => {
  // Mock functions for updateHealth, updateExperience, updateLevel
  const updateHealth = jest.fn();
  const updateExperience = jest.fn();
  const updateLevel = jest.fn();

  test('renders TaskArea component', () => {
    const { getByText, getByPlaceholderText } = render(
      <TaskArea
        updateHealth={updateHealth}
        updateExperience={updateExperience}
        updateLevel={updateLevel}
      />
    );

    // Check if "Habits" section is rendered
    expect(getByText('Habits')).toBeInTheDocument();

    // Check if "Dailies" section is rendered
    expect(getByText('Dailies')).toBeInTheDocument();

    // Check if "To Do Lists" section is rendered
    expect(getByText('To Do Lists')).toBeInTheDocument();

    // Check if "Rewards" section is rendered
    expect(getByText('Rewards')).toBeInTheDocument();

    // Check if habit input field is rendered
    expect(getByPlaceholderText('Add a habit')).toBeInTheDocument();

    // Check if daily input field is rendered
    expect(getByPlaceholderText('Add a daily')).toBeInTheDocument();

    // Check if to-do input field is rendered
    expect(getByPlaceholderText('Add a To Do')).toBeInTheDocument();

    // Check if reward input field is rendered
    expect(getByPlaceholderText('Add a Reward')).toBeInTheDocument();
  });

  test('add a habit', () => {
    const { getByPlaceholderText, getByText } = render(
      <TaskArea
        updateHealth={updateHealth}
        updateExperience={updateExperience}
        updateLevel={updateLevel}
      />
    );

    const habitInput = getByPlaceholderText('Add a habit');
    // const addButton = getByText('+');

    fireEvent.change(habitInput, { target: { value: 'New Habit' } });
    fireEvent.keyDown(habitInput, { key: 'Enter', code: 'Enter' });

    // Check if the new habit is added
    expect(getByText('New Habit')).toBeInTheDocument();
  });

  // Write more tests for other functionalities as needed
});
