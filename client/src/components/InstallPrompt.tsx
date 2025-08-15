import { useState, useEffect } from "react";
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowPrompt(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            console.log("User accepted the install prompt");
        } else {
            console.log("User dismissed the install prompt");
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        setDeferredPrompt(null);
    };

    if (!showPrompt || !deferredPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 max-w-sm mx-auto bg-primary text-secondary p-4 rounded-lg shadow-lg border-2 border-secondary z-50">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                    <ArrowDownTrayIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <h3 className="font-semibold text-sm">Install Oblique Strategies</h3>
                </div>
                <button
                    onClick={handleDismiss}
                    className="text-secondary hover:text-secondary-light transition-colors"
                    aria-label="Dismiss install prompt"
                >
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>

            <p className="text-xs text-secondary-light mb-3">
                Add to your home screen for quick access and offline use.
            </p>

            <div className="flex gap-2">
                <button
                    onClick={handleInstallClick}
                    className="flex-1 bg-secondary text-primary py-2 px-3 rounded text-sm font-medium hover:bg-secondary-light transition-colors"
                >
                    Install
                </button>
                <button
                    onClick={handleDismiss}
                    className="px-3 py-2 text-xs text-secondary-light hover:text-secondary transition-colors"
                >
                    Later
                </button>
            </div>
        </div>
    );
}
