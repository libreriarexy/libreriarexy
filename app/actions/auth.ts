"use server";

import { db } from "@/lib/db";
import { User } from "@/types";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";

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

    // Send Welcome Email
    const subject = "Registro Recibido - Librería Rexy";
    const html = `
        <div style="font-family: sans-serif; color: #122241; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f1f1; rounded: 20px;">
            <h1 style="color: #122241; border-bottom: 2px solid #facc15; padding-bottom: 10px;">Hola ${name},</h1>
            <p style="font-size: 16px; line-height: 1.6;">Te has registrado en la pagina web <strong>Librería Rexy</strong>.</p>
            <p style="font-size: 16px; line-height: 1.6;">Espere hasta que el administrador del sitio apruebe su registro. Se le notificará una vez que se haya aprobado.</p>
            <p style="font-size: 16px; line-height: 1.6; font-weight: bold; margin-top: 30px;">¡Gracias!</p>
            <div style="margin-top: 40px; border-top: 1px solid #f1f1f1; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
                Este es un mensaje automático, por favor no responda a este correo.
            </div>
        </div>
    `;
    await sendEmail(email, subject, html);

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
