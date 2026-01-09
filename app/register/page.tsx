"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { registerUser } from "@/app/actions/auth";
import { toast } from "@/components/ui/use-toast-simplified";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const result = await registerUser(formData);

        if (result.success) {
            toast({ title: "Registro exitoso", description: "Espera la aprobación del administrador." });
            router.push("/login"); // Redirect to login
        } else {
            toast({ title: "Error", description: result.error || "Falló el registro" });
        }

        setIsLoading(false);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
                    <CardDescription>
                        Solicita acceso a WebRexy
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input id="name" name="name" required disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Domicilio</Label>
                            <Input id="address" name="address" placeholder="Calle y Número, Ciudad" required disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono Celular</Label>
                            <Input id="phone" name="phone" type="tel" placeholder="351..." required disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input id="password" name="password" type="password" required disabled={isLoading} />
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Registrando..." : "Registrarse"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <div className="text-sm text-center w-full">
                        ¿Ya tienes cuenta? <Link href="/login" className="underline">Iniciar Sesión</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
