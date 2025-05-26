import {useEffect, useState} from "react";

const STORAGE_KEY = "favorite-strategy-ids";

export function useFavorites() {
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setFavorites(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (id: number) => {
        setFavorites(prev => {
            if (prev.includes(id)) {
                return prev.filter(favId => favId !== id);
            } else {
                return [...prev, id];
            }
        });
    }
    const isFavorite = (id: number) => {
        return favorites.includes(id);
    }
     return { favorites, toggleFavorite, isFavorite };
}