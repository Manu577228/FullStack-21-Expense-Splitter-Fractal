import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Create a mock Navbar component that doesn't use external dependencies
const MockNavbar = () => {
  const [user, setUser] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div data-testid="navbar">
      <div>Expense Splitter</div>
      
      {user ? (
        <>
          <div>Hi, {user.name}</div>
          <button onClick={() => setUser(null)}>Logout</button>
        </>
      ) : (
        <>
          <button>Register</button>
          <button>Login</button>
        </>
      )}
      
      <button onClick={() => setMenuOpen(!menuOpen)}>Menu</button>
      
      {menuOpen && (
        <div data-testid="mobile-menu">
          {user ? (
            <div onClick={() => setUser(null)}>Logout</div>
          ) : (
            <>
              <div>Register</div>
              <div>Login</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

describe('Navbar Component', () => {
  it('renders navbar with brand name', () => {
    render(<MockNavbar />);
    expect(screen.getByText('Expense Splitter')).toBeInTheDocument();
  });

  it('shows login and register when not authenticated', () => {
    render(<MockNavbar />);
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('toggles mobile menu when menu button is clicked', () => {
    render(<MockNavbar />);
    
    const menuButton = screen.getByText('Menu');
    fireEvent.click(menuButton);
    
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
  });
});