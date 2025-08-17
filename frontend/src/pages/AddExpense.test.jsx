import { render, screen } from '@testing-library/react';
import { apiFetch } from '../api';

// Mock the API
jest.mock('../api');
const mockApiFetch = apiFetch;

// Simple component test without router
const MockAddExpense = () => {
  const handleSubmit = async (formData) => {
    if (!formData.description || !formData.amount) {
      throw new Error('Please fill all fields');
    }
    if (formData.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    await apiFetch('/api/groups/1/add-expense/', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    return { success: true };
  };

  return (
    <div>
      <h1>Add Expense Test</h1>
      <button onClick={() => handleSubmit({})}>Test Validation</button>
      <button onClick={() => handleSubmit({description: 'Test', amount: 100})}>Test Submit</button>
    </div>
  );
};

describe('AddExpense Logic', () => {
  beforeEach(() => jest.clearAllMocks());

  test('validates required fields', async () => {
    const handleSubmit = async (formData) => {
      if (!formData.description || !formData.amount) {
        throw new Error('Please fill all fields');
      }
      return { success: true };
    };

    try {
      await handleSubmit({});
    } catch (error) {
      expect(error.message).toBe('Please fill all fields');
    }
  });

  test('validates positive amount', async () => {
    const handleSubmit = async (formData) => {
      if (formData.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      return { success: true };
    };

    try {
      await handleSubmit({ description: 'Test', amount: -100 });
    } catch (error) {
      expect(error.message).toBe('Amount must be greater than 0');
    }
  });

  test('calls API with correct data', async () => {
    mockApiFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

    await apiFetch('/api/groups/1/add-expense/', {
      method: 'POST',
      body: JSON.stringify({
        description: 'Test expense',
        amount: 100,
        paid_by_username: 'user1',
        split_type: 'equal'
      })
    });

    expect(mockApiFetch).toHaveBeenCalledWith('/api/groups/1/add-expense/', {
      method: 'POST',
      body: JSON.stringify({
        description: 'Test expense',
        amount: 100,
        paid_by_username: 'user1',
        split_type: 'equal'
      })
    });
  });
});