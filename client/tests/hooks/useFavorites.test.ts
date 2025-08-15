import { act, renderHook } from "@testing-library/react";
import { useFavorites } from "../../src/hooks/useFavorites";

// Helper to mock localStorage
function mockLocalStorage(initial: string | null) {
    const store: Record<string, string> = {};
    return {
        getItem: (key: string) => (key in store ? store[key] : initial),
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        clear: () => {
            for (const key in store) delete store[key];
        },
    };
}

describe("useFavorites hook", () => {
    beforeAll(() => {
        // Replace window.localStorage with our mock
        Object.defineProperty(window, "localStorage", {
            value: mockLocalStorage(null),
            writable: true,
        });
    });

    afterEach(() => {
        window.localStorage.clear();
    });

    it("initializes with empty array when localStorage is empty", () => {
        const { result } = renderHook(() => useFavorites());
        expect(result.current.favorites).toEqual([]);
        expect(window.localStorage.getItem("favorite-strategy-ids")).toEqual("[]");
    });

    it("reads existing favorites from localStorage", () => {
        window.localStorage.setItem("favorite-strategy-ids", JSON.stringify([5, 10]));
        const { result } = renderHook(() => useFavorites());
        expect(result.current.favorites).toEqual([5, 10]);
    });

    it("toggles a strategy ID correctly", () => {
        const { result } = renderHook(() => useFavorites());

        // Add ID 3
        act(() => {
            result.current.toggleFavorite(3);
        });
        expect(result.current.favorites).toEqual([3]);
        expect(window.localStorage.getItem("favorite-strategy-ids")).toEqual(JSON.stringify([3]));

        // Remove ID 3
        act(() => {
            result.current.toggleFavorite(3);
        });
        expect(result.current.favorites).toEqual([]);
        expect(window.localStorage.getItem("favorite-strategy-ids")).toEqual(JSON.stringify([]));
    });
});
