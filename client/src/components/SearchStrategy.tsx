import { useEffect, useMemo, useState } from "react";
import type { Strategy } from "@shared/types/strategy";
import StrategyCard from "./StrategyCard";
import Fuse from "fuse.js";
import {MagnifyingGlassIcon} from "@heroicons/react/16/solid";

const base = import.meta.env.VITE_API_URL;
export default function SearchStrategy() {
    const [searchTerm, setSearchTerm] = useState("");
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [filteredStrategies, setFilteredStrategies] = useState<Strategy[]>([]);

    useEffect(() => {
        fetch(`${base}/api/strategies`)
            .then((res) => res.json())
            .then((data) => setStrategies(data))
            .catch((err) =>
                console.error("There was an error fetching strategies:", err)
            );
    }, []);

    const fuse = useMemo(
        () => new Fuse<Strategy>(strategies, { keys: ["text"], threshold: 0.6 }),
        [strategies]
    );

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredStrategies([]);
            return;
        }
        const results = fuse.search(searchTerm);
        setFilteredStrategies(results.map((r) => r.item));
    }, [searchTerm, fuse]);

    return (
        <div className="max-w-5xl mx-auto px-4 pt-16 pb-4">
            <div className="relative max-w-md mx-auto mb-6">
                <MagnifyingGlassIcon
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-secondary-dark"
                />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search strategies..."
                    className="
      w-full
      pl-12 pr-6 py-3
      bg-secondary
      border-2 border-primary
      rounded-full
      shadow-sm
      placeholder-primary-light
      focus:outline-none focus:ring-2 focus:ring-primary
      transition
    "
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                {searchTerm && filteredStrategies.length === 0 ? (
                    <p className="col-span-full text-center text-primary-light">
                        No strategies found.
                    </p>
                ) : (
                    filteredStrategies.map((strategy) => (
                        <StrategyCard key={strategy.id} strategy={strategy} />
                    ))
                )}
            </div>
        </div>
    );
}
