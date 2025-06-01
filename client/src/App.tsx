// client/src/App.tsx
import { Routes, Route, NavLink } from "react-router-dom";
import StrategyView from "./components/StrategyView";
import FavoritesList from "./components/FavoritesList";
import SearchStrategy from "./components/SearchStrategy";
import DailyReminder from "./components/DailyReminder";

export default function App() {
    const linkBase = "px-4 py-2 rounded-full transition";
    return (
        <div className="min-h-screen bg-secondary font-inria text-primary">
            <nav className="bg-secondary py-4 shadow-sm">
                <div className="container mx-auto flex items-center justify-start space-x-6">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `${linkBase} ${
                                isActive
                                    ? "bg-primary text-secondary"
                                    : "hover:bg-primary/10 hover:text-primary-dark"
                            }`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/favorites"
                        className={({ isActive }) =>
                            `${linkBase} ${
                                isActive
                                    ? "bg-primary text-secondary"
                                    : "hover:bg-primary/10 hover:text-primary-dark"
                            }`
                        }
                    >
                        Favorites
                    </NavLink>
                    <NavLink
                        to="/search"
                        className={({ isActive }) =>
                            `${linkBase} ${
                                isActive
                                    ? "bg-primary text-secondary"
                                    : "hover:bg-primary/10 hover:text-primary-dark"
                            }`
                        }
                    >
                        Search
                    </NavLink>
                    <NavLink
                        to="/daily"
                        className={({ isActive }) =>
                            `${linkBase} ${
                                isActive
                                    ? "bg-primary text-secondary"
                                    : "hover:bg-primary/10 hover:text-primary-dark"
                            }`
                        }
                    >
                        Daily
                    </NavLink>
                </div>
            </nav>

            <div className="container mx-auto px-4">
                <Routes>
                    <Route path="/" element={<StrategyView />} />
                    <Route path="/favorites" element={<FavoritesList />} />
                    <Route path="/search" element={<SearchStrategy />} />
                    <Route path="/daily" element={<DailyReminder />} />
                </Routes>
            </div>
        </div>
    );
}
