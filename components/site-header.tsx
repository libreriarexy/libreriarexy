"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, LogOut, Package, BookOpen, User as UserIcon, LayoutDashboard } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CartBadge } from "@/components/cart-badge";
import { useEffect, useState } from "react";

export function SiteHeader() {
    const { data: session, status } = useSession();
    const { setCartOpen } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const user = session?.user;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-[#122241] text-white">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative h-12 w-16 overflow-hidden rounded-md">
                        <Image
                            src="/logo.jpg"
                            alt="WebRexy Logo"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-[#facc15] uppercase block">
                        LIBRERÍA REXY
                    </span>
                </Link>

                <nav className="flex items-center gap-2 md:gap-4">
                    {/* Catalog Link - Always visible */}
                    <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10 hidden sm:flex">
                        <Link href="/catalog">
                            <BookOpen className="mr-2 h-4 w-4 text-[#facc15]" />
                            Catálogo
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="text-white sm:hidden text-[#facc15]">
                        <Link href="/catalog">
                            <BookOpen className="h-5 w-5" />
                        </Link>
                    </Button>

                    {!mounted ? (
                        <div className="w-20" /> // Placeholder while hydrating
                    ) : session ? (
                        <div className="flex items-center gap-2 md:gap-4">
                            {user?.role === "ADMIN" && (
                                <Button asChild variant="ghost" size="sm" className="hidden lg:flex text-white hover:bg-white/10">
                                    <Link href="/admin">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        Panel Admin
                                    </Link>
                                </Button>
                            )}

                            <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10 hidden md:flex">
                                <Link href="/profile">
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    Mi Cuenta
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="icon" className="text-white md:hidden">
                                <Link href="/profile">
                                    <UserIcon className="h-5 w-5" />
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                className="relative bg-white/10 border-white/20 hover:bg-white/20"
                                onClick={() => setCartOpen(true)}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                <CartBadge />
                            </Button>

                            <div className="flex items-center gap-2 border-l pl-4 ml-2">
                                <div className="text-sm text-right hidden md:block">
                                    <p className="font-medium leading-none">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                </div>

                                <Button variant="ghost" size="icon" onClick={() => signOut()}>
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" className="text-white hover:bg-white/10">
                                <Link href="/login">Ingresar</Link>
                            </Button>
                            <Button asChild className="bg-[#facc15] text-[#122241] hover:bg-[#eab308]">
                                <Link href="/register">Registrarse</Link>
                            </Button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
