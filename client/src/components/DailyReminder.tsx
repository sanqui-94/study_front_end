import {useDailyStrategy} from "../hooks/useDailyStrategy.ts";
import StrategyCard from "./StrategyCard.tsx";

export default function DailyReminder() {
    const {strategy} = useDailyStrategy();

    return (
        <div style={{ marginTop: "10px" }}>
            <h2>Daily Oblique Strategy</h2>
            {strategy ? <StrategyCard strategy={strategy}/> : <p>Loading...</p>}
        </div>
    );
}
