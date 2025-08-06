import type {Strategy} from "@shared/types/strategy";
import {useStrategies} from "../contexts/StrategiesContext";
import { StarIcon as SolidStar } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline";
import { useState } from "react";

type Props = { strategy: Strategy };

export default function StrategyCard({strategy}: Readonly<Props>) {
    const {favorites, toggleFavorite} = useStrategies();
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

    return (
        <div
            className="relative bg-primary text-secondary rounded-2xl p-8 shadow-lg w-full max-w-[550px] h-60 flex items-center justify-center"
        >
            <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className={`absolute top-4 right-4 text-2xl ${isTogglingFavorite ? "cursor-wait opacity-75" : "cursor-pointer"}`}
                aria-label="Toggle favorite"
            >
                {isTogglingFavorite ? (
                    <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                ) : isFavorite ? (
                    <SolidStar className="w-6 h-6 text-secondary-dark" />
                ) : (
                    <OutlineStar className="w-6 h-6 text-secondary" />
                )}
            </button>


            <div className="text-center space-y-2">
                <p className="text-xs">
                    Strategy #{strategy.id}
                </p>
                <p className="text-2xl">{strategy.text}</p>
            </div>
        </div>
    );
}
