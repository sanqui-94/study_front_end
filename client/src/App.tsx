// client/src/App.tsx
import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import StrategyView from "./components/StrategyView";
import FavoritesList from "./components/FavoritesList";
import SearchStrategy from "./components/SearchStrategy";
import DailyReminder from "./components/DailyReminder";
import LoginModal from "./components/auth/LoginModal";
import UserProfile from "./components/auth/UserProfile";

function AppContent() {
    const { currentUser } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const linkBase = "px-4 py-2 rounded-full transition";
    
    return (
        <div className="min-h-screen bg-secondary font-inria text-primary">
            <nav className="bg-secondary py-4 shadow-sm">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-6">
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
                    
                    <div className="flex items-center">
                        {currentUser ? (
                            <UserProfile />
                        ) : (
                            <button
                                onClick={() => setShowLoginModal(true)}
                                className="px-4 py-2 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-secondary transition"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
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
            
            <LoginModal 
                isOpen={showLoginModal} 
                onClose={() => setShowLoginModal(false)} 
            />
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
