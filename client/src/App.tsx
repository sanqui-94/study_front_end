// client/src/App.tsx
import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { StrategiesProvider } from "./contexts/StrategiesContext";
import StrategyView from "./components/StrategyView";
import FavoritesList from "./components/FavoritesList";
import SearchStrategy from "./components/SearchStrategy";
import DailyReminder from "./components/DailyReminder";
import LoginModal from "./components/auth/LoginModal";
import UserProfile from "./components/auth/UserProfile";
import InstallPrompt from "./components/InstallPrompt";
import MobileMenu from "./components/MobileMenu";

function AppContent() {
    const { currentUser } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const linkBase = "px-4 py-2 rounded-full transition min-h-[44px] flex items-center";

    return (
        <div className="min-h-screen bg-secondary font-inria text-primary">
            <nav className="bg-secondary py-4 shadow-sm relative">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
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

                    {/* Mobile Logo/Brand */}
                    <div className="md:hidden">
                        <span className="text-lg font-medium text-primary">Oblique Strategies</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* User Profile/Sign In */}
                        {currentUser ? (
                            <UserProfile />
                        ) : (
                            <button
                                onClick={() => setShowLoginModal(true)}
                                className="px-4 py-2 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-secondary transition min-h-[44px] text-sm sm:text-base"
                            >
                                Sign In
                            </button>
                        )}

                        {/* Mobile Menu */}
                        <MobileMenu
                            isOpen={isMobileMenuOpen}
                            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            onClose={() => setIsMobileMenuOpen(false)}
                        />
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

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

            <InstallPrompt />
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <StrategiesProvider>
                <AppContent />
            </StrategiesProvider>
        </AuthProvider>
    );
}
