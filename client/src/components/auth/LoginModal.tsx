import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { signInWithGoogle, signInWithGithub, signInWithEmail, signUpWithEmail, signInAsGuest } =
        useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isSignUp) {
                await signUpWithEmail(email, password);
            } else {
                await signInWithEmail(email, password);
            }
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialAuth = async (provider: "google" | "github") => {
        setLoading(true);
        setError("");

        try {
            if (provider === "google") {
                await signInWithGoogle();
            } else {
                await signInWithGithub();
            }
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleGuestAuth = async () => {
        setLoading(true);
        setError("");

        try {
            await signInAsGuest();
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-secondary rounded-lg p-8 max-w-md w-full mx-4 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-primary hover:text-primary-dark"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-primary mb-6 text-center">
                    {isSignUp ? "Create Account" : "Sign In"}
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={() => handleSocialAuth("google")}
                        disabled={loading}
                        className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <span>Continue with Google</span>
                    </button>

                    <button
                        onClick={() => handleSocialAuth("github")}
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <span>Continue with GitHub</span>
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-secondary text-primary-light">Or</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-secondary py-3 px-4 rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                        >
                            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
                        </button>
                    </form>

                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="w-full text-primary hover:text-primary-dark transition"
                    >
                        {isSignUp
                            ? "Already have an account? Sign In"
                            : "Don't have an account? Sign Up"}
                    </button>

                    <button
                        onClick={handleGuestAuth}
                        disabled={loading}
                        className="w-full text-primary-light hover:text-primary transition"
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    );
}
