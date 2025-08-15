import { NavLink } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface MobileMenuProps {
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onToggle, onClose }: MobileMenuProps) {
    const linkBase = "block px-4 py-4 text-lg rounded-lg transition min-h-[44px] flex items-center";

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={onToggle}
                className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <XMarkIcon className="w-6 h-6 text-primary" />
                ) : (
                    <Bars3Icon className="w-6 h-6 text-primary" />
                )}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={onClose} />
                    <div className="fixed top-0 left-0 w-80 max-w-[85vw] h-full bg-secondary border-r border-primary/20 shadow-lg z-50 md:hidden">
                        <div className="flex items-center justify-between p-4 border-b border-primary/20">
                            <h2 className="text-lg font-medium text-primary">Menu</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-primary/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                aria-label="Close menu"
                            >
                                <XMarkIcon className="w-6 h-6 text-primary" />
                            </button>
                        </div>

                        <nav className="p-4 space-y-2">
                            <NavLink
                                to="/"
                                end
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `${linkBase} ${
                                        isActive
                                            ? "bg-primary text-secondary"
                                            : "hover:bg-primary/10 hover:text-primary-dark text-primary"
                                    }`
                                }
                            >
                                🏠 Home
                            </NavLink>
                            <NavLink
                                to="/favorites"
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `${linkBase} ${
                                        isActive
                                            ? "bg-primary text-secondary"
                                            : "hover:bg-primary/10 hover:text-primary-dark text-primary"
                                    }`
                                }
                            >
                                ⭐ Favorites
                            </NavLink>
                            <NavLink
                                to="/search"
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `${linkBase} ${
                                        isActive
                                            ? "bg-primary text-secondary"
                                            : "hover:bg-primary/10 hover:text-primary-dark text-primary"
                                    }`
                                }
                            >
                                🔍 Search
                            </NavLink>
                            <NavLink
                                to="/daily"
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `${linkBase} ${
                                        isActive
                                            ? "bg-primary text-secondary"
                                            : "hover:bg-primary/10 hover:text-primary-dark text-primary"
                                    }`
                                }
                            >
                                📅 Daily
                            </NavLink>
                        </nav>
                    </div>
                </>
            )}
        </>
    );
}
