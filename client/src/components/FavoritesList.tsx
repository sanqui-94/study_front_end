import {useEffect, useState} from "react";
import StrategyCard from "./StrategyCard.tsx";
import {useFavorites} from "../hooks/useFavorites.ts";
import type {Strategy} from "@shared/types/strategy.ts";

export default function FavoritesList() {
    const {favorites} = useFavorites();
    const [favoriteStrategies, setFavoriteStrategies] = useState<Strategy[]>([]);

    useEffect(() => {
        fetch(`api/strategies`)
            .then(res => res.json())
            .then(data => setFavoriteStrategies(data))
            .catch(err => console.error(`Failed to load strategies: ${err}`));
    }, []);

    const filteredFavorites = favoriteStrategies.filter(strategy => favorites.includes(strategy.id));


    return (

        <div>
            <h2>Your Favorite Strategies</h2>
            {filteredFavorites.length === 0 ? (
                <p>No favorites yet</p>
            ) : (
                filteredFavorites.map((favorite) => (<StrategyCard key={favorite.id} strategy={favorite}/>))
            )}
        </div>
    );
}