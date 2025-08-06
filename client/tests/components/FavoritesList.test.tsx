import { render, screen, mockStrategiesContext } from "../test-utils";
import FavoritesList from "../../src/components/FavoritesList";
import StrategyCard from "../../src/components/StrategyCard";

// Mock the dependent modules
jest.mock("../../src/components/StrategyCard", () => {
  return jest.fn(() => <div data-testid="strategy-card">Mocked Strategy Card</div>);
});

describe("FavoritesList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock context
    mockStrategiesContext.favorites = [];
    mockStrategiesContext.loading = false;
    mockStrategiesContext.error = null;
  });

  it("shows 'No favorites yet' message when there are no favorites", () => {
    // Mock context with no favorites
    mockStrategiesContext.favorites = [];
    
    render(<FavoritesList />);

    // Should show no favorites message
    expect(screen.getByText("No favorites yet")).toBeInTheDocument();
  });

  it("renders favorite strategies when they exist", () => {
    // Mock context with some favorite IDs
    mockStrategiesContext.favorites = [1, 3];
    
    render(<FavoritesList />);

    // Should not show no favorites message
    expect(screen.queryByText("No favorites yet")).not.toBeInTheDocument();

    // Should render 2 strategy cards (for IDs 1 and 3)
    const strategyCards = screen.getAllByTestId("strategy-card");
    expect(strategyCards).toHaveLength(2);

    // Check that StrategyCard was called with the correct props
    expect(StrategyCard).toHaveBeenCalledTimes(2);
  });

  it("shows loading state", () => {
    // Mock context in loading state
    mockStrategiesContext.loading = true;
    mockStrategiesContext.favorites = [1];
    
    render(<FavoritesList />);

    // Should show loading message
    expect(screen.getByText("Loading favorite strategies...")).toBeInTheDocument();
  });

  it("handles errors gracefully", () => {
    // Mock context with error
    mockStrategiesContext.error = "Failed to load strategies";
    mockStrategiesContext.favorites = [1];
    
    render(<FavoritesList />);

    // Should show error message
    expect(screen.getByText("Error: Failed to load strategies")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });
});
