
import StrategyCard from "./StrategyCard.tsx";
import {useStrategies} from "../contexts/StrategiesContext.tsx";

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
        <div className="max-w-5xl mx-auto px-4 pt-16 pb-4">
            <h1 className="text-4xl text-center mb-4">Your Favorite Strategies</h1>
            {favoriteStrategies.length === 0 ? (
                <p className="text-lg text-center text-gray-600">No favorites yet</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">

                    {favoriteStrategies.map((favorite) => (<StrategyCard key={favorite.id} strategy={favorite}/>))}
                </div>
            )}
        </div>
    );
}
