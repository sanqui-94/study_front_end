import { renderHook, act } from "@testing-library/react";
import { mockStrategiesContext } from "../test-utils";
import { useDailyStrategy } from "../../src/hooks/useDailyStrategy";

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

  static now() {
    return new Date(MOCK_DATE).getTime();
  }

  toISOString() {
    if (this.getTime() === new Date(MOCK_DATE).getTime()) {
      return `${MOCK_DATE}T00:00:00.000Z`;
    }
    return super.toISOString();
  }
}

describe("useDailyStrategy hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    global.Date = MockDate as typeof Date;
    
    // Reset mock context
    mockStrategiesContext.getRandomStrategy.mockReturnValue({
      id: 123,
      text: "Test Strategy"
    });
    mockStrategiesContext.getStrategy.mockReturnValue({
      id: 123, 
      text: "Test Strategy"
    });
  });

  afterEach(() => {
    global.Date = originalDate;
  });

  it("fetches a new random strategy when no stored strategy exists", () => {
    // Render the hook
    const { result } = renderHook(() => useDailyStrategy());

    // Verify getRandomStrategy was called
    expect(mockStrategiesContext.getRandomStrategy).toHaveBeenCalled();

    // Strategy should be updated with the mock data immediately
    expect(result.current.strategy).toEqual({
      id: 123,
      text: "Test Strategy"
    });

    // Verify localStorage was set with the correct data
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "daily-strategy",
      JSON.stringify({ id: 123, date: MOCK_DATE })
    );
  });

  it("reuses a stored strategy if it's from today", async () => {
    // Pre-populate localStorage with today's strategy
    const storedData = { id: 456, date: MOCK_DATE };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));
    
    // Mock getStrategy to return the stored strategy
    mockStrategiesContext.getStrategy.mockReturnValue({
      id: 456,
      text: "Stored Strategy"
    });

    // Render the hook
    const { result } = renderHook(() => useDailyStrategy());

    // Wait for the effect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Verify getStrategy was called with the stored ID
    expect(mockStrategiesContext.getStrategy).toHaveBeenCalledWith(456);

    // Should NOT call getRandomStrategy
    expect(mockStrategiesContext.getRandomStrategy).not.toHaveBeenCalled();

    // Strategy should be the stored one
    expect(result.current.strategy).toEqual({
      id: 456, 
      text: "Stored Strategy"
    });
  });

  it("fetches a new strategy if the stored one is from a different day", async () => {
    // Pre-populate localStorage with yesterday's strategy
    const storedData = { id: 456, date: "2025-05-31" };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));

    // Render the hook
    const { result } = renderHook(() => useDailyStrategy());

    // Wait for the effect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Should call getRandomStrategy for a new strategy
    expect(mockStrategiesContext.getRandomStrategy).toHaveBeenCalled();

    // Should NOT call getStrategy since the stored date doesn't match
    expect(mockStrategiesContext.getStrategy).not.toHaveBeenCalled();

    // Strategy should be updated with new data
    expect(result.current.strategy).toEqual({
      id: 123,
      text: "Test Strategy"
    });

    // Verify localStorage was updated with today's data
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "daily-strategy",
      JSON.stringify({ id: 123, date: MOCK_DATE })
    );
  });

  it("handles missing strategy gracefully", () => {
    // Pre-populate localStorage with today's strategy but mock getStrategy to return null
    const storedData = { id: 456, date: MOCK_DATE };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));
    mockStrategiesContext.getStrategy.mockReturnValue(null);

    // Render the hook
    const { result } = renderHook(() => useDailyStrategy());

    // Should call getStrategy first with the stored ID
    expect(mockStrategiesContext.getStrategy).toHaveBeenCalledWith(456);

    // Should call getRandomStrategy as fallback when stored strategy doesn't exist
    expect(mockStrategiesContext.getRandomStrategy).toHaveBeenCalled();

    // Strategy should be updated with fallback data
    expect(result.current.strategy).toEqual({
      id: 123,
      text: "Test Strategy"
    });

    // Verify localStorage was updated with new data
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "daily-strategy",
      JSON.stringify({ id: 123, date: MOCK_DATE })
    );
  });
});