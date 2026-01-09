"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";

export async function toggleUserApproval(userId: string, approve: boolean) {
    try {
        await db.toggleUserApproval(userId, approve);

        // If approved, notify the user
        if (approve) {
            const users = await db.getUsers();
            const user = users.find(u => u.id === userId);
            if (user) {
                const subject = "¡Cuenta Aprobada! - Librería Rexy";
                const html = `
                    <div style="font-family: sans-serif; color: #122241; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f1f1;">
                        <h1 style="color: #122241; border-bottom: 2px solid #facc15; padding-bottom: 10px;">¡Buenas noticias, ${user.name}!</h1>
                        <p style="font-size: 16px; line-height: 1.6;">Tu registro en <strong>Librería Rexy</strong> ha sido aprobado por el administrador.</p>
                        <p style="font-size: 16px; line-height: 1.6;">Ya puedes ingresar a la plataforma, ver los precios mayoristas y realizar tus pedidos online.</p>
                        <div style="margin-top: 30px; text-align: center;">
                            <a href="https://libreriarexy.vercel.app/login" style="background-color: #facc15; color: #122241; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px;">Ingresar a mi cuenta</a>
                        </div>
                        <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">¡Gracias por confiar en nosotros!</p>
                    </div>
                `;
                await sendEmail(user.email, subject, html);
            }
        }
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Error toggling user approval:", error);
        return { success: false, error: "Failed to update user." };
    }
}

export async function updateUserBalance(userId: string, delta: number) {
    try {
        await db.updateUserBalance(userId, delta);
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update balance." };
    }
}
