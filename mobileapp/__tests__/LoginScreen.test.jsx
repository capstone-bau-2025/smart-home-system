import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';
import { AuthContext } from '../store/auth-context';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: ({ name, size, color }) => {
      return React.createElement('Ionicons', { name, size, color });
    },
  };
});

describe('LoginScreen', () => {
  const mockLogin = jest.fn();

  const renderWithContext = () =>
    render(
      <AuthContext.Provider value={{ login: mockLogin, authStatus: 200 }}>
        <LoginScreen navigation={{ navigate: jest.fn() }} />
      </AuthContext.Provider>
    );

  it('renders inputs and login button', () => {
    const { getByPlaceholderText, getByText } = renderWithContext();

    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('calls login with input values', async () => {
    const { getByPlaceholderText, getByTestId } = renderWithContext();

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    });

    await act(async () => {
      fireEvent.press(getByTestId('oval-button'));
    });

    
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
