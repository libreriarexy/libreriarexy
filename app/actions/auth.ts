"use server";

import { db } from "@/lib/db";
import { User } from "@/types";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;

    if (!name || !email || !password || !address || !phone) {
        return { success: false, error: "Todos los campos son obligatorios." };
    }

    const existing = await db.getUserByEmail(email);
    if (existing) {
        return { success: false, error: "El email ya está registrado." };
    }

    const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name,
        role: "PENDING",
        approved: false,
        balance: 0,
        createdAt: new Date().toISOString(),
        address,
        phone,
        password, // Guardamos la contraseña (demo)
    };

    await db.createUser(newUser);
    return { success: true };
}

export async function updateProfile(userId: string, formData: FormData) {
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    if (!name || !address || !phone || !password) {
        return { success: false, error: "Todos los campos son obligatorios." };
    }

    // Get current user to preserve other fields
    const users = await db.getUsers();
    const currentUser = users.find(u => u.id === userId);

    if (!currentUser) {
        return { success: false, error: "Usuario no encontrado." };
    }

    const updatedUser: User = {
        ...currentUser,
        name,
        address,
        phone,
        password,
    };

    await db.updateUser(updatedUser);

    // Revalidar para que se vean los cambios
    revalidatePath("/profile");

    return { success: true };
}
