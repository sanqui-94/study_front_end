import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src", "<rootDir>/tests"],
    testMatch: ["**/?(*.)+(spec|test).[jt]s"],
    moduleFileExtensions: ["ts", "js"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    moduleNameMapper: {
        "^@shared/(.*)$": "<rootDir>/../shared/$1"
    }
};

export default config;
