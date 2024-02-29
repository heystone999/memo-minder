import { render, fireEvent, screen } from '@testing-library/react';
import TaskArea from './TaskArea';

test('renders without crashing', () => {
  render(
    <TaskArea
      updateHealth={() => { }}
      updateLevel={() => { }}
      updateCoin={() => { }}
      habits={[]}
      dailies={[]}
      todos={[]}
      onAddHabit={() => { }}
      onUpdateHabit={() => { }}
      onDeleteHabit={() => { }}
      onAddDaily={() => { }}
      onUpdateDaily={() => { }}
      onDeleteDaily={() => { }}
      onAddTodo={() => { }}
      onUpdateTodo={() => { }}
      onDeleteTodo={() => { }}
      onClear={() => { }}
    />
  );
});

test('adds a habit correctly', () => {
  const onAddHabitMock = jest.fn();
  render(
    <TaskArea
      updateHealth={() => { }}
      updateLevel={() => { }}
      updateCoin={() => { }}
      habits={[]}
      dailies={[]}
      todos={[]}
      onAddHabit={onAddHabitMock}
      onUpdateHabit={() => { }}
      onDeleteHabit={() => { }}
      onAddDaily={() => { }}
      onUpdateDaily={() => { }}
      onDeleteDaily={() => { }}
      onAddTodo={() => { }}
      onUpdateTodo={() => { }}
      onDeleteTodo={() => { }}
      onClear={() => { }}
    />
  );

  const habitInput = screen.getByPlaceholderText('Add a habit');
  fireEvent.change(habitInput, { target: { value: 'Drink water' } });
  fireEvent.keyDown(habitInput, { key: 'Enter', code: 'Enter' });

  expect(onAddHabitMock).toHaveBeenCalledWith(expect.objectContaining({
    content: 'Drink water',
    positive: expect.any(Boolean),
    negative: expect.any(Boolean)
  }));
});

test('updates a habit correctly', () => {
  const habits = [{ id: 1, content: 'Drink water', positive: true, negative: false }];
  const onUpdateHabitMock = jest.fn();
  render(
    <TaskArea
      updateHealth={() => { }}
      updateLevel={() => { }}
      updateCoin={() => { }}
      habits={habits}
      dailies={[]}
      todos={[]}
      onAddHabit={() => { }}
      onUpdateHabit={onUpdateHabitMock}
      onDeleteHabit={() => { }}
      onAddDaily={() => { }}
      onUpdateDaily={() => { }}
      onDeleteDaily={() => { }}
      onAddTodo={() => { }}
      onUpdateTodo={() => { }}
      onDeleteTodo={() => { }}
      onClear={() => { }}
    />
  );

  const habitItem = screen.getByText('Drink water');
  fireEvent.click(habitItem);

  expect(onUpdateHabitMock).not.toHaveBeenCalled();

  const habitInput = screen.getByDisplayValue('Drink water');
  fireEvent.change(habitInput, { target: { value: 'Drink water daily' } });

  const saveButton = screen.getByText('Save');
  fireEvent.click(saveButton);

  expect(onUpdateHabitMock).toHaveBeenCalledWith(expect.objectContaining({
    id: habits[0].id,
    content: 'Drink water daily',
    positive: true,
    negative: false
  }));
});

test('deletes a habit correctly', () => {
  const habits = [{ id: 1, content: 'Drink water', positive: true, negative: false }];
  const onDeleteHabitMock = jest.fn();
  render(
    <TaskArea
      updateHealth={() => { }}
      updateLevel={() => { }}
      updateCoin={() => { }}
      habits={habits}
      dailies={[]}
      todos={[]}
      onAddHabit={() => { }}
      onUpdateHabit={() => { }}
      onDeleteHabit={onDeleteHabitMock}
      onAddDaily={() => { }}
      onUpdateDaily={() => { }}
      onDeleteDaily={() => { }}
      onAddTodo={() => { }}
      onUpdateTodo={() => { }}
      onDeleteTodo={() => { }}
      onClear={() => { }}
    />
  );

  const habitItem = screen.getByText('Drink water');
  fireEvent.click(habitItem);

  const deleteButton = screen.getByText(`Delete this Habit`);
  fireEvent.click(deleteButton);

  expect(onDeleteHabitMock).toHaveBeenCalledWith(habits[0].id);
});

// health
test('updates health when positive habit is clicked', () => {
  const updateHealthMock = jest.fn();
  const updateLevelMock = jest.fn();
  const updateCoinMock = jest.fn();
  const habits = [{ id: 1, content: 'Exercise', positive: true, negative: false }];

  render(
    <TaskArea
      updateHealth={updateHealthMock}
      updateLevel={updateLevelMock}
      updateCoin={updateCoinMock}
      habits={habits}
      dailies={[]}
      todos={[]}
      onAddHabit={() => { }}
      onUpdateHabit={() => { }}
      onDeleteHabit={() => { }}
      onAddDaily={() => { }}
      onUpdateDaily={() => { }}
      onDeleteDaily={() => { }}
      onAddTodo={() => { }}
      onUpdateTodo={() => { }}
      onDeleteTodo={() => { }}
      onClear={() => { }}
    />
  );

  const positiveHabitButton = screen.getByText('+');
  fireEvent.click(positiveHabitButton);

  expect(updateLevelMock).toHaveBeenCalled();
});

test('updates health when negative habit is clicked', () => {
  const updateHealthMock = jest.fn();
  const updateLevelMock = jest.fn();
  const habits = [{ id: 1, content: 'Smoking', positive: false, negative: true }];

  render(
    <TaskArea
      updateHealth={updateHealthMock}
      updateLevel={updateLevelMock}
      habits={habits}
      dailies={[]}
      todos={[]}
      onAddHabit={() => { }}
      onUpdateHabit={() => { }}
      onDeleteHabit={() => { }}
      onAddDaily={() => { }}
      onUpdateDaily={() => { }}
      onDeleteDaily={() => { }}
      onAddTodo={() => { }}
      onUpdateTodo={() => { }}
      onDeleteTodo={() => { }}
      onClear={() => { }}
    />
  );

  const negativeHabitButton = screen.getByText('-');
  fireEvent.click(negativeHabitButton);

  expect(updateHealthMock).toHaveBeenCalled();
});
