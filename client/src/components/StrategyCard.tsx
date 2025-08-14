import type { Strategy } from "@shared/types/strategy";
import { useStrategies } from "../contexts/StrategiesContext";
import { StarIcon as SolidStar } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.tsx";

type Props = { strategy: Strategy };

export default function StrategyCard({ strategy }: Readonly<Props>) {
    const { favorites, toggleFavorite } = useStrategies();
    const { currentUser } = useAuth();
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
    const isFavorite = favorites.includes(strategy.id);

    const handleToggleFavorite = async () => {
        if (isTogglingFavorite) return;

        setIsTogglingFavorite(true);
        try {
            await toggleFavorite(strategy.id);
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    const renderFavoriteIcon = () => {
        if (isTogglingFavorite) {
            return (
                <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            );
        }
        if (isFavorite) {
            return <SolidStar className="w-6 h-6 text-secondary-dark" />;
        }
        return <OutlineStar className="w-6 h-6 text-secondary" />;
    };

    return (
        <div className="relative bg-primary text-secondary rounded-2xl p-6 sm:p-8 shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-[550px] min-h-[240px] sm:h-60 flex items-center justify-center mx-auto">
            {currentUser && (
                <button
                    onClick={handleToggleFavorite}
                    disabled={isTogglingFavorite}
                    className={`absolute top-4 right-4 p-2 rounded-full hover:bg-secondary/20 transition-colors ${isTogglingFavorite ? "cursor-wait opacity-75" : "cursor-pointer"} min-w-[44px] min-h-[44px] flex items-center justify-center`}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    {renderFavoriteIcon()}
                </button>
            )}

            <div className="text-center space-y-2 px-2">
                <p className="text-xs opacity-75">Strategy #{strategy.id}</p>
                <p className="text-lg sm:text-xl md:text-2xl leading-relaxed">{strategy.text}</p>
            </div>
        </div>
    );
}
