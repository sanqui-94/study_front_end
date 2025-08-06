import React from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";


// Mock the StrategiesContext
export const mockStrategiesContext = {
  strategies: [
    { id: 1, text: "Strategy 1" },
    { id: 2, text: "Strategy 2" },
    { id: 3, text: "Strategy 3" }
  ],
  favorites: [] as number[],
  loading: false,
  error: null as string | null,
  toggleFavorite: jest.fn(),
  isFavorite: jest.fn(() => false),
  getRandomStrategy: jest.fn(() => ({ id: 1, text: "Strategy 1" })),
  getStrategy: jest.fn((id: number) => ({ id, text: `Strategy ${id}` }) as { id: number; text: string } | null)
};

// Mock the StrategiesContext at module level
jest.mock("../src/contexts/StrategiesContext", () => ({
  StrategiesProvider: ({ children }: { children: React.ReactNode }) => children,
  useStrategies: () => mockStrategiesContext
}));

// Custom render function with providers
const customRender = (ui: React.ReactElement, options?: RenderOptions) => {
  return render(ui, options);
};

export * from "@testing-library/react";
export { customRender as render };
