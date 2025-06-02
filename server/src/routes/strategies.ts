import { Router } from "express";
import fs from "fs";
import path from "path";
import { Strategy } from "@shared/types/strategy";

const router = Router();

const strategiesDir = path.join(__dirname, "../data/strategies.json");
const strategies: Strategy[] = JSON.parse(fs.readFileSync(strategiesDir, "utf-8"));

// GET all strategies
router.get("/", (_req, res) =>{
    res.json(strategies);
});

// GET random strategy
router.get("/random", (_req, res) => {
    const random = strategies[Math.floor(Math.random() * strategies.length)];
    res.json(random);
});

// GET a single strategy by id
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const strategyFound: Strategy | undefined  = strategies.find((strategy: Strategy) => strategy.id === id);

    if (strategyFound) {
        res.json(strategyFound)
    } else {
        res.status(404).json({ error: "Strategy not found" });
    }
});

export default router;
