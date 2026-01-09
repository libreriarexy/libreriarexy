"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: email.toLowerCase(),
                password,
            });

            if (result?.error) {
                setError("Credenciales inválidas. Intente nuevamente.");
            } else {
                router.refresh();
                router.push("/");
            }
        } catch (e) {
            setError("Ocurrió un error inesperado.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#7e92a8] p-4">
            <Card className="w-full max-w-md shadow-2xl border-none rounded-[2.5rem] bg-[#122241] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#facc15]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <CardHeader className="space-y-2 items-center text-center pb-8 pt-10">
                    <div className="w-16 h-16 bg-[#facc15] rounded-2xl flex items-center justify-center mb-4 rotate-3 shadow-xl">
                        <BookOpen className="text-[#122241] w-8 h-8" />
                    </div>
                    <CardTitle className="text-3xl font-black uppercase tracking-tighter">Bienvenido</CardTitle>
                    <CardDescription className="text-zinc-400 font-medium">
                        Ingresa a WebRexy con tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-12 px-10">
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-[#facc15] ml-1">Email</Label>
                            <Input
                                id="email"
                                placeholder="nombre@ejemplo.com"
                                type="email"
                                className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-[#facc15]/20"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-[#facc15] ml-1">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-[#facc15]/20"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                                <p className="text-xs font-bold text-red-400 text-center">{error}</p>
                            </div>
                        )}
                        <Button className="w-full h-14 bg-[#facc15] hover:bg-[#facc15]/90 text-[#122241] font-black text-lg rounded-2xl shadow-xl shadow-[#facc15]/10 mt-4" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="mr-2 h-5 w-5 animate-spin rounded-full border-3 border-[#122241] border-t-transparent" />
                            ) : "Ingresar"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
