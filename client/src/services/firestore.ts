import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    deleteDoc,
    query,
    orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface Strategy {
    id: number;
    text: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserFavorite {
    userId: string;
    strategyId: number;
    addedAt: Date;
}

export interface UserSettings {
    userId: string;
    theme: "light" | "dark";
    notifications: boolean;
    updatedAt: Date;
}

// Strategies (read-only, admin managed)
export async function getAllStrategies(): Promise<Strategy[]> {
    try {
        const strategiesRef = collection(db, "strategies");
        const q = query(strategiesRef, orderBy("id"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.data().id,
            text: doc.data().text,
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
        }));
    } catch (error) {
        console.error("Error fetching strategies:", error);
        throw new Error("Failed to fetch strategies from Firestore");
    }
}

export async function getStrategyById(id: number): Promise<Strategy | null> {
    try {
        const docRef = doc(db, "strategies", id.toString());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: data.id,
                text: data.text,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
            };
        }

        return null;
    } catch (error) {
        console.error("Error fetching strategy:", error);
        throw new Error("Failed to fetch strategy from Firestore");
    }
}

// User Favorites
export async function getUserFavorites(userId: string): Promise<number[]> {
    try {
        const favoritesRef = collection(db, "users", userId, "favorites");
        const snapshot = await getDocs(favoritesRef);

        return snapshot.docs.map(doc => doc.data().strategyId);
    } catch (error) {
        console.error("Error fetching user favorites:", error);
        throw new Error("Failed to fetch user favorites");
    }
}

export async function addToFavorites(userId: string, strategyId: number): Promise<void> {
    try {
        const docRef = doc(db, "users", userId, "favorites", strategyId.toString());
        await setDoc(docRef, {
            userId,
            strategyId,
            addedAt: new Date(),
        });
    } catch (error) {
        console.error("Error adding to favorites:", error);
        throw new Error("Failed to add strategy to favorites");
    }
}

export async function removeFromFavorites(userId: string, strategyId: number): Promise<void> {
    try {
        const docRef = doc(db, "users", userId, "favorites", strategyId.toString());
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error removing from favorites:", error);
        throw new Error("Failed to remove strategy from favorites");
    }
}

// User Settings
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
        const docRef = doc(db, "users", userId, "settings", "preferences");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                userId,
                theme: data.theme || "light",
                notifications: data.notifications || false,
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        }

        return null;
    } catch (error) {
        console.error("Error fetching user settings:", error);
        return null; // Return null instead of throwing for settings
    }
}

export async function updateUserSettings(
    userId: string,
    settings: Partial<Omit<UserSettings, "userId" | "updatedAt">>
): Promise<void> {
    try {
        const docRef = doc(db, "users", userId, "settings", "preferences");
        await setDoc(
            docRef,
            {
                ...settings,
                updatedAt: new Date(),
            },
            { merge: true }
        );
    } catch (error) {
        console.error("Error updating user settings:", error);
        throw new Error("Failed to update user settings");
    }
}

// Daily Strategy Tracking
export async function getTodaysStrategy(
    userId: string
): Promise<{ strategyId: number; date: string } | null> {
    try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
        const docRef = doc(db, "users", userId, "dailyStrategies", today);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                strategyId: data.strategyId,
                date: data.date,
            };
        }

        return null;
    } catch (error) {
        console.error("Error fetching today's strategy:", error);
        return null;
    }
}

export async function setTodaysStrategy(userId: string, strategyId: number): Promise<void> {
    try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
        const docRef = doc(db, "users", userId, "dailyStrategies", today);
        await setDoc(docRef, {
            strategyId,
            date: today,
            createdAt: new Date(),
        });
    } catch (error) {
        console.error("Error setting today's strategy:", error);
        throw new Error("Failed to set today's strategy");
    }
}
