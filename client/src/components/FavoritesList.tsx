import StrategyCard from "./StrategyCard.tsx";
import { useStrategies } from "../contexts/StrategiesContext.tsx";
import { StarIcon as SolidStar } from "@heroicons/react/16/solid";

export default function FavoritesList() {
    const { strategies, favorites, loading, error } = useStrategies();
    // Filter strategies where ID is in favorites array
    const favoriteStrategies = strategies.filter(strategy => favorites.includes(strategy.id));

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-primary">Loading favorite strategies...</p>
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
        <div className="max-w-6xl mx-auto px-4 pt-8 sm:pt-16 pb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-center mb-6 sm:mb-8">
                Your Favorite Strategies
            </h1>
            {favoriteStrategies.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-primary-light mb-4">No favorites yet</p>
                    <p className="text-sm text-primary-light/75">
                        Tap the {<SolidStar className="w-4 h-4 text-primary-light inline-block" />}{" "}
                        on any strategy to save it here
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {favoriteStrategies.map(favorite => (
                        <StrategyCard key={favorite.id} strategy={favorite} />
                    ))}
                </div>
            )}
        </div>
    );
}
