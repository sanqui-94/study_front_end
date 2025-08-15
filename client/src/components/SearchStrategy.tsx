import { useEffect, useMemo, useState } from "react";
import type { Strategy } from "@shared/types/strategy";
import StrategyCard from "./StrategyCard";
import Fuse from "fuse.js";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useStrategies } from "../contexts/StrategiesContext.tsx";

export default function SearchStrategy() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStrategies, setFilteredStrategies] = useState<Strategy[]>([]);
    const { strategies } = useStrategies();

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
        setFilteredStrategies(results.map(r => r.item));
    }, [searchTerm, fuse]);

    return (
        <div className="max-w-6xl mx-auto px-4 pt-8 sm:pt-16 pb-4">
            <div className="relative max-w-lg mx-auto mb-8">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-secondary-dark" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search strategies..."
                    className="w-full pl-12 pr-6 py-4 bg-secondary border-2 border-primary rounded-full shadow-sm placeholder-primary-light focus:outline-none focus:ring-2 focus:ring-primary transition text-base min-h-[44px]"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {searchTerm && filteredStrategies.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-lg text-primary-light mb-2">No strategies found.</p>
                        <p className="text-sm text-primary-light/75">Try a different search term</p>
                    </div>
                ) : (
                    filteredStrategies.map(strategy => (
                        <StrategyCard key={strategy.id} strategy={strategy} />
                    ))
                )}
            </div>
        </div>
    );
}
