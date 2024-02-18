import React from 'react';
import { render, act } from '@testing-library/react';
import LevelUpPopup from './LevelUpPopup';

jest.useFakeTimers(); // Use the fake timer provided by Jest.

describe('LevelUpPopup component', () => {
  test('renders when show is true', () => {
    const { getByText } = render(<LevelUpPopup show={true} onClose={() => {}} />);
    const congratulationsText = getByText('Congratulations!');
    const levelUpText = getByText("You've leveled up!");
    expect(congratulationsText).toBeInTheDocument();
    expect(levelUpText).toBeInTheDocument();
  });

  test('does not render when show is false', () => {
    const { queryByText } = render(<LevelUpPopup show={false} onClose={() => {}} />);
    const congratulationsText = queryByText('Congratulations!');
    const levelUpText = queryByText("You've leveled up!");
    expect(congratulationsText).not.toBeInTheDocument();
    expect(levelUpText).not.toBeInTheDocument();
  });

  test('calls onClose after timeout when show is true', () => {
    const onCloseMock = jest.fn();
    render(<LevelUpPopup show={true} onClose={onCloseMock} />);
    act(() => {
      jest.runAllTimers(); // Trigger all false timer callbacks
    });
    expect(onCloseMock).toHaveBeenCalled();
  });

  test('does not call onClose after timeout when show is false', () => {
    const onCloseMock = jest.fn();
    render(<LevelUpPopup show={false} onClose={onCloseMock} />);
    act(() => {
      jest.runAllTimers(); // Trigger all false timer callbacks
    });
    expect(onCloseMock).not.toHaveBeenCalled();
  });
});
