import {useDailyStrategy} from "../hooks/useDailyStrategy.ts";
import StrategyCard from "./StrategyCard.tsx";

export default function DailyReminder() {
    const {strategy} = useDailyStrategy();

    return (
        <div className="min-h-screen flex flex-col items-center">
                <h1 className="text-4xl text-center text-primary pt-16 pb-4 mb-4">Daily Oblique Strategy</h1>
            <div className="min-w-[400px]">
                {strategy ? <StrategyCard strategy={strategy}/> : <p className="col-span-full text-center text-primary-light">Loading...</p>}
            </div>
        </div>
    );
}
