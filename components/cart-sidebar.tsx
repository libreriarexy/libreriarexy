"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export function CartSidebar() {
    const { items, total, removeFromCart, isCartOpen, setCartOpen } = useCart();
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setCartOpen(false);
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [setCartOpen]);

    // Close on click outside
    useEffect(() => {
        if (!isCartOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
                setCartOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isCartOpen, setCartOpen]);

    const priceFormatter = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    });

    return (
        <>
            {/* Background Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300",
                    isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            />

            {/* Sidebar Content */}
            <div
                ref={sidebarRef}
                className={cn(
                    "fixed top-0 right-0 z-[70] h-full w-full max-w-[400px] bg-background shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col",
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        <h2 className="text-lg font-bold">Carrito ({items.length})</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary-foreground hover:bg-black/10"
                        onClick={() => setCartOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                            <ShoppingCart className="h-12 w-12 opacity-20" />
                            <p>Tu carrito está vacío</p>
                            <Button variant="outline" onClick={() => setCartOpen(false)}>
                                Seguir comprando
                            </Button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.product.id} className="flex gap-4 border-b pb-4 group">
                                <div className="h-20 w-20 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                                    <img
                                        src={item.product.imageUrl || "https://placehold.co/100"}
                                        alt={item.product.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm line-clamp-2">{item.product.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Cant: {item.quantity} x {priceFormatter.format(item.product.price)}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="font-bold text-sm">
                                            {priceFormatter.format(item.product.price * item.quantity)}
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeFromCart(item.product.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t p-4 pt-6 bg-zinc-50 space-y-4">
                        <div className="flex items-center justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-primary">{priceFormatter.format(total)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Impuestos y envíos calculados en el checkout
                        </p>
                        <div className="grid gap-2">
                            <Link href="/cart" onClick={() => setCartOpen(false)}>
                                <Button className="w-full py-6 text-lg" size="lg">
                                    Finalizar Pedido
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setCartOpen(false)}
                            >
                                Seguir Comprando
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
