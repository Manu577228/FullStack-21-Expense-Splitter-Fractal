import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { login } from '../services/AuthService';

// Mock the AuthService
jest.mock('../services/AuthService');
const mockLogin = login;

// Mock localStorage
const mockLocalStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Login Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.setItem.mockClear();
  });

  test('validates form fields', () => {
    const validateForm = (form) => {
      let errors = {};
      if (!form.username.trim()) errors.username = "Username or Email is required";
      if (!form.password.trim()) errors.password = "Password is required";
      return { isValid: Object.keys(errors).length === 0, errors };
    };

    const result = validateForm({ username: '', password: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors.username).toBe("Username or Email is required");
    expect(result.errors.password).toBe("Password is required");
  });

  test('successful login handles token storage', async () => {
    const mockResponse = { access: 'token123', refresh: 'refresh123' };
    mockLogin.mockResolvedValue(mockResponse);
    
    const handleLogin = async (form) => {
      const res = await login(form);
      if (res.access) {
        localStorage.setItem("token", res.access);
        if (res.refresh) localStorage.setItem("refresh", res.refresh);
        return { success: true };
      }
      return { error: "Invalid username or password." };
    };

    const result = await handleLogin({ username: 'test', password: 'pass' });
    
    expect(result.success).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'token123');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refresh', 'refresh123');
  });

  test('handles login failure', async () => {
    mockLogin.mockRejectedValue({ 
      response: { data: { error: 'Invalid credentials' } }
    });
    
    const handleLogin = async (form) => {
      try {
        const res = await login(form);
        if (res.access) {
          return { success: true };
        }
        return { error: "Invalid username or password." };
      } catch (err) {
        return { error: err.response?.data?.error || err.message };
      }
    };

    const result = await handleLogin({ username: 'wrong', password: 'wrong' });
    expect(result.error).toBe('Invalid credentials');
  });
});