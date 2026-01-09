"use client";
import { useCart } from "@/context/cart-context";

export function CartBadge() {
    const { itemCount } = useCart();
    if (itemCount === 0) return null;
    return (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            {itemCount}
        </span>
    );
}
