import { useEffect, useState } from "react";
import { useStrategies } from "../contexts/StrategiesContext";
import type { Strategy } from "@shared/types/strategy";
import StrategyCard from "./StrategyCard";

export default function StrategyView() {
    const [strategy, setStrategy] = useState<Strategy | null>(null);
    const { getRandomStrategy, loading, error } = useStrategies();

    useEffect(() => {
        // Get initial random strategy when component mounts
        const randomStrategy = getRandomStrategy();
        if (randomStrategy) {
            setStrategy(randomStrategy);
        }
    }, [getRandomStrategy]);

    const handleClick = () => {
        const randomStrategy = getRandomStrategy();
        if (randomStrategy) {
            setStrategy(randomStrategy);
        }
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


    return(
        <div className="min-h-screen flex flex-col items-center">
            <header className="text-center pt-16 pb-4">
                <h1 className="text-4xl text-primary">
                    Oblique Strategies
                </h1>
                <p className="mt-4 max-w-2xl text-base text-primary-light mx-auto">
                    A series of gnomic suggestions, aphorisms or remarks that can be used
                    to break a deadlock or dilemma situation in creative processes
                </p>
            </header>
            <main className="flex-1 flex flex-col items-center justify-start mt-4">
                <div className="min-w-[400px]">
                    {strategy ? <StrategyCard strategy={strategy}/> : <p>Loading…</p>}
                </div>
                <button
                    onClick={handleClick}
                    className="mt-6 px-6 py-3 rounded-full border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-secondary transition"
                >
                    Get Another
                </button>
            </main>
        </div>
    );
}
