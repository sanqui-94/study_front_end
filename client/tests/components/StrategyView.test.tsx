import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StrategyView from "../../src/components/StrategyView";
import StrategyCard from "../../src/components/StrategyCard";

// Mock the StrategyCard component
jest.mock("../../src/components/StrategyCard", () => {
  return jest.fn(() => <div data-testid="strategy-card">Mocked Strategy Card</div>);
});

describe("StrategyView", () => {
  // Mock fetch
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading message initially", () => {
    // Mock fetch but don't resolve yet
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));

    render(<StrategyView />);

    // Should show loading message
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("loads and displays a random strategy on mount", async () => {
    // Mock strategy data
    const mockStrategy = { id: 42, text: "Test Strategy" };

    // Mock successful fetch
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockStrategy)
    });

    render(<StrategyView />);

    // Wait for the strategy to load
    await waitFor(() => {
      expect(StrategyCard).toHaveBeenCalled();
    });

    // Strategy card should be rendered
    expect(screen.getByTestId("strategy-card")).toBeInTheDocument();

    // StrategyCard should be called with the correct props
    expect(StrategyCard).toHaveBeenCalledWith({ strategy: mockStrategy }, undefined);
  });

  it("fetches a new strategy when 'Get Another' button is clicked", async () => {
    // Mock initial strategy
    const initialStrategy = { id: 1, text: "Initial Strategy" };
    const newStrategy = { id: 2, text: "New Strategy" };

    // Mock fetch for initial load
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(initialStrategy)
    });

    render(<StrategyView />);

    // Wait for the initial strategy to load
    await waitFor(() => {
      expect(StrategyCard).toHaveBeenCalledWith({ strategy: initialStrategy }, undefined);
    });

    // Reset mocks to prepare for the button click
    jest.clearAllMocks();

    // Mock fetch for the button click
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(newStrategy)
    });

    // Click the "Get Another" button
    fireEvent.click(screen.getByText("Get Another"));

    // Wait for the new strategy to load
    await waitFor(() => {
      expect(StrategyCard).toHaveBeenCalledWith({ strategy: newStrategy }, undefined);
    });

    // Fetch should have been called again
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith("/api/strategies/random");
  });

  it("handles fetch errors gracefully", async () => {
    // Mock fetch to reject
    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    // Spy on console.error
    jest.spyOn(console, "error").mockImplementation(() => {});

    render(<StrategyView />);

    // Wait for fetch to be called
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    // Console error should have been called
    expect(console.error).toHaveBeenCalled();
  });

  it("handles click errors gracefully", async () => {
    // Mock initial strategy fetch
    const initialStrategy = { id: 1, text: "Initial Strategy" };
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(initialStrategy)
    });

    render(<StrategyView />);

    // Wait for the initial strategy to load
    await waitFor(() => {
      expect(StrategyCard).toHaveBeenCalled();
    });

    // Reset mocks and prepare for error on button click
    jest.clearAllMocks();
    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch new strategy"));

    // Spy on console.error
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Click the "Get Another" button
    fireEvent.click(screen.getByText("Get Another"));

    // Wait for the error handling
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });
});
