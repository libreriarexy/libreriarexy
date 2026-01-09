"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { X, Minus, Plus, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { toast } from "@/components/ui/use-toast-simplified";

interface ProductModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
    isApproved: boolean;
    session: any;
}

export function ProductModal({ product, isOpen, onClose, isApproved, session }: ProductModalProps) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Combine main image with extra images, ensuring no empties
    const allImages = [product.imageUrl, ...(product.images || [])]
        .map(img => img?.trim())
        .filter(img => img && img.length > 0);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setActiveImageIndex(0);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const priceFormatter = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    });

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast({
            title: "Producto agregado",
            description: `${quantity} x ${product.name} agregado al carrito`
        });
        onClose();
    };

    const nextImage = () => {
        setActiveImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-background w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">

                {/* Close Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10 rounded-full hover:bg-black/10"
                    onClick={onClose}
                >
                    <X className="h-6 w-6" />
                </Button>

                {/* Left Side: Images */}
                <div className="flex-1 bg-zinc-50 relative flex flex-col items-center justify-center p-4 min-h-[300px] md:min-h-[500px]">
                    <div className="relative w-full h-full flex items-center justify-center group">
                        <img
                            src={allImages[activeImageIndex] || "https://placehold.co/600?text=No+Image"}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain rounded-lg transition-all duration-500"
                        />

                        {allImages.length > 1 && (
                            <>
                                <Button
                                    variant="ghost" size="icon"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={prevImage}
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                                <Button
                                    variant="ghost" size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={nextImage}
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 w-full justify-center">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    className={cn(
                                        "w-16 h-16 rounded-md overflow-hidden border-2 transition-all flex-shrink-0",
                                        activeImageIndex === idx ? "border-primary scale-110 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                                    )}
                                    onClick={() => setActiveImageIndex(idx)}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side: Info */}
                <div className="flex-1 p-6 md:p-10 flex flex-col h-full bg-white">
                    <div className="mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#facc15] bg-[#122241] px-3 py-1 rounded-full">
                            {product.category}
                        </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#122241] mb-4">
                        {product.name}
                    </h2>

                    <div className="mb-6">
                        {isApproved ? (
                            <div className="text-4xl font-bold text-primary">
                                {priceFormatter.format(product.price)}
                            </div>
                        ) : (
                            <div className="bg-zinc-100 p-4 rounded-lg text-sm text-muted-foreground italic border-l-4 border-primary">
                                {session ? "Tu cuenta aún no ha sido aprobada por un administrador para ver precios." : "Inicia sesión para ver precios y stock disponible."}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto mb-6 pr-2">
                        <h4 className="font-bold text-sm text-zinc-400 uppercase tracking-widest mb-2">Descripción</h4>
                        <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
                            {product.details || product.description || "Sin descripción disponible."}
                        </p>
                    </div>

                    <div className="space-y-6 mt-auto">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Estado:</span>
                            <span className={cn(
                                "font-bold",
                                product.stock > 0 ? "text-green-600" : "text-destructive"
                            )}>
                                {product.stock > 0 ? "Disponible" : "Sin Stock"}
                            </span>
                            {session?.user?.role === "ADMIN" && product.stock > 0 && (
                                <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-500 font-bold ml-2">
                                    ({product.stock} u.)
                                </span>
                            )}
                        </div>

                        {isApproved && product.stock > 0 && (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border-2 border-zinc-200 rounded-lg overflow-hidden h-12">
                                        <button
                                            className="px-4 hover:bg-zinc-50 transition-colors disabled:opacity-30"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                        <button
                                            className="px-4 hover:bg-zinc-50 transition-colors disabled:opacity-30"
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            disabled={quantity >= product.stock}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Subtotal: <span className="font-bold text-[#122241]">{priceFormatter.format(product.price * quantity)}</span>
                                    </p>
                                </div>

                                <Button
                                    className="w-full h-14 text-lg font-bold gap-2 shadow-lg shadow-primary/20"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    Agregar al Carrito
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
