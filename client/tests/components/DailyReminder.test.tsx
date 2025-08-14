import { render, screen } from "@testing-library/react";
import DailyReminder from "../../src/components/DailyReminder";
import { useDailyStrategy } from "../../src/hooks/useDailyStrategy";

// Mock the dependent modules
jest.mock("../../src/hooks/useDailyStrategy");
jest.mock("../../src/components/StrategyCard", () => {
    return {
        __esModule: true,
        default: jest.fn(() => <div data-testid="strategy-card">Mocked Strategy Card</div>),
    };
});

// Import after mocking to get the mock
import StrategyCard from "../../src/components/StrategyCard";

describe("DailyReminder", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("displays loading message when strategy is null", () => {
        // Mock the hook to return null strategy
        (useDailyStrategy as jest.Mock).mockReturnValue({ strategy: null });

        render(<DailyReminder />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
        expect(screen.queryByTestId("strategy-card")).not.toBeInTheDocument();
    });

    it("renders StrategyCard when strategy is available", () => {
        // Mock strategy data
        const mockStrategy = { id: 123, text: "Test Strategy" };

        // Mock the hook to return the strategy
        (useDailyStrategy as jest.Mock).mockReturnValue({ strategy: mockStrategy });

        render(<DailyReminder />);

        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        expect(screen.getByTestId("strategy-card")).toBeInTheDocument();

        // Verify StrategyCard was called with the correct props
        expect(StrategyCard).toHaveBeenCalledWith({ strategy: mockStrategy }, undefined);
    });

    it("renders the correct heading", () => {
        // Mock the hook to return null strategy
        (useDailyStrategy as jest.Mock).mockReturnValue({ strategy: null });

        render(<DailyReminder />);

        expect(
            screen.getByRole("heading", { name: /daily oblique strategy/i })
        ).toBeInTheDocument();
    });
});
