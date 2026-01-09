"use client";

import { useState } from "react";
import { User } from "@/types";
import { updateProfile } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast-simplified";
import { Loader2, Save, Eye, EyeOff, Edit3, X } from "lucide-react";

export function ProfileForm({ user }: { user: User }) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await updateProfile(user.id, formData);

        if (result.success) {
            toast({
                title: "Perfil actualizado",
                description: "Tus datos se han guardado correctamente.",
            });
            setIsEditing(false);
        } else {
            toast({
                title: "Error",
                description: result.error || "Ocurrió un error al actualizar el perfil.",
            });
        }
        setLoading(false);
    }

    if (!isEditing) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#122241]/50">Nombre</p>
                        <p className="text-[#122241] font-semibold">{user.name}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#122241]/50">Email</p>
                        <p className="text-[#122241] font-semibold">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#122241]/50">Dirección</p>
                        <p className="text-[#122241] font-semibold">{user.address || "No especificada"}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#122241]/50">Teléfono</p>
                        <p className="text-[#122241] font-semibold">{user.phone || "No especificado"}</p>
                    </div>
                </div>

                <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full h-12 bg-[#122241] hover:bg-[#122241]/90 text-white font-bold gap-2 rounded-xl border-none"
                >
                    <Edit3 className="h-4 w-4 text-[#facc15]" />
                    Modificar Información
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-[#122241] font-bold text-xs uppercase tracking-wider">Nombre Completo</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={user.name}
                    className="h-11 border-zinc-200 text-[#122241] focus-visible:ring-primary/20"
                    required
                />
            </div>

            <div className="space-y-2 opacity-60">
                <Label htmlFor="email" className="text-[#122241] font-bold text-xs uppercase tracking-wider">Correo Electrónico (No editable)</Label>
                <Input
                    id="email"
                    name="email"
                    value={user.email}
                    disabled
                    className="h-11 bg-zinc-50 border-zinc-200 text-[#122241]"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="address" className="text-[#122241] font-bold text-xs uppercase tracking-wider">Dirección de Entrega</Label>
                <Input
                    id="address"
                    name="address"
                    defaultValue={user.address}
                    placeholder="Calle 123, Ciudad"
                    className="h-11 border-zinc-200 text-[#122241] focus-visible:ring-primary/20"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#122241] font-bold text-xs uppercase tracking-wider">Número de Teléfono</Label>
                <Input
                    id="phone"
                    name="phone"
                    defaultValue={user.phone}
                    placeholder="+54 9..."
                    className="h-11 border-zinc-200 text-[#122241] focus-visible:ring-primary/20"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-[#122241] font-bold text-xs uppercase tracking-wider">Contraseña</Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        defaultValue={user.password}
                        className="h-11 pr-10 border-zinc-200 text-[#122241] focus-visible:ring-primary/20"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#122241]"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-11 border-zinc-200 text-zinc-500 rounded-xl"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className="flex-[2] h-11 bg-[#facc15] text-[#122241] hover:bg-[#eab308] font-black gap-2 rounded-xl border-none shadow-lg shadow-yellow-500/10"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Guardar Cambios
                </Button>
            </div>
        </form>
    );
}
