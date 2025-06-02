import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import SearchStrategy from "../../src/components/SearchStrategy";
import StrategyCard from "../../src/components/StrategyCard";

// Mock the StrategyCard component
jest.mock("../../src/components/StrategyCard", () => {
  return jest.fn(() => <div data-testid="strategy-card">Mocked Strategy Card</div>);
});

describe("SearchStrategy", () => {
  // Mock fetch
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders search input correctly", async () => {
    // Mock successful fetch
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce([])
    });

    render(<SearchStrategy />);

    // Wait for any async operations to complete
    await waitFor(() => {
      // Check if search input is rendered
      const searchInput = screen.getByPlaceholderText("Search strategies...");
      expect(searchInput).toBeInTheDocument();
    });
  });

  it("displays no strategies initially with empty search", async () => {
    // Mock strategies data
    const mockStrategies = [
      { id: 1, text: "First strategy" },
      { id: 2, text: "Second strategy" }
    ];

    // Mock successful fetch
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockStrategies)
    });

    render(<SearchStrategy />);

    // Wait for component to finish rendering and fetch to complete
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // With an empty search term, no strategy cards should be displayed
    expect(screen.queryByTestId("strategy-card")).not.toBeInTheDocument();
  });

  it("displays matching strategies when search has results", async () => {
    // Mock strategies data
    const mockStrategies = [
      { id: 1, text: "First strategy" },
      { id: 2, text: "Second strategy" },
      { id: 3, text: "Third unrelated item" }
    ];

    // Mock successful fetch
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockStrategies)
    });

    render(<SearchStrategy />);

    // Wait for fetch to complete
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // Type a search term that will match the first strategy
    const searchInput = screen.getByPlaceholderText("Search strategies...");
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "First" } });
    });

    // Wait for the search results to update
    await waitFor(() => {
      expect(screen.getByTestId("strategy-card")).toBeInTheDocument();
    });

    // Verify the correct strategy was passed to StrategyCard
    expect(StrategyCard).toHaveBeenCalledWith({ strategy: mockStrategies[0] }, undefined);
  });

  it("handles fetch errors gracefully", async () => {
    // Mock fetch to reject
    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<SearchStrategy />);

    // Wait for fetch to be called and rejected
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // Give time for the error handler to run
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
