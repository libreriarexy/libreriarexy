"use server";

import { db } from "@/lib/db";
import { OrderItem } from "@/types";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { sendEmail } from "@/lib/email";

export async function createOrder(
    items: OrderItem[],
    total: number,
    userId: string,
    userEmail: string
) {
    try {
        // 1. Validate Stock
        for (const item of items) {
            const product = await db.getProduct(item.productId);
            if (!product || product.stock < item.quantity) {
                return { success: false, error: `Stock insuficiente para ${item.productName}` };
            }
        }

        // 2. Deduct Stock
        // In a real DB with transactions, this would be safer.
        // For now we loop. If one fails mid-way, we are in trouble (mock logic limitation).
        // We assume strict sequential processing here.
        for (const item of items) {
            const ok = await db.updateStock(item.productId, -item.quantity);
            if (!ok) {
                // Should rollback others, but for prototype we skip complexity
                return { success: false, error: "Error al actualizar stock al momento de pagar." };
            }
        }

        // 3. Create Order
        const orderId = await db.createOrder({
            id: crypto.randomUUID(),
            userId,
            userEmail,
            items,
            total,
            status: "PENDING",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        // 4. Send Email
        const subject = `Confirmación de Pedido #${orderId.slice(0, 8)}`;
        const html = `
        <h1>Gracias por su compra</h1>
        <p>Hemos recibido su pedido por un total de <strong>$${total.toLocaleString("es-AR")}</strong>.</p>
        <p>Queda pendiente de preparación.</p>
    `;
        await sendEmail(userEmail, subject, html);

        revalidatePath("/admin/orders");
        revalidatePath("/"); // Stock update
        revalidatePath("/catalog"); // Stock update

        return { success: true, orderId };
    } catch (error) {
        console.error("Order creation failed:", error);
        return { success: false, error: "Error interno del servidor." };
    }
}
