import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
    useMemo,
} from "react";
import {
    getAllStrategies,
    getUserFavorites,
    addToFavorites,
    removeFromFavorites,
    getTodaysStrategy,
    setTodaysStrategy,
    type Strategy,
} from "../services/firestore";
import { useAuth } from "./AuthContext";

interface StrategiesContextType {
    strategies: Strategy[];
    favorites: number[];
    todayStrategy: { strategyId: number; date: string } | null;
    loading: boolean;
    error: string | null;

    // Strategy operations
    fetchStrategies: () => Promise<void>;
    getStrategy: (id: number) => Strategy | undefined;

    // Favorites operations
    toggleFavorite: (strategyId: number) => Promise<void>;
    isFavorite: (strategyId: number) => boolean;
    refreshFavorites: () => Promise<void>;

    // Daily strategy operations
    getRandomStrategy: () => Strategy | null;
    setDailyStrategy: (strategyId: number) => Promise<void>;
    refreshTodayStrategy: () => Promise<void>;
}

const StrategiesContext = createContext<StrategiesContextType | undefined>(undefined);

export function useStrategies() {
    const context = useContext(StrategiesContext);
    if (context === undefined) {
        throw new Error("useStrategies must be used within a StrategiesProvider");
    }
    return context;
}

interface StrategiesProviderProps {
    children: ReactNode;
}

export function StrategiesProvider({ children }: StrategiesProviderProps) {
    const { currentUser } = useAuth();
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [todayStrategy, setTodayStrategyState] = useState<{
        strategyId: number;
        date: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all strategies from Firestore
    const fetchStrategies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedStrategies = await getAllStrategies();
            setStrategies(fetchedStrategies);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch strategies";
            setError(errorMessage);
            console.error("Error fetching strategies:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get a specific strategy by ID
    const getStrategy = useCallback(
        (id: number): Strategy | undefined => {
            return strategies.find(strategy => strategy.id === id);
        },
        [strategies]
    );

    // Fetch user favorites
    const refreshFavorites = useCallback(async () => {
        if (!currentUser) {
            setFavorites([]);
            return;
        }

        try {
            const userFavorites = await getUserFavorites(currentUser.uid);
            setFavorites(userFavorites);
        } catch (err) {
            console.error("Error fetching favorites:", err);
            setFavorites([]);
        }
    }, [currentUser]);

    // Toggle favorite status
    const toggleFavorite = useCallback(
        async (strategyId: number) => {
            if (!currentUser) {
                throw new Error("Must be logged in to manage favorites");
            }

            try {
                const isCurrentlyFavorite = favorites.includes(strategyId);

                if (isCurrentlyFavorite) {
                    await removeFromFavorites(currentUser.uid, strategyId);
                    setFavorites(prev => prev.filter(id => id !== strategyId));
                } else {
                    await addToFavorites(currentUser.uid, strategyId);
                    setFavorites(prev => [...prev, strategyId]);
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Failed to update favorites";
                setError(errorMessage);
                throw new Error(errorMessage);
            }
        },
        [currentUser, favorites]
    );

    // Check if a strategy is favorited
    const isFavorite = useCallback(
        (strategyId: number): boolean => {
            return favorites.includes(strategyId);
        },
        [favorites]
    );

    // Get random strategy
    const getRandomStrategy = useCallback((): Strategy | null => {
        if (strategies.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * strategies.length);
        return strategies[randomIndex];
    }, [strategies]);

    // Set daily strategy
    const setDailyStrategy = useCallback(
        async (strategyId: number) => {
            if (!currentUser) {
                throw new Error("Must be logged in to set daily strategy");
            }

            try {
                const today = new Date().toISOString().split("T")[0];
                await setTodaysStrategy(currentUser.uid, strategyId);
                setTodayStrategyState({ strategyId, date: today });
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Failed to set daily strategy";
                setError(errorMessage);
                throw new Error(errorMessage);
            }
        },
        [currentUser]
    );

    // Refresh today's strategy
    const refreshTodayStrategy = useCallback(async () => {
        if (!currentUser) {
            setTodayStrategyState(null);
            return;
        }

        try {
            const todayData = await getTodaysStrategy(currentUser.uid);
            setTodayStrategyState(todayData);
        } catch (err) {
            console.error("Error fetching today's strategy:", err);
            setTodayStrategyState(null);
        }
    }, [currentUser]);

    // Initialize data when component mounts
    useEffect(() => {
        fetchStrategies();
    }, [fetchStrategies]);

    useEffect(() => {
        if (currentUser) {
            refreshFavorites();
            refreshTodayStrategy();
        } else {
            setFavorites([]);
            setTodayStrategyState(null);
        }
    }, [currentUser, refreshFavorites, refreshTodayStrategy]);

    const value: StrategiesContextType = useMemo(
        () => ({
            strategies,
            favorites,
            todayStrategy,
            loading,
            error,
            fetchStrategies,
            getStrategy,
            toggleFavorite,
            isFavorite,
            refreshFavorites,
            getRandomStrategy,
            setDailyStrategy,
            refreshTodayStrategy,
        }),
        [
            strategies,
            favorites,
            todayStrategy,
            loading,
            error,
            fetchStrategies,
            getStrategy,
            toggleFavorite,
            isFavorite,
            refreshFavorites,
            getRandomStrategy,
            setDailyStrategy,
            refreshTodayStrategy,
        ]
    );

    return <StrategiesContext.Provider value={value}>{children}</StrategiesContext.Provider>;
}
