"use client";

import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";

export function AnnouncementBanner() {
    const [isVisible, setIsVisible] = useState(true);

    // Use localStorage to remember if the user closed it (optional, but better UX)
    useEffect(() => {
        const closed = localStorage.getItem("announcement-closed");
        if (closed) {
            setIsVisible(false);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem("announcement-closed", "true");
    };

    if (!isVisible) return null;

    return (
        <div className="bg-[#facc15] text-[#122241] py-2 px-4 shadow-sm relative overflow-hidden group">
            {/* Subtle shine effect */}
            <div className="absolute inset-0 bg-white/10 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

            <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 relative z-10">
                <AlertCircle className="h-4 w-4 animate-pulse shrink-0" />
                <p className="text-[11px] md:text-xs font-black uppercase tracking-wider text-center pr-8 sm:pr-0">
                    Atención: Debido a la fluctuación constante de costos, los precios pueden sufrir cambios sin previo aviso.
                </p>

                <button
                    onClick={handleClose}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors"
                    aria-label="Cerrar aviso"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
