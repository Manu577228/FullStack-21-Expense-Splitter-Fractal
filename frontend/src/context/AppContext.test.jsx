import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppProvider, AppContext } from './AppContext';

// Test component that uses the context
const TestComponent = () => {
  const context = React.useContext(AppContext);
  
  if (!context) return <div>No context</div>;
  
  const { user, isAuthenticated, login, logout, loading, groups } = context;
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="user">{user ? user.name : 'No User'}</div>
      <div data-testid="groups">{groups.length}</div>
      
      <button 
        onClick={() => login({ name: 'John' }, 'fake-token')}
        data-testid="login-btn"
      >
        Login
      </button>
      
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
};

describe('AppContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides initial state correctly', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('No User');
    expect(screen.getByTestId('groups')).toHaveTextContent('0');
  });

  it('handles login correctly', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    act(() => {
      screen.getByTestId('login-btn').click();
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('John');
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('user')).toBe('{"name":"John"}');
  });

  it('handles logout correctly', () => {
    // Set up authenticated state first
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', '{"name":"Jane"}');

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // Should be authenticated initially
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('Jane');

    // Logout
    act(() => {
      screen.getByTestId('logout-btn').click();
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('No User');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('loads user from localStorage on mount', () => {
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem('user', '{"name":"Stored User"}');

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('Stored User');
  });

  it('clears invalid localStorage data', () => {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('user', 'invalid-json');

    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});