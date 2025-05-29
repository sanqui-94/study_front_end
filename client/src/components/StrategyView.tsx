import {useEffect, useState} from "react";
import type {Strategy} from "@shared/types/strategy";
import StrategyCard from "./StrategyCard";

export default function StrategyView() {
    const [strategy, setStrategy] = useState<Strategy | null>(null);

    useEffect(() => {
        fetch("/api/strategies/random")
            .then(res => res.json())
            .then(setStrategy)
            .catch(err => console.error("Failed to fetch strategy", err));
    }, []);

    const handleClick = async () => {
        try {
            const response = await fetch("/api/strategies/random");
            const data = await response.json();
            setStrategy(data);

        } catch (err) {
            console.error("Failed to fetch new strategy", err);
        }
    };


    return(
        <div className="min-h-screen flex flex-col items-center">
            <header className="text-center pt-16 pb-4">
                <h1 className="text-4xl leading-[1.6] tracking-[0.25em] text-primary">
                    Oblique Strategies
                </h1>
                <p className="mt-4 max-w-2xl text-base text-primary-light mx-auto">
                    A series of gnomic suggestions, aphorisms or remarks that can be used
                    to break a deadlock or dilemma situation in creative processes
                </p>
            </header>
            <main className="flex-1 flex flex-col items-center justify-start mt-4">
                {strategy ? <StrategyCard strategy={strategy}/> : <p>Loading…</p>}
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
