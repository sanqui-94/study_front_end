import request from "supertest";
import express from "express";
import strategiesRouter from "../../src/routes/strategies";
import { ENV } from "../../src/env";
import fs from "fs";
import { Strategy } from "@shared/types/strategy";

// Mock fs module
jest.mock("fs");

const app = express();
app.use(express.json());
app.use("/api/strategies", strategiesRouter);

describe("/api/strategies routes", () => {
    // Mock strategies data
    const mockStrategies: Strategy[] = [
        { id: 1, text: "Abandon normal instruments" },
        { id: 2, text: "Accept advice" },
        { id: 3, text: "Accretion" }
    ];

    beforeEach(() => {
        // Setup the fs.readFileSync mock to return our mock strategies
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockStrategies));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all strategies on GET /api/strategies", async () => {
        const response = await request(app).get("/api/strategies");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(mockStrategies.length);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0]).toHaveProperty("text");
    });

    it("should return a random strategy on GET /api/strategies/random", async () => {
        const response = await request(app).get("/api/strategies/random");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("text");
        expect(mockStrategies).toContainEqual(response.body);
    });

    it("should return a specific strategy on GET /api/strategies/:id for valid ID", async () => {
        const validStrategy = mockStrategies[0];
        const response = await request(app).get(`/api/strategies/${validStrategy.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", validStrategy.id);
        expect(response.body).toHaveProperty("text", validStrategy.text);
    });

    it("should return 404 on GET to /api/strategies/:id for missing ID", async () => {
        const nonExistentId = 999; // ID that doesn't exist in our mock
        const response = await request(app).get(`/api/strategies/${nonExistentId}`);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error", "Strategy not found");
    });
});
