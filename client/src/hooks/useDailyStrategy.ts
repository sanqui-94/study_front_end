import type {Strategy} from "@shared/types/strategy.ts";
import {useEffect, useState} from "react";

const STORAGE_KEY = "daily-strategy";

type Stored = {
    id: number;
    date: string; // ISO
};


export function useDailyStrategy() {
    const  [strategy, setStrategy] = useState<Strategy | null>(null);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];

        const storedStrategy = localStorage.getItem(STORAGE_KEY);
        const parsed: Stored | null = storedStrategy ? JSON.parse(storedStrategy) : null;

        const loadStrategy = async () => {
            try {
                // reuse stored strategy if present
                if (parsed?.date === today) {
                    const response = await fetch(`/api/strategies/${parsed.id}`);
                    const data = await response.json();
                    setStrategy(data);
                } else {
                    const response = await fetch("/api/strategies/random");
                    const data = await response.json();
                    setStrategy(data);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: data.id, date: today }));
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadStrategy();
    }, []);

    return  { strategy };
}
