"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/cart-context";
import { CartSidebar } from "@/components/cart-sidebar";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <CartProvider>
                {children}
                <CartSidebar />
            </CartProvider>
        </SessionProvider>
    );
}
