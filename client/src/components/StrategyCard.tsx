import type {Strategy} from "@shared/types/strategy";
import {useFavorites} from "../hooks/useFavorites";
import { StarIcon as SolidStar } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline";

type Props = { strategy: Strategy };

export default function StrategyCard({strategy}: Readonly<Props>) {
    const {isFavorite, toggleFavorite} = useFavorites();

    return (
        <div
            className="relative bg-primary text-secondary rounded-2xl p-8 shadow-lg w-full max-w-[550px] h-60 flex items-center justify-center"
        >
            <button
                onClick={() => toggleFavorite(strategy.id)}
                className="absolute top-4 right-4 text-2xl"
                aria-label="Toggle favorite"
            >
                {isFavorite(strategy.id) ? (
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
