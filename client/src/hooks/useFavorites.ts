import {useEffect, useState} from "react";

const STORAGE_KEY = "favorite-strategy-ids";

export function useFavorites() {
    const [favorites, setFavorites] = useState<number[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (err) {
                console.error("Invalid localStorage data for favorites:", err);
            }
        }

    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }, [favorites]);


    const toggleFavorite = (id: number) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
        );
    }
    const isFavorite = (id: number) => favorites.includes(id);

    return {favorites, toggleFavorite, isFavorite};
}
