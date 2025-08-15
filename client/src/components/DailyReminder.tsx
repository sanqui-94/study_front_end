import { useDailyStrategy } from "../hooks/useDailyStrategy.ts";
import StrategyCard from "./StrategyCard.tsx";

export default function DailyReminder() {
    const { strategy } = useDailyStrategy();

    return (
        <div className="min-h-screen flex flex-col items-center px-4">
            <header className="text-center pt-8 sm:pt-16 pb-4 w-full max-w-4xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-primary mb-4">
                    Daily Oblique Strategy
                </h1>
                <p className="text-sm sm:text-base text-primary-light">Your strategy for today</p>
            </header>
            <main className="flex-1 flex flex-col items-center justify-start mt-4 w-full max-w-2xl">
                <div className="w-full">
                    {strategy ? (
                        <StrategyCard strategy={strategy} />
                    ) : (
                        <p className="text-center text-primary-light">Loading...</p>
                    )}
                </div>
                {strategy && (
                    <p className="mt-6 text-center text-sm text-primary-light/75 max-w-md">
                        This is your strategy for today. Come back tomorrow for a new one!
                    </p>
                )}
            </main>
        </div>
    );
}
