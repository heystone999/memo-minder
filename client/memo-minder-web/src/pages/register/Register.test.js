import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { Register } from './Register';

jest.mock('axios');

describe('Register component', () => {
  test('allows user to sign up successfully', async () => {
    axios.post.mockResolvedValueOnce({ status: 200 });

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('User Name'), { target: { value: 'testUser' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password' } });

    fireEvent.submit(getByText('Sign up'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('register'), {
      username: 'testUser',
      password: 'password',
      email: 'test@example.com',
    });
  });

  test('displays error message for password mismatch', () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'wrongPassword' } });

    expect(getByText('Passwords do not match')).toBeInTheDocument();
  });

  test('handles server error during sign up', async () => {
    axios.post.mockRejectedValueOnce({ message: 'Server Error' });

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('User Name'), { target: { value: 'testUser' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password' } });

    fireEvent.submit(getByText('Sign up'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(getByText('sign up error:')).toBeInTheDocument();
  });

  test('updates confirm password and password match state', () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const confirmPasswordInput = getByLabelText('Confirm Password');

    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });
    expect(confirmPasswordInput.value).toBe('password');
  });

  test('does not submit form if passwords do not match', async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('User Name'), { target: { value: 'testUser' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'wrongPassword' } });

    fireEvent.submit(getByText('Sign up'));

    await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
  });

  test('navigates to login page after successful sign up', async () => {
    axios.post.mockResolvedValueOnce({ status: 200 });

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('User Name'), { target: { value: 'testUser' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password' } });

    fireEvent.submit(getByText('Sign up'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('register'), {
      username: 'testUser',
      password: 'password',
      email: 'test@example.com',
    });

    // Mock the navigate function
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/Login'));
  });
});
