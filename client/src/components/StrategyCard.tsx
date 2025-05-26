import type {Strategy} from "@shared/types/strategy";
import {useFavorites} from "../hooks/useFavorites.ts";

type Props = {
    strategy: Strategy,
};
export default function StrategyCard({strategy}: Readonly<Props>) {
    const { isFavorite, toggleFavorite } = useFavorites();

    return (
        <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
            <h3>
                Strategy #{strategy.id}{" "}
                <button onClick={() => toggleFavorite(strategy.id)}>
                    {isFavorite(strategy.id) ? "⭐️" : "☆"}
                </button>
            </h3>
            <p>{strategy.text}</p>
        </div>
    );
}
