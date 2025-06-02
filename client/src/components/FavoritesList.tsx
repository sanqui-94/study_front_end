import {useEffect, useState} from "react";
import StrategyCard from "./StrategyCard.tsx";
import {useFavorites} from "../hooks/useFavorites.ts";
import type {Strategy} from "@shared/types/strategy.ts";

export default function FavoritesList() {
    const {favorites} = useFavorites();
    const [favoriteStrategies, setFavoriteStrategies] = useState<Strategy[]>([]);

    useEffect(() => {
        fetch("api/strategies")
            .then(res => res.json())
            .then(data => setFavoriteStrategies(data))
            .catch(err => console.error(`Failed to load strategies: ${err}`));
    }, []);

    const filteredFavorites = favoriteStrategies.filter(strategy => favorites.includes(strategy.id));


    return (
        <div className="max-w-5xl mx-auto px-4 pt-16 pb-4">
            <h1 className="text-4xl mb-4">Your Favorite Strategies</h1>
            {filteredFavorites.length === 0 ? (
                <p className="text-lg text-center text-gray-600">No favorites yet</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">

                    {filteredFavorites.map((favorite) => (<StrategyCard key={favorite.id} strategy={favorite}/>))}
                </div>
            )}
        </div>
    );
}
