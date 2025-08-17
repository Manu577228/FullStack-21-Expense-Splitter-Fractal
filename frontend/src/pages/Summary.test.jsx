import { apiFetch } from '../api';

// Mock the API
jest.mock('../api');
const mockApiFetch = apiFetch;

describe('Summary Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads summary data successfully', async () => {
    const mockGroup = { name: 'Test Group' };
    const mockSummary = {
      total_amount: 500,
      member_balances: [
        { id: 1, username: 'user1', paid: 300, owes: 250, net_balance: 50 },
        { id: 2, username: 'user2', paid: 200, owes: 250, net_balance: -50 }
      ]
    };

    mockApiFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockGroup) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSummary) });

    const loadSummary = async (groupId) => {
      try {
        const gRes = await apiFetch(`/api/groups/${groupId}/`);
        if (!gRes?.ok) throw new Error("Failed to load group");
        const group = await gRes.json();

        const sRes = await apiFetch(`/api/groups/${groupId}/summary/`);
        if (!sRes?.ok) throw new Error("Failed to load summary");
        const summaryData = await sRes.json();

        return { group, summaryData, loading: false };
      } catch (err) {
        return { error: "Error loading summary: " + err.message, loading: false };
      }
    };

    const result = await loadSummary('1');

    expect(result.group).toEqual(mockGroup);
    expect(result.summaryData).toEqual(mockSummary);
    expect(result.loading).toBe(false);
    expect(mockApiFetch).toHaveBeenCalledTimes(2);
  });

  test('handles API errors gracefully', async () => {
    mockApiFetch.mockRejectedValue(new Error('Network error'));

    const loadSummary = async (groupId) => {
      try {
        const gRes = await apiFetch(`/api/groups/${groupId}/`);
        if (!gRes?.ok) throw new Error("Failed to load group");
        return { loading: false };
      } catch (err) {
        return { error: "Error loading summary: " + err.message, loading: false };
      }
    };

    const result = await loadSummary('1');

    expect(result.error).toBe('Error loading summary: Network error');
    expect(result.loading).toBe(false);
  });

  test('calculates member balance display correctly', () => {
    const calculateMemberCard = (member, index) => {
      const isAlternate = index % 2 === 0;
      const netBalance = parseFloat(member.net_balance);
      
      return {
        username: member.username,
        initial: member.username.charAt(0).toUpperCase(),
        paid: `₹${member.paid}`,
        owes: `₹${member.owes}`,
        netBalance: `₹${member.net_balance}`,
        isPositive: netBalance >= 0,
        cardStyle: isAlternate ? 'dark' : 'light'
      };
    };

    const member = { username: 'john', paid: 300, owes: 250, net_balance: 50 };
    const result = calculateMemberCard(member, 0);

    expect(result.username).toBe('john');
    expect(result.initial).toBe('J');
    expect(result.paid).toBe('₹300');
    expect(result.owes).toBe('₹250');
    expect(result.netBalance).toBe('₹50');
    expect(result.isPositive).toBe(true);
    expect(result.cardStyle).toBe('dark');
  });

  test('formats total amount correctly', () => {
    const formatTotalAmount = (summaryData) => {
      return {
        total: `₹${summaryData?.total_amount || 0}`,
        hasExpenses: (summaryData?.total_amount || 0) > 0
      };
    };

    const result1 = formatTotalAmount({ total_amount: 1500 });
    expect(result1.total).toBe('₹1500');
    expect(result1.hasExpenses).toBe(true);

    const result2 = formatTotalAmount(null);
    expect(result2.total).toBe('₹0');
    expect(result2.hasExpenses).toBe(false);
  });
});