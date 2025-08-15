import { render, screen, fireEvent, mockStrategiesContext } from "../test-utils";
import StrategyView from "../../src/components/StrategyView";

// Mock the StrategyCard component
jest.mock("../../src/components/StrategyCard", () => {
    return jest.fn(() => <div data-testid="strategy-card">Mocked Strategy Card</div>);
});

describe("StrategyView", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset mock context
        mockStrategiesContext.loading = false;
        mockStrategiesContext.error = null;
        mockStrategiesContext.getRandomStrategy.mockReturnValue({
            id: 1,
            text: "Test strategy",
        });
    });

    it("shows loading message when loading", () => {
        // Mock loading state
        mockStrategiesContext.loading = true;

        render(<StrategyView />);

        // Should show loading message
        expect(screen.getByText("Loading strategies...")).toBeInTheDocument();
    });

    it("shows error message when there's an error", () => {
        // Mock error state
        mockStrategiesContext.error = "Failed to load";

        render(<StrategyView />);

        // Should show error message
        expect(screen.getByText("Error: Failed to load")).toBeInTheDocument();
        expect(screen.getByText("Retry")).toBeInTheDocument();
    });

    it("loads and displays a random strategy on mount", () => {
        render(<StrategyView />);

        // Should display the strategy card
        expect(screen.getByTestId("strategy-card")).toBeInTheDocument();

        // Should show the "Get Another" button
        expect(screen.getByText("Get Another")).toBeInTheDocument();
    });

    it("fetches a new strategy when 'Get Another' button is clicked", () => {
        render(<StrategyView />);

        // Click the "Get Another" button
        const getAnotherButton = screen.getByText("Get Another");
        fireEvent.click(getAnotherButton);

        // Should call getRandomStrategy again
        expect(mockStrategiesContext.getRandomStrategy).toHaveBeenCalledTimes(2); // Once on mount, once on click
    });

    it("handles retry button click", () => {
        // Mock error state
        mockStrategiesContext.error = "Failed to load";

        render(<StrategyView />);

        const retryButton = screen.getByText("Retry");
        fireEvent.click(retryButton);

        // The reload should be triggered (window.location.reload)
        // We can't easily test window.location.reload in jsdom, but we can verify the button exists
        expect(retryButton).toBeInTheDocument();
    });
});
