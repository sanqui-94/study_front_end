import { useEffect, useState} from "react";
import type {Strategy} from "@shared/types/strategy.ts";
import StrategyCard from "./components/StrategyCard.tsx";

const API_URL = import.meta.env.VITE_API_URL;


export default function App() {
    const [strategy, setStrategy]  = useState<Strategy | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/strategies/random`)
            .then(res => res.json())
            .then(data => setStrategy(data))
            .catch(err => console.error(`Failed to fetch strategy: ${err}`));
    }, []);

    return (
        <div className="App">
            <div style={{ maxWidth: 600, margin: '2rem auto' }}>
                <h1>Oblique Strategy of the Moment</h1>
                {strategy ? <StrategyCard strategy={strategy} /> : <p>Loading…</p>}
            </div>
        </div>
    );
}
