"use client";

import { useCart } from "@/context/cart-context";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createOrder } from "@/app/actions/orders"; // Will implement this next
import { toast } from "@/components/ui/use-toast-simplified";

export default function CartPage() {
    const { items, removeFromCart, clearCart, total } = useCart();
    const { data: session } = useSession();
    const router = useRouter();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const priceFormatter = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    });

    const handleCheckout = async () => {
        if (!session) {
            toast({ title: "Inicia Sesión", description: "Debes iniciar sesión para comprar." });
            router.push("/login");
            return;
        }

        setIsCheckingOut(true);
        try {
            const orderItems = items.map(i => ({
                productId: i.product.id,
                quantity: i.quantity,
                productName: i.product.name,
                priceAtPurchase: i.product.price
            }));

            const result = await createOrder(orderItems, total, session.user.id, session.user.email || "");

            if (result.success) {
                clearCart();
                toast({ title: "Pedido Exitoso", description: "Tu pedido ha sido registrado." });
                router.push("/profile"); // Or orders page
            } else {
                toast({ title: "Error", description: result.error || "No se pudo procesar el pedido." });
            }
        } catch (e) {
            console.error(e);
            toast({ title: "Error", description: "Ocurrió un error inesperado." });
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <>
            <SiteHeader />
            <main className="container py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg mb-4">Tu carrito está vacío.</p>
                        <Link href="/">
                            <Button>Ver Catálogo</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-4">
                            {items.map((item) => (
                                <Card key={item.product.id}>
                                    <CardContent className="p-4 flex gap-4 items-center">
                                        <div className="h-16 w-16 bg-zinc-100 rounded-md overflow-hidden flex-shrink-0">
                                            <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">{item.product.name}</p>
                                            <p className="text-sm text-muted-foreground">{priceFormatter.format(item.product.price)} x {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{priceFormatter.format(item.product.price * item.quantity)}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeFromCart(item.product.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div>
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <CardTitle className="text-xl">Resumen</CardTitle>
                                    <div className="flex justify-between border-b pb-4">
                                        <span>Total</span>
                                        <span className="font-bold text-xl">{priceFormatter.format(total)}</span>
                                    </div>
                                    <div className="grid gap-2">
                                        <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                                            {isCheckingOut ? "Procesando..." : "Finalizar Pedido"}
                                        </Button>
                                        <Link href="/">
                                            <Button variant="outline" className="w-full">
                                                Seguir Comprando
                                            </Button>
                                        </Link>
                                    </div>
                                    <p className="text-xs text-center text-muted-foreground">
                                        Al confirmar, el pedido quedará pendiente de preparación.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}
