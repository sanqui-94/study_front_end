import { renderHook, act } from "@testing-library/react";
import { useDailyStrategy } from "../../src/hooks/useDailyStrategy";

// Mock the fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

// Mock date
const MOCK_DATE = "2025-06-01";
const originalDate = global.Date;
class MockDate extends Date {
  constructor(date?: string | number | Date) {
    if (date) {
      super(date);
    } else {
      super(MOCK_DATE);
    }
  }

  toISOString() {
    return new originalDate(MOCK_DATE).toISOString();
  }
}

describe("useDailyStrategy hook", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockLocalStorage.clear();

    // Mock the date
    global.Date = MockDate as DateConstructor;
  });

  afterEach(() => {
    // Restore date
    global.Date = originalDate;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("fetches a new random strategy when no stored strategy exists", async () => {
    // Mock a successful API response for a random strategy
    const mockStrategy = { id: 123, title: "Test Strategy", description: "Test Description" };
    mockFetch.mockResolvedValueOnce({
      json: async () => mockStrategy,
    });

    // Render the hook
    const { result } = renderHook(() => useDailyStrategy());

    // Initial state should be null
    expect(result.current.strategy).toBeNull();

    // Wait for the effect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Verify fetch was called correctly
    expect(mockFetch).toHaveBeenCalledWith("/api/strategies/random");

    // Strategy should be updated with the mock data
    expect(result.current.strategy).toEqual(mockStrategy);

    // Verify localStorage was set with the correct data
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "daily-strategy",
      JSON.stringify({ id: mockStrategy.id, date: MOCK_DATE })
    );
  });

  it("reuses a stored strategy if it's from today", async () => {
    // Setup localStorage with a strategy from today
    const storedStrategy = { id: 456, date: MOCK_DATE };
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(storedStrategy));

    // Mock a successful API response for the specific strategy
    const mockStrategy = { id: 456, title: "Stored Strategy", description: "Stored Description" };
    mockFetch.mockResolvedValueOnce({
      json: async () => mockStrategy,
    });

    // Render the hook
    const { result } = renderHook(() => useDailyStrategy());

    // Wait for the effect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Verify fetch was called with the stored ID
    expect(mockFetch).toHaveBeenCalledWith(`/api/strategies/${storedStrategy.id}`);

    // Strategy should be updated with the mock data
    expect(result.current.strategy).toEqual(mockStrategy);

    // localStorage.setItem should not be called since we're reusing the stored strategy
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });

  it("fetches a new strategy if the stored one is from a different day", async () => {
    // Setup localStorage with a strategy from yesterday
    const yesterdayDate = "2025-05-31";
    const storedStrategy = { id: 789, date: yesterdayDate };
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(storedStrategy));

    // Mock a successful API response for a random strategy
    const mockStrategy = { id: 999, title: "New Strategy", description: "New Description" };
    mockFetch.mockResolvedValueOnce({
      json: async () => mockStrategy,
    });

    // Render the hook
    const { result } = renderHook(() => useDailyStrategy());

    // Wait for the effect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Verify fetch was called for a random strategy
    expect(mockFetch).toHaveBeenCalledWith("/api/strategies/random");

    // Strategy should be updated with the mock data
    expect(result.current.strategy).toEqual(mockStrategy);

    // Verify localStorage was updated with the new strategy
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "daily-strategy",
      JSON.stringify({ id: mockStrategy.id, date: MOCK_DATE })
    );
  });

  it("handles API errors gracefully", async () => {
    // Mock a failed API response
    mockFetch.mockRejectedValueOnce(new Error("API Error"));

    // Spy on console.error
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Render the hook
    const { result } = renderHook(() => useDailyStrategy());

    // Wait for the effect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Strategy should remain null
    expect(result.current.strategy).toBeNull();

    // Verify console.error was called
    expect(console.error).toHaveBeenCalled();
  });
});
