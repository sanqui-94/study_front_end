import { useEffect, useState, useRef } from "react";
import { useStrategies } from "../contexts/StrategiesContext";
import type { Strategy } from "@shared/types/strategy";
import StrategyCard from "./StrategyCard";

export default function StrategyView() {
    const [strategy, setStrategy] = useState<Strategy | null>(null);
    const { getRandomStrategy, loading, error } = useStrategies();
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    useEffect(() => {
        // Get initial random strategy when component mounts
        const randomStrategy = getRandomStrategy();
        if (randomStrategy) {
            setStrategy(randomStrategy);
        }
    }, [getRandomStrategy]);

    const handleNewStrategy = () => {
        const randomStrategy = getRandomStrategy();
        if (randomStrategy) {
            setStrategy(randomStrategy);
        }
    };

    // Touch/swipe handlers for mobile gestures
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartX.current || !touchStartY.current) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchStartX.current - touchEndX;
        const diffY = touchStartY.current - touchEndY;

        // Only trigger if horizontal swipe is dominant and significant
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            handleNewStrategy();
        }

        touchStartX.current = null;
        touchStartY.current = null;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-primary">Loading strategies...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-red-500">Error: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-secondary"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center px-4">
            <header className="text-center pt-8 sm:pt-16 pb-4 w-full max-w-4xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-primary">
                    Oblique Strategies
                </h1>
                <p className="mt-4 max-w-2xl text-sm sm:text-base text-primary-light mx-auto px-4">
                    A series of gnomic suggestions, aphorisms or remarks that can be used to break a
                    deadlock or dilemma situation in creative processes
                </p>
            </header>
            <main
                className="flex-1 flex flex-col items-center justify-start mt-4 w-full max-w-2xl"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="w-full">
                    {strategy ? <StrategyCard strategy={strategy} /> : <p>Loading…</p>}
                </div>
                <button
                    onClick={handleNewStrategy}
                    className="mt-6 px-8 py-4 rounded-full border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-secondary transition min-h-[44px] text-base sm:text-lg"
                >
                    Get Another
                </button>
                <p className="mt-3 text-xs text-primary-light/75 text-center md:hidden">
                    💡 Swipe left or right for a new strategy
                </p>
            </main>
        </div>
    );
}
