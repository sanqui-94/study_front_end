import { render, screen, waitFor } from "@testing-library/react";
import FavoritesList from "../../src/components/FavoritesList";
import { useFavorites } from "../../src/hooks/useFavorites";
import StrategyCard from "../../src/components/StrategyCard";

// Mock the dependent modules
jest.mock("../../src/hooks/useFavorites");
jest.mock("../../src/components/StrategyCard", () => {
  return jest.fn(() => <div data-testid="strategy-card">Mocked Strategy Card</div>);
});

describe("FavoritesList", () => {
  // Mock global fetch
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows 'No favorites yet' message when there are no favorites", async () => {
    // Mock the favorites hook to return empty favorites
    (useFavorites as jest.Mock).mockReturnValue({ favorites: [] });

    // Mock fetch to return empty strategies array
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce([])
    });

    render(<FavoritesList />);

    // Should show no favorites message
    expect(await screen.findByText("No favorites yet")).toBeInTheDocument();
  });

  it("renders favorite strategies when they exist", async () => {
    // Mock strategies data
    const mockStrategies = [
      { id: 1, text: "Strategy 1" },
      { id: 2, text: "Strategy 2" },
      { id: 3, text: "Strategy 3" }
    ];

    // Mock the favorites hook to return some favorite IDs
    (useFavorites as jest.Mock).mockReturnValue({ favorites: [1, 3] });

    // Mock fetch to return strategies
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockStrategies)
    });

    render(<FavoritesList />);

    // Wait for the fetch to complete
    await waitFor(() => {
      // Should not show no favorites message
      expect(screen.queryByText("No favorites yet")).not.toBeInTheDocument();
    });

    // Should render 2 strategy cards (for IDs 1 and 3)
    const strategyCards = screen.getAllByTestId("strategy-card");
    expect(strategyCards).toHaveLength(2);

    // Check that StrategyCard was called with the correct props
    expect(StrategyCard).toHaveBeenCalledTimes(2);

    // We need to check all calls together since the order might not be guaranteed
    const calls = (StrategyCard as jest.Mock).mock.calls;
    expect(calls).toEqual(
      expect.arrayContaining([
        [{ strategy: mockStrategies[0] }, undefined],
        [{ strategy: mockStrategies[2] }, undefined]
      ])
    );
  });

  it("handles fetch errors gracefully", async () => {
    // Mock the favorites hook
    (useFavorites as jest.Mock).mockReturnValue({ favorites: [1] });

    // Mock fetch to reject with an error
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    // Spy on console.error
    jest.spyOn(console, "error").mockImplementation(() => {});

    render(<FavoritesList />);

    // Wait for the fetch to complete
    await waitFor(() => {
      // Should show no favorites because the fetch failed
      expect(screen.getByText("No favorites yet")).toBeInTheDocument();
    });

    // Console.error should have been called
    expect(console.error).toHaveBeenCalled();
  });
});
