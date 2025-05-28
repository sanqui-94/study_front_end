import { useEffect, useState } from "react";
import type { Strategy } from "@shared/types/strategy";
import StrategyCard from "./StrategyCard";

export default function StrategyView() {
    const [strategy, setStrategy] = useState<Strategy | null>(null);

    useEffect(() => {
        fetch("/api/strategies/random")
            .then(res => res.json())
            .then(setStrategy)
            .catch(err => console.error("Failed to fetch strategy", err));
    }, []);

    return (
        <div style={{ maxWidth: 600, margin: "2rem auto" }}>
            <h1>Oblique Strategy of the Moment</h1>
            {strategy ? <StrategyCard strategy={strategy} /> : <p>Loading…</p>}
        </div>
    );
}
