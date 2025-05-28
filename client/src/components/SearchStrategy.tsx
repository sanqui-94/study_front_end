import {useEffect, useMemo, useState} from "react";
import type {Strategy} from "@shared/types/strategy.ts";
import StrategyCard from "./StrategyCard.tsx";
import Fuse from "fuse.js";

export default function SearchStrategy() {
    const [searchTerm, setSearchTerm] = useState("");
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [filteredStrategies, setFilteredStrategies] = useState<Strategy[]>([]);

    useEffect(() => {
        fetch("api/strategies")
            .then(res => res.json())
            .then(data => setStrategies(data))
            .catch(err => console.error("There was an error fetching strategies:", err));
    }, []);

    const fuse = useMemo(() => {
        return new Fuse(strategies, { keys: ["text"], threshold: 0.6 });
    }, [strategies]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredStrategies([]);
            return;
        }

        const results = fuse.search(searchTerm);
        setFilteredStrategies(results.map(r => r.item));
    }, [searchTerm, fuse]);

    return (
        <div>
            <h2>Search Strategies</h2>
            <input
                type="text"
                value={searchTerm}
                placeholder="Search strategies..."
                style={{width: "100%", padding: "8px", boxSizing: "border-box"}}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div style={{marginTop: "10px"}}>
                {filteredStrategies.length === 0 && searchTerm ? (
                    <p>No Strategies found</p>
                ) : (
                    filteredStrategies.map((strategy) => (
                        <StrategyCard strategy={strategy} key={strategy.id}/>
                    ))
                )}
            </div>
        </div>
    );
}
