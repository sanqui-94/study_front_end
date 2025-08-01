import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { UserIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export default function UserProfile() {
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!currentUser) return null;

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const displayName = currentUser.displayName || 
                     (currentUser.isAnonymous ? "Guest User" : currentUser.email);
  
  const isAnonymous = currentUser.isAnonymous;

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition"
      >
        {currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <UserIcon className="w-6 h-6 text-primary" />
        )}
        <span className="text-primary text-sm max-w-32 truncate">
          {displayName}
        </span>
        <ChevronDownIcon className="w-4 h-4 text-primary" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-secondary border border-primary/20 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-primary/20">
            <p className="text-sm font-medium text-primary">{displayName}</p>
            {!isAnonymous && currentUser.email && (
              <p className="text-xs text-primary-light">{currentUser.email}</p>
            )}
            {isAnonymous && (
              <p className="text-xs text-primary-light">Anonymous session</p>
            )}
          </div>
          
          <div className="py-2">
            {isAnonymous && (
              <button
                onClick={() => {/* Handle account creation */}}
                className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary/10 transition"
              >
                Create Account
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary/10 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}