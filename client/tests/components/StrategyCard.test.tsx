import { render, screen, fireEvent } from "../test-utils";
import StrategyCard from "../../src/components/StrategyCard";
import { mockStrategiesContext } from "../test-utils";

describe("StrategyCard", () => {
    const mockStrategy = {
        id: 42,
        text: "Test Strategy",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders strategy information correctly", () => {
        render(<StrategyCard strategy={mockStrategy} />);

        // Check that the strategy ID is displayed
        expect(screen.getByText(/Strategy #42/i)).toBeInTheDocument();

        // Check that the strategy text is displayed
        expect(screen.getByText("Test Strategy")).toBeInTheDocument();

        // Check that the outline star icon is rendered (not a favorite)
        const favoriteButton = screen.getByRole("button", { name: /add to favorites/i });
        expect(favoriteButton).toBeInTheDocument();
        expect(favoriteButton.querySelector("svg")).toHaveClass("text-secondary");
    });

    it("renders a filled star when strategy is a favorite", () => {
        // Mock the favorites to include our test strategy
        mockStrategiesContext.favorites = [42];
        mockStrategiesContext.isFavorite.mockReturnValue(true);

        render(<StrategyCard strategy={mockStrategy} />);

        // Check that the solid star icon is rendered (is a favorite)
        const favoriteButton = screen.getByRole("button", { name: /remove from favorites/i });
        expect(favoriteButton).toBeInTheDocument();
        expect(favoriteButton.querySelector("svg")).toHaveClass("text-secondary-dark");
    });

    it("calls toggleFavorite when the star button is clicked", () => {
        // Reset favorites to empty for this test
        mockStrategiesContext.favorites = [];
        mockStrategiesContext.isFavorite.mockReturnValue(false);

        render(<StrategyCard strategy={mockStrategy} />);

        // Find and click the favorite button
        const favoriteButton = screen.getByRole("button", { name: /add to favorites/i });
        fireEvent.click(favoriteButton);

        // Check that toggleFavorite was called with the correct strategy ID
        expect(mockStrategiesContext.toggleFavorite).toHaveBeenCalledTimes(1);
        expect(mockStrategiesContext.toggleFavorite).toHaveBeenCalledWith(42);
    });
});
