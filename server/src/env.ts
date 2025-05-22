import dotenv from "dotenv";
dotenv.config();

function getEnv(key: string, fallBack?: string): string {
    const value = process.env[key];
    if (!value && fallBack === undefined) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value ?? fallBack!;
}

export const ENV = {
    PORT: getEnv("PORT", "3001"),
    CLIENT_ORIGIN: getEnv("CLIENT_ORIGIN", "*"),
};
