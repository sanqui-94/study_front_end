import type { Strategy } from "@shared/types/strategy.ts";
import { useEffect, useState } from "react";
import { useStrategies } from "../contexts/StrategiesContext.tsx";

const STORAGE_KEY = "daily-strategy";

type Stored = {
    id: number;
    date: string; // ISO
};

export function useDailyStrategy() {
    const [strategy, setStrategy] = useState<Strategy | null>(null);
    const { getStrategy, getRandomStrategy } = useStrategies();

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];

        const storedStrategy = localStorage.getItem(STORAGE_KEY);
        const parsed: Stored | null = storedStrategy ? JSON.parse(storedStrategy) : null;

        const loadStrategy = async () => {
            try {
                // reuse stored strategy if present
                if (parsed?.date === today) {
                    const strategy = getStrategy(parsed.id);
                    if (strategy) {
                        setStrategy(strategy);
                        return;
                    }
                    // Fall through to get a new strategy if stored one doesn't exist
                }

                // Get a new random strategy
                const strategy = getRandomStrategy();
                if (strategy) {
                    setStrategy(strategy);
                    localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify({ id: strategy.id, date: today })
                    );
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadStrategy();
    }, [getRandomStrategy, getStrategy]);

    return { strategy };
}
