import { login, register, refreshAccessToken, getProfile, logout } from './AuthService';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
  });

  test('login stores tokens successfully', async () => {
    const mockResponse = { access: 'token123', refresh: 'refresh123' };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await login({ username: 'test', password: 'pass' });

    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test', password: 'pass' })
    });
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'token123');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refresh', 'refresh123');
    expect(result).toEqual(mockResponse);
  });

  test('login handles failure', async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ detail: 'Invalid credentials' })
    });

    await expect(login({ username: 'wrong', password: 'wrong' }))
      .rejects.toThrow('Invalid credentials');
  });

  test('register calls correct endpoint', async () => {
    const mockResponse = { id: 1, username: 'newuser' };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const userData = { username: 'newuser', email: 'test@test.com', password: 'pass123' };
    const result = await register(userData);

    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/users/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    expect(result).toEqual(mockResponse);
  });

  test('refreshAccessToken updates token', async () => {
    mockLocalStorage.getItem.mockReturnValue('refresh123');
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ access: 'newtoken456' })
    });

    const result = await refreshAccessToken();

    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: 'refresh123' })
    });
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'newtoken456');
    expect(result).toBe(true);
  });

  test('getProfile fetches user data', async () => {
    mockLocalStorage.getItem.mockReturnValue('token123');
    const mockProfile = { id: 1, username: 'testuser', email: 'test@test.com' };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProfile)
    });

    const result = await getProfile();

    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/profile/', {
      headers: { Authorization: 'Bearer token123' }
    });
    expect(result).toEqual(mockProfile);
  });

  test('logout clears storage', () => {
    logout();

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refresh');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
  });
});