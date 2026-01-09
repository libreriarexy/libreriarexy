"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/cart-context";
import { toast } from "@/components/ui/use-toast-simplified";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

import { ProductModal } from "@/components/product-modal";

export function ProductCard({ product }: { product: Product }) {
    const { data: session } = useSession();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [mounted, setMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isClient = session?.user?.role === "CLIENT" || session?.user?.role === "ADMIN";
    const isApproved = session?.user?.approved;

    // Formatting price
    const priceFormatter = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    });

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product, quantity);
        // setCartOpen(true) is handled inside addToCart context method
        toast({
            title: "Producto agregado",
            description: `${quantity} x ${product.name} agregado al carrito`
        });
        setQuantity(1);
    };

    return (
        <>
            <Card
                className="overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-500 cursor-pointer group border-none bg-[#5c6d8a] shadow-md hover:-translate-y-1"
                onClick={() => setIsModalOpen(true)}
            >
                <div className="relative h-64 w-full bg-white overflow-hidden">
                    <img
                        src={product.imageUrl || "https://placehold.co/400?text=No+Image"}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                    {product.stock <= 0 && (
                        <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest z-10 shadow-lg">
                            Agotado
                        </div>
                    )}
                    {/* Glossy overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <CardHeader className="p-5 pb-2">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#122241] bg-[#facc15] px-2 py-0.5 rounded-sm shadow-sm">
                            {product.category}
                        </span>
                    </div>
                    <CardTitle className="text-base font-bold text-white line-clamp-2 min-h-[48px] leading-snug">
                        {product.name}
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-5 pt-0 flex-1">
                    <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed italic">
                        {product.description}
                    </p>
                </CardContent>

                <CardFooter className="p-5 flex flex-col gap-4 bg-black/10">
                    <div className="w-full flex items-center justify-between">
                        {!mounted ? (
                            <div className="h-6 w-24 bg-white/10 animate-pulse rounded" />
                        ) : isApproved ? (
                            <div className="text-2xl font-black text-[#facc15] drop-shadow-sm">
                                {priceFormatter.format(product.price)}
                            </div>
                        ) : (
                            <div className="text-xs text-zinc-300 italic flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#facc15] animate-pulse" />
                                {session ? "Pendiente" : "Logueate"}
                            </div>
                        )}
                        {session?.user?.role === "ADMIN" && (
                            <div className="text-[10px] uppercase font-bold text-zinc-400 bg-white/5 px-2 py-1 rounded">
                                Stock: {product.stock > 0 ? product.stock : 0}
                            </div>
                        )}
                        {session?.user?.role !== "ADMIN" && (
                            <div className={cn(
                                "text-[10px] uppercase font-bold px-2 py-1 rounded",
                                product.stock > 0 ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"
                            )}>
                                {product.stock > 0 ? "Disponible" : "Sin Stock"}
                            </div>
                        )}
                    </div>

                    {isApproved && product.stock > 0 && (
                        <div className="flex items-center gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center bg-black/20 rounded-lg p-1">
                                <Button
                                    variant="ghost" size="icon" className="h-7 w-7 rounded-md text-white hover:bg-white/10"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-bold text-white">{quantity}</span>
                                <Button
                                    variant="ghost" size="icon" className="h-7 w-7 rounded-md text-white hover:bg-white/10"
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    disabled={quantity >= product.stock}
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                            <Button
                                className="flex-1 h-9 bg-[#facc15] text-[#122241] hover:bg-[#eab308] font-bold shadow-lg shadow-yellow-500/10 border-none"
                                disabled={!isApproved || product.stock <= 0}
                                onClick={handleAddToCart}
                            >
                                Agregar
                            </Button>
                        </div>
                    )}

                    {!isApproved && (
                        <Button
                            variant="secondary"
                            className="w-full h-9 bg-white/10 text-white hover:bg-white/20 border-none"
                            disabled
                        >
                            {product.stock <= 0 ? "Sin Stock" : "Ver Detalle"}
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <ProductModal
                product={product}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isApproved={isApproved || false}
                session={session}
            />
        </>
    );
}
