import { render, screen, fireEvent } from "@testing-library/react";
import StrategyCard from "../../src/components/StrategyCard";
import { useFavorites } from "../../src/hooks/useFavorites";

// Mock the useFavorites hook
jest.mock("../../src/hooks/useFavorites");

describe("StrategyCard", () => {
  const mockStrategy = {
    id: 42,
    text: "Test Strategy",
  };

  const mockToggleFavorite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders strategy information correctly", () => {
    // Mock the useFavorites hook to return a strategy that is not a favorite
    (useFavorites as jest.Mock).mockReturnValue({
      isFavorite: () => false,
      toggleFavorite: mockToggleFavorite,
    });

    render(<StrategyCard strategy={mockStrategy} />);

    // Check that the strategy ID is displayed
    expect(screen.getByText(/Strategy #42/i)).toBeInTheDocument();

    // Check that the strategy text is displayed
    expect(screen.getByText("Test Strategy")).toBeInTheDocument();

    // Check that the outline star icon is rendered (not a favorite)
    const favoriteButton = screen.getByRole("button", { name: /toggle favorite/i });
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton.querySelector("svg")).toHaveClass("text-secondary");
  });

  it("renders a filled star when strategy is a favorite", () => {
    // Mock the useFavorites hook to return a strategy that is a favorite
    (useFavorites as jest.Mock).mockReturnValue({
      isFavorite: () => true,
      toggleFavorite: mockToggleFavorite,
    });

    render(<StrategyCard strategy={mockStrategy} />);

    // Check that the solid star icon is rendered (is a favorite)
    const favoriteButton = screen.getByRole("button", { name: /toggle favorite/i });
    expect(favoriteButton).toBeInTheDocument();
    expect(favoriteButton.querySelector("svg")).toHaveClass("text-secondary-dark");
  });

  it("calls toggleFavorite when the star button is clicked", () => {
    // Mock the useFavorites hook
    (useFavorites as jest.Mock).mockReturnValue({
      isFavorite: () => false,
      toggleFavorite: mockToggleFavorite,
    });

    render(<StrategyCard strategy={mockStrategy} />);

    // Find and click the favorite button
    const favoriteButton = screen.getByRole("button", { name: /toggle favorite/i });
    fireEvent.click(favoriteButton);

    // Check that toggleFavorite was called with the correct strategy ID
    expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockToggleFavorite).toHaveBeenCalledWith(42);
  });
});
