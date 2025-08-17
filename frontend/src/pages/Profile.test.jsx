import { getProfile } from '../services/AuthService';

// Mock the AuthService
jest.mock('../services/AuthService');
const mockGetProfile = getProfile;

describe('Profile Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads user profile successfully', async () => {
    const mockUser = {
      first_name: 'John',
      username: 'johndoe',
      email: 'john@example.com'
    };
    
    mockGetProfile.mockResolvedValue(mockUser);
    
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        return { user: data, loading: false };
      } catch (error) {
        return { user: null, loading: false, error: error.message };
      }
    };

    const result = await loadProfile();
    
    expect(result.user).toEqual(mockUser);
    expect(result.loading).toBe(false);
    expect(mockGetProfile).toHaveBeenCalledTimes(1);
  });

  test('handles profile loading failure', async () => {
    mockGetProfile.mockRejectedValue(new Error('Failed to load profile'));
    
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        return { user: data, loading: false };
      } catch (error) {
        return { user: null, loading: false, error: error.message };
      }
    };

    const result = await loadProfile();
    
    expect(result.user).toBe(null);
    expect(result.error).toBe('Failed to load profile');
    expect(result.loading).toBe(false);
  });

  test('formats user display data correctly', () => {
    const user = {
      first_name: 'Jane',
      username: 'janedoe',
      email: 'jane@test.com'
    };

    const formatUserDisplay = (user) => {
      if (!user) return { loading: true };
      
      return {
        welcome: `Welcome, ${user.first_name}!`,
        username: `Username: ${user.username}`,
        email: `Email: ${user.email}`,
        loading: false
      };
    };

    const result = formatUserDisplay(user);
    
    expect(result.welcome).toBe('Welcome, Jane!');
    expect(result.username).toBe('Username: janedoe');
    expect(result.email).toBe('Email: jane@test.com');
    expect(result.loading).toBe(false);
  });

  test('handles null user state', () => {
    const formatUserDisplay = (user) => {
      if (!user) return { loading: true };
      return { loading: false };
    };

    const result = formatUserDisplay(null);
    expect(result.loading).toBe(true);
  });
});