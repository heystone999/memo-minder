import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TaskButton from './TaskButton';

describe('TaskButton component', () => {
  test('renders Add Task button', () => {
    const { getByText } = render(<TaskButton />);
    const addTaskButton = getByText('Add Task');
    expect(addTaskButton).toBeInTheDocument();
  });

  test('clicking Add Task button toggles menu visibility', () => {
    const { getByText, queryByText } = render(<TaskButton />);
    const addTaskButton = getByText('Add Task');

    // Initially, menu is not visible
    expect(queryByText('Habit')).not.toBeInTheDocument();

    // Click the button to show the menu
    fireEvent.click(addTaskButton);

    // Now, menu should be visible
    expect(queryByText('Habit')).toBeInTheDocument();

    // Click the button again to hide the menu
    fireEvent.click(addTaskButton);

    // Now, menu should not be visible again
    expect(queryByText('Habit')).not.toBeInTheDocument();
  });

  test('clicking menu item opens dialog', () => {
    const { getByText, queryByText } = render(<TaskButton />);
    const addTaskButton = getByText('Add Task');

    // Click the button to show the menu
    fireEvent.click(addTaskButton);

    // Click on a menu item
    const habitMenuItem = getByText('Habit');
    fireEvent.click(habitMenuItem);

    // Now, dialog should be visible
    expect(queryByText('Create Habit')).toBeInTheDocument();
  });

  // Add more tests for other functionalities...
});
