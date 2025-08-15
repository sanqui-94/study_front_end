import { render, screen, fireEvent, mockStrategiesContext } from "../test-utils";
import SearchStrategy from "../../src/components/SearchStrategy";

// Mock the StrategyCard component
jest.mock("../../src/components/StrategyCard", () => {
    return jest.fn(() => <div data-testid="strategy-card">Mocked Strategy Card</div>);
});

describe("SearchStrategy", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset mock context
        mockStrategiesContext.strategies = [
            { id: 1, text: "First strategy" },
            { id: 2, text: "Second strategy about music" },
            { id: 3, text: "Third approach to creativity" },
        ];
    });

    it("renders search input correctly", () => {
        render(<SearchStrategy />);

        // Check if search input is rendered
        const searchInput = screen.getByPlaceholderText("Search strategies...");
        expect(searchInput).toBeInTheDocument();
        expect(searchInput).toHaveValue("");
    });

    it("displays no strategies initially with empty search", () => {
        render(<SearchStrategy />);

        // Should not display any strategy cards initially
        expect(screen.queryByTestId("strategy-card")).not.toBeInTheDocument();
    });

    it("displays matching strategies when search has results", () => {
        render(<SearchStrategy />);

        const searchInput = screen.getByPlaceholderText("Search strategies...");

        // Search for "music" which should match "Second strategy about music"
        fireEvent.change(searchInput, { target: { value: "music" } });

        // Should display strategy cards
        const strategyCards = screen.getAllByTestId("strategy-card");
        expect(strategyCards.length).toBeGreaterThan(0);
    });

    it("displays no strategies found message when search has no results", () => {
        render(<SearchStrategy />);

        const searchInput = screen.getByPlaceholderText("Search strategies...");

        // Search for something that won't match
        fireEvent.change(searchInput, { target: { value: "xyz123nonexistent" } });

        // Should show no strategies found message
        expect(screen.getByText("No strategies found.")).toBeInTheDocument();
    });

    it("clears results when search input is cleared", () => {
        render(<SearchStrategy />);

        const searchInput = screen.getByPlaceholderText("Search strategies...");

        // First search for something
        fireEvent.change(searchInput, { target: { value: "music" } });

        // Verify results are shown
        expect(screen.queryAllByTestId("strategy-card").length).toBeGreaterThan(0);

        // Clear the search
        fireEvent.change(searchInput, { target: { value: "" } });

        // Should not display any strategy cards
        expect(screen.queryByTestId("strategy-card")).not.toBeInTheDocument();
    });
});
