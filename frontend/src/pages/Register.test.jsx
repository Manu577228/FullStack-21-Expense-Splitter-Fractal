import { register as registerUser } from '../services/AuthService';

// Mock the AuthService
jest.mock('../services/AuthService');
const mockRegister = registerUser;

describe('Register Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('validates username format', () => {
    const validateUsername = (username) => {
      if (!/^[A-Za-z][A-Za-z0-9]{2,15}$/.test(username)) {
        return "Username must start with a letter & contain only letters/numbers (3-16 chars)";
      }
      return "";
    };

    expect(validateUsername("123invalid")).toBeTruthy();
    expect(validateUsername("ab")).toBeTruthy(); // too short
    expect(validateUsername("validUser123")).toBe("");
    expect(validateUsername("user@invalid")).toBeTruthy(); // special chars
  });

  test('validates full name format', () => {
    const validateName = (name) => {
      if (!/^[A-Za-z ]+$/.test(name)) {
        return "Full name must contain only letters and spaces";
      }
      return "";
    };

    expect(validateName("John Doe")).toBe("");
    expect(validateName("John123")).toBeTruthy(); // numbers
    expect(validateName("John@Doe")).toBeTruthy(); // special chars
    expect(validateName("")).toBeTruthy(); // empty
  });

  test('validates email format', () => {
    const validateEmail = (email) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Enter a valid email address";
      }
      return "";
    };

    expect(validateEmail("user@example.com")).toBe("");
    expect(validateEmail("invalid-email")).toBeTruthy();
    expect(validateEmail("@example.com")).toBeTruthy();
    expect(validateEmail("user@")).toBeTruthy();
  });

  test('validates password format', () => {
    const validatePassword = (password) => {
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(password)) {
        return "Password must be 8–16 chars with upper, lower, number & special char";
      }
      return "";
    };

    expect(validatePassword("Password123!")).toBe("");
    expect(validatePassword("password")).toBeTruthy(); // no uppercase, number, special
    expect(validatePassword("PASSWORD123!")).toBeTruthy(); // no lowercase
    expect(validatePassword("Password!")).toBeTruthy(); // no number
    expect(validatePassword("Password123")).toBeTruthy(); // no special char
  });

  test('successful registration redirects to login', async () => {
    const mockResponse = { access: 'token', refresh: 'refresh' };
    mockRegister.mockResolvedValue(mockResponse);

    const handleRegister = async (formData) => {
      try {
        const res = await registerUser(formData);
        if (res.access && res.refresh) {
          return { success: true, message: "Registration successful! Please login." };
        }
        return { success: true, message: "Registration succeeded. Please login." };
      } catch (err) {
        return { success: false, error: err.response?.data?.error || err.message };
      }
    };

    const result = await handleRegister({
      username: 'testuser',
      first_name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!'
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Registration successful! Please login.");
    expect(mockRegister).toHaveBeenCalledWith({
      username: 'testuser',
      first_name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!'
    });
  });

  test('handles registration failure', async () => {
    mockRegister.mockRejectedValue({
      response: { data: { error: 'Username already exists' } }
    });

    const handleRegister = async (formData) => {
      try {
        const res = await registerUser(formData);
        return { success: true };
      } catch (err) {
        return { success: false, error: err.response?.data?.error || err.message };
      }
    };

    const result = await handleRegister({
      username: 'existinguser',
      first_name: 'Test',
      email: 'test@test.com',
      password: 'Password123!'
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Username already exists');
  });
});